var Metalsmith = require('metalsmith');
Metalsmith(process.cwd())
    .metadata({
        title: "Kina Works",
        description: "Kina's Website",
        navs: [{
            icon: "<span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span>",
            ref: "app/",
            title: "App"
        }, {
            icon: "<span class=\"glyphicon glyphicon-cloud\" aria-hidden=\"true\"></span>",
            ref: "app/web/",
            title: "WEBApp"
        }, {
            icon: "<span class=\"glyphicon glyphicon-music\" aria-hidden=\"true\"></span>",
            ref: "music/",
            title: "Music"
        }, {
            icon: "<span class=\"glyphicon glyphicon-blackboard\" aria-hidden=\"true\"></span>",
            ref: "image/",
            title: "Image"
        }, {
            icon: "<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>",
            ref: "log/",
            title: "Log"
        }, {
            icon: "<span class=\"glyphicon glyphicon-flash\" aria-hidden=\"true\"></span>",
            ref: "other/",
            title: "Misc"
        }, {
            icon: "<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>",
            ref: "me.html",
            title: "Me"
        }, {
            icon: "<span class=\"glyphicon glyphicon-gift\" aria-hidden=\"true\"></span>",
            ref: "donate.html",
            title: "Donate"
        }, {
            icon: "<span class=\"glyphicon glyphicon-link\" aria-hidden=\"true\"></span>",
            ref: "link.html",
            title: "Link"
        }]
    })
    .use((require('metalsmith-drafts'))())
    .use((require('metalsmith-env'))())
    .use((require('metalsmith-updated'))())
    .use((require('metalsmith-register-helpers'))({
        directory: "./helpers"
    }))
    .use((require('./local_plugins/crafterkina-addmeta/index.js'))({
        'log/post/**': "log/post/metadata.json"
    }))
    .use((require('metalsmith-paths'))({
        directoryIndex: "index.html"
    }))
    .use((require('metalsmith-metallic'))())
    .use((require('metalsmith-assets'))({
        source: "./assets",
        destination: "./assets"
    }))
    .use((require('metalsmith-tags'))({
        handle: "tags",
        metadataKey: "allTags",
        path: "log/tags/:tag.html",
        layout: "tag.html",
        sortBy: "created",
        reverse: false,
        skipMetadata: false
    }))
    .use((require('metalsmith-collections'))({
        'blog-posts': {
            pattern: "log/post/**",
            sortBy: "created",
            reverse: false
        }
    }))
    .use((require('metalsmith-rootpath'))())
    .use((require('metalsmith-in-place'))({
        engine: "handlebars",
        partials: "layouts/partials"
    }))
    .use((require('metalsmith-markdown'))())
    .use((require('metalsmith-layouts'))({
        engine: "handlebars",
        partials: "layouts/partials",
        rename: true
    }))
    .use((require('metalsmith-html-minifier'))("*.html"))
    // .use((require('./local_plugins/crafterkina-showmeta/index.js'))())
    .build(
        function(err) {
            if (err) throw err;
            console.log('Build finished!');
        }
    );