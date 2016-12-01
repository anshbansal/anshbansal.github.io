#!/usr/bin/python

import sys
import pickle
sys.path.append("../tools/")

from feature_format import featureFormat, targetFeatureSplit
from tester import dump_classifier_and_data


def ratio(numerator, denominator):
    if numerator == 0 or denominator == 0:
        return 0

    return float(numerator) / denominator

### Task 1: Select what features you'll use.
### features_list is a list of strings, each of which is a feature name.
### The first feature must be "poi".
features_list = [
    'poi',
    'exercised_stock_options',
    'fraction_from_this_person_to_poi',
    'from_messages',
    'from_poi_to_this_person'
]

with open("final_project_dataset.pkl", "r") as data_file:
    data_dict = pickle.load(data_file)

    #remove outliers
    del data_dict['TOTAL']

    #Replace NaN with 0
    for key, value in data_dict.iteritems():
        for k, v in value.iteritems():
            if v == 'NaN':
                value[k] = 0

    #remove features with not enough value
    columns_to_remove = [
        'email_address',
        'loan_advances',
        'restricted_stock_deferred',
        'director_fees'
    ]
    for key, value in data_dict.iteritems():
        for column in columns_to_remove:
            del value[column]

    #Create new features
    for key, value in data_dict.iteritems():
        value['fraction_poi_to_this_person'] = ratio(value['from_poi_to_this_person'], value['to_messages'])
        value['fraction_from_this_person_to_poi'] = ratio(value['from_this_person_to_poi'], value['from_messages'])
        value['total_income'] = value['salary'] + value['bonus'] + value['long_term_incentive'] + \
                                value['other'] + value['expenses']

#Make final classifier for export
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler

steps = [
    ('scaler', MinMaxScaler()),
    ('classifier', KNeighborsClassifier(n_neighbors = 1))
]

from sklearn.pipeline import Pipeline
clf = Pipeline(steps)

### Task 3: Create new feature(s)
### Store to my_dataset for easy export below.
my_dataset = data_dict

### Extract features and labels from dataset for local testing
data = featureFormat(my_dataset, features_list, sort_keys = True)
labels, features = targetFeatureSplit(data)

### Task 4: Try a varity of classifiers
### Please name your classifier clf for easy export below.
### Note that if you want to do PCA or other multi-stage operations,
### you'll need to use Pipelines. For more info:
### http://scikit-learn.org/stable/modules/pipeline.html

# Provided to give you a starting point. Try a variety of classifiers.
# from sklearn.naive_bayes import GaussianNB
# clf = GaussianNB()

### Task 5: Tune your classifier to achieve better than .3 precision and recall 
### using our testing script. Check the tester.py script in the final project
### folder for details on the evaluation method, especially the test_classifier
### function. Because of the small size of the dataset, the script uses
### stratified shuffle split cross validation. For more info: 
### http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedShuffleSplit.html

# Example starting point. Try investigating other evaluation techniques!
from sklearn.cross_validation import train_test_split
features_train, features_test, labels_train, labels_test = \
    train_test_split(features, labels, test_size=0.3, random_state=42)

### Task 6: Dump your classifier, dataset, and features_list so anyone can
### check your results. You do not need to change anything below, but make sure
### that the version of poi_id.py that you submit can be run on its own and
### generates the necessary .pkl files for validating your results.

dump_classifier_and_data(clf, my_dataset, features_list)