var hrefs = [
    "https://bitbucket.org/anshbansal92/",
    "https://gitlab.com/u/asmbansal2",
    "https://github.com/anshbansal",
    "https://www.linkedin.com/in/bansalaseem",
    "https://www.kaggle.com/anshbansal",
    "https://www.twitter.com/AseemBansal2",
    "https://anshbansal.wordpress.com/"
];

var hrefMapping = {
    "anshbansal.wordpress.com": "wordpress.com"
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
        domain = hrefMapping[domain];
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