var hrefs = [
    {
        link: "https://bitbucket.org/anshbansal92/",
        iconClass: "fa fa-bitbucket"
    },
    {
        link: "https://gitlab.com/u/asmbansal2",
        iconClass: "fa fa-gitlab"
    },
    {
        link: "https://github.com/anshbansal",
        iconClass: "fa fa-github"
    },
    {
        link: "https://www.linkedin.com/in/bansalaseem",
        iconClass: "fa fa-linkedin"
    },
    {
        link: "https://www.kaggle.com/anshbansal"
    },
    {
        link: "https://www.twitter.com/AseemBansal2",
        iconClass: "fa fa-twitter"
    },
    {
        link: "https://anshbansal.wordpress.com/",
        iconClass: "fa fa-wordpress"
    },
    {
        link: "https://programmingmadeagame.wordpress.com/",
        iconClass: "fa fa-wordpress"
    },
    {
        link: "http://stackoverflow.com/users/2235567/aseem-bansal",
        iconClass: "fa fa-stack-overflow"
    },
    {
        link: "https://www.codechef.com/users/anshbansal",
        image: "https://www.codechef.com/misc/favicon.ico"
    },
    {
        link: "https://www.hackerrank.com/anshbansal222"
    },
    {
        link: "https://en.gravatar.com/anshbansal92"
    },
    {
        link: "http://www.goodreads.com/user/show/32696810-aseem-bansal"
    },
    {
        link: "https://about.me/anshbansal"
    }
];
var CLOUDINARY_PREFIX = "https://res.cloudinary.com/anshbansal/image/fetch/w_28,h_28/";

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

function hasImage(href) {
    return _.isObject(href) && _.has(href, 'image');
}

function getFaviconUrl(href) {
    var domain = extractDomain(href['link']);
    return "https://" + domain + "/favicon.ico"
}

$(function () {

    var iconTemplate = _.template($("#icon-template").html());

    function htmlForIcon(href) {
        var link = href['link'];
        var iconClass = href['iconClass'] || '';
        return iconTemplate({
            href: link,
            iconClass: iconClass,
            iconUrl: CLOUDINARY_PREFIX + (hasImage(href) ? href['image'] : getFaviconUrl(href))
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