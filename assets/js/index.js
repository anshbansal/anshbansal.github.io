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

var codingHrefs = [
    "https://github.com/anshbansal",
    "https://gitlab.com/u/asmbansal2",
    "https://bitbucket.org/anshbansal92/"
];

var socialHrefs = [
    "https://www.twitter.com/AseemBansal2",
    "https://www.linkedin.com/in/bansalaseem"
];

$(function () {

    var iconTemplate = _.template($("#icon-template").html());

    function htmlForIcon(href) {
        return iconTemplate({
            href: href,
            iconUrl: "https://" + extractDomain(href) + "/favicon.ico"
        });
    }

    function appendIconsTo(hrefList, to) {
        _.forEach(hrefList, function (href) {
            to.append(htmlForIcon(href));
        });
    }

    function main() {
        appendIconsTo(codingHrefs, $("#coding-icons"));
        appendIconsTo(socialHrefs, $("#social-icons"));
    }

    main();

});