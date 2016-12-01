import codecs
import json
import re
import xml.etree.cElementTree as ET
import pprint

lower = re.compile(r'^([a-z]|_)*$')
lower_colon = re.compile(r'^([a-z]|_)*:([a-z]|_)*$')
problem_chars = re.compile(r'[=\+/&<>;\'"\?%#$@\,\. \t\r\n]')

OSM_FILE = "new-delhi_india.osm"


def get_element(osm_file, tags=('node', 'way', 'relation')):
    """Yield element if it is the right type of tag

    Reference:
    http://stackoverflow.com/questions/3095434/inserting-newlines-in-xml-file-generated-via-xml-etree-elementtree-in-python
    """
    context = iter(ET.iterparse(osm_file, events=('start', 'end')))
    _, root = next(context)
    for event, elem in context:
        if tags is not None and elem.tag not in tags:
            continue
        if event == 'end':
            yield elem
            root.clear()


def take_sample(k, osm_file, sample_file):
    """
    Takes a kth sample of osm_file and save it as sample_file
    """
    with open(sample_file, 'wb') as output:
        output.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        output.write('<osm>\n  ')

        # Write every kth top level element
        for i, element in enumerate(get_element(osm_file)):
            if i % k == 0:
                # print "i is {}".format(i)
                output.write(ET.tostring(element, encoding='utf-8'))

        output.write('</osm>')


"""
Your task is to explore the data a bit more.
Before you process the data and add it into your database, you should check the
"k" value for each "<tag>" and see if there are any potential problems.

We have provided you with 3 regular expressions to check for certain patterns
in the tags. As we saw in the quiz earlier, we would like to change the data
model and expand the "addr:street" type of keys to a dictionary like this:
{"address": {"street": "Some value"}}
So, we have to see if we have such tags, and if we have any tags with
problematic characters.

Please complete the function 'key_type', such that we have a count of each of
four tag categories in a dictionary:
  "lower", for tags that contain only lowercase letters and are valid,
  "lower_colon", for otherwise valid tags with a colon in their names,
  "problemchars", for tags with problematic characters, and
  "other", for other tags that do not fall into the other three categories.
See the 'process_map' and 'test' functions for examples of the expected format.
"""


def _key_type(element, keys):
    """
    takes an element and update keys dictionary's count
    for the type to which element belongs
    """
    if element.tag == "tag":
        k = element.attrib['k']
        if problem_chars.search(k):
            print "problemchars {}".format(k)
            keys['problemchars'] += 1
        elif lower_colon.search(k):
            keys['lower_colon'] += 1
        elif lower.search(k):
            keys['lower'] += 1
        else:
            # print "other {}".format(k)
            keys['other'] += 1

    return keys


def keys_type():
    """
    Get a dictionary containing the type of keys which is present in our OSM file
    """
    keys = {"lower": 0, "lower_colon": 0, "problemchars": 0, "other": 0}
    for element in get_element(OSM_FILE, ('tag',)):
        keys = _key_type(element, keys)

    return keys


"""
Your task is to explore the data a bit more.
The first task is a fun one - find out how many unique users
have contributed to the map in this particular area!

The function process_map should return a set of unique user IDs ("uid")
"""


def unique_user_contributed(tags=('node', 'relation',)):
    users = set()
    for element in get_element(OSM_FILE, tags):
        users.add(element.attrib['user'])
    return users


CREATED = ["version", "changeset", "timestamp", "user", "uid"]

def ensure_key_value(_dict, key, val):
    if key not in _dict:
        _dict[key] = val
    return _dict[key]

STATE_MAPPING = {
    'delhi': 'DL',
    'uttar pradesh': 'UP',
    'u.p.': 'UP',
    'ncr': 'DL'
}

CITY_MAPPING = {
    'gurugram': 'Gurgaon',
    'gurgram': 'Gurgaon',
    'faridabad': 'Faridabad',
    'delh': 'Delhi',
    'new delhi': 'Delhi',
    'neew delhi': 'Delhi',
    'delhi': 'Delhi',
    'old delhi': 'Delhi',
    'noida': 'Noida',
    'greater noida': 'Noida',
    'ghaziabad': 'Ghaziabad',
    'bahadurgarh': 'Bahadurgarh',
    'meerut': 'Meerut'
}



CITY_TO_STATE = {
    'Gurgaon': 'HR',
    'Faridabad': 'HR',
    'Delhi': 'DL',
    'Noida': 'UP',
    'Ghaziabad': 'UP',
    'Bahadurgarh': 'HR',
    'Meerut': 'UP'
}


def fix_address_value(address_type, value):

    def if_lower_in_mapping_then_replace(value, mapping):
        if value.lower() in mapping:
            value = mapping[value.lower()]

        if value not in set(mapping.values()):
            #print "{} = {}".format(address_type, value)
            pass
        return value

    if address_type == 'state':
        value = if_lower_in_mapping_then_replace(value, STATE_MAPPING)
    elif address_type == 'city':
        value = if_lower_in_mapping_then_replace(value, CITY_MAPPING)

    return value


def ensure_address(element_map):
    if 'address' not in element_map:
        element_map['address'] = {
            'country': 'IN'
        }
    return element_map['address']


def map_city_to_states(address_map):
    if 'city' in address_map:
        city = address_map['city']
        if city in CITY_TO_STATE:
            address_map['state'] = CITY_TO_STATE[city]


def fix_address(element_map):
    """
    After we are done with general processing of individual address fields
    we process it as a whole
    """
    address_map = ensure_address(element_map)

    map_city_to_states(address_map)


def process_tags(element, node):
    for tag in element.iter('tag'):
        key = tag.attrib['k']
        value = tag.attrib['v']

        if problem_chars.search(key):
            continue

        if key.startswith("addr:"):
            _parts = key.split(":")
            if len(_parts) > 2:
                continue

            obj = ensure_key_value(node, 'address', {})

            address_type = _parts[1]
            value = fix_address_value(address_type, value)

            obj[address_type] = value
        else:
            node[key] = value

    fix_address(node)


def shape_element(element):
    """
    Takes an element and shapes it to be ready for insertion into the database
    """
    node = {}

    if element.tag == "node" or element.tag == "way":

        node['type'] = element.tag
        process_tags(element, node)

        for nd in element.iter('nd'):
            obj = ensure_key_value(node, 'node_refs', [])
            obj.append(nd.attrib['ref'])

        for key, value in element.attrib.iteritems():
            if key in CREATED:
                ensure_key_value(node, 'created', {})
                node['created'][key] = value
            elif key == 'lat':
                ensure_key_value(node, 'pos', [0, 0])
                node['pos'][0] = float(value)
            elif key == 'lon':
                ensure_key_value(node, 'pos', [0, 0])
                node['pos'][1] = float(value)
            else:
                node[key] = value

        return node
    else:
        return None


def get_client():
    from pymongo import MongoClient
    return MongoClient('mongodb://localhost:27017/')


def get_collection():
    return get_client().examples.osm


def process_map(file_in, pretty=False):
    """
    Saves file as a json ready for insertion into mongoDB using mongoimport
    """
    file_out = "{0}.json".format(file_in)
    with codecs.open(file_out, "w") as fo:
        for element in get_element(file_in):
            el = shape_element(element)
            if el:
                if pretty:
                    fo.write(json.dumps(el, indent=2) + "\n")
                else:
                    fo.write(json.dumps(el) + "\n")


# some helper functions for running mongo DB queries

def aggregate_to_list(collection, query):
    result = collection.aggregate(query)
    return list(r for r in result)


def aggregate_and_show(collection, query, limit=True):
    _query = query[:]
    if limit:
        _query.append({"$limit": 5})

    pprint.pprint(aggregate_to_list(collection, query))


def aggregate(query):
    aggregate_and_show(collection, query, False)


def aggregate_distincts(field, limit = False):
    query = [
        {"$match": {field: {"$exists": 1}}},
        {"$group": {"_id": "$" + field,
                    "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    if limit:
        query.append({"$limit": 10})
    aggregate(query)


def contribution_of_top(n):
    result = aggregate_to_list(collection, [
        {"$group": {"_id": "$created.user",
                    "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": n},
        {"$group": {"_id": 1,
                    "count": {"$sum": "$count"}}}
    ])

    return result[0]['count']


def contributions_of(top):
    """
    Given a list of numbers returns a dictionary of contributions of those number of user
    """
    result = {}
    for count in top:
        result[count] = float(contribution_of_top(count) * 100) / collection.count()
    return result


collection = get_collection()
