var hrefs = [
    "https://bitbucket.org/anshbansal92/",
    "https://gitlab.com/u/asmbansal2",
    "https://github.com/anshbansal",
    "https://www.linkedin.com/in/bansalaseem",
    "https://www.kaggle.com/anshbansal",
    "https://www.twitter.com/AseemBansal2",
    "https://anshbansal.wordpress.com/",
    "https://programmingmadeagame.wordpress.com/",
    "http://stackoverflow.com/users/2235567/aseem-bansal",
    "https://www.codechef.com/users/anshbansal",
    "https://en.gravatar.com/anshbansal92",
    "http://www.goodreads.com/user/show/32696810-aseem-bansal",
    "https://about.me/anshbansal"
];

var hrefMapping = {
    "anshbansal.wordpress.com": "https://wordpress.com/favicon.ico",
    "programmingmadeagame.wordpress.com": "https://wordpress.com/favicon.ico",
    "www.codechef.com": "https://www.codechef.com/misc/favicon.ico"
};

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function getFaviconUrl(href) {
    var domain = extractDomain(href);
    if (domain in hrefMapping) {
        return hrefMapping[domain];
    }
    return "https://" + domain + "/favicon.ico"
}

$(function () {

    var iconTemplate = _.template($("#icon-template").html());

    function htmlForIcon(href) {
        return iconTemplate({
            href: href,
            iconUrl: getFaviconUrl(href)
        });
    }

    function appendIconsTo(hrefList, to) {
        _.forEach(hrefList, function (href) {
            to.append(htmlForIcon(href));
        });
    }

    function main() {
        appendIconsTo(hrefs, $("#icons"));
    }

    main();

});