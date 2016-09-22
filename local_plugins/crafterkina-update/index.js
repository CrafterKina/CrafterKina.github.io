'use strict'

var async = require('async')
var got = require('got')
var fs = require('fs')
var sep = require('path').sep

var defaults = {
    json: true,
    headers: {
        'user-agent': 'https://crafterkina.github.io/'
    },
    update: "update.json"
}

module.exports = function(options) {
    options = Object.assign(defaults, options || {});
    var path = options.path.replace(/[/\\]/g,sep);
    var update = options.update;
    var user = options.user;
    var repos = options.repos;
    if (Object.prototype.toString.call(repos) === '[object String]') {
        repos = [repos];
    }

    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata();
        var root = `${path}${sep}index.html`;
        if (!files[root]) files[root] = {
            "contents": ""
        };
        async.each(repos, function(repo, callback) {
                var file = {};
                var contents = {};
                contents.homepage = `https://crafterkina.github.io/${path}/${repo}/index.html`;
                contents.promos = {};
                var html = path + sep + repo + sep +"index.html";
                update = path + sep + repo + sep + update;
                got(`https://api.github.com/repos/${user}/${repo}/releases`, {
                    json: true,
                    headers: {
                        'accept': 'application/vnd.github.v3+json',
                    }
                }).then(res => {
                    async.series([
                            function(callback) {
                                async.each(res.body, function(item, callback) {
                                        if (!contents[item.target_commitish]) contents[item.target_commitish] = {};
                                        if (!files[html]) files[html] = {
                                            "contents": ""
                                        };
                                        if (!contents.promos[`${item.target_commitish}-latest`]) contents.promos[`${item.target_commitish}-latest`] = item.tag_name;
                                        if (!item.prerelease && !contents.promos[`${item.target_commitish}-recommended`]) {
                                            contents.promos[`${item.target_commitish}-recommended`] = item.tag_name;
                                        }
                                        files[html].github = JSON.stringify(item);
                                        contents[item.target_commitish][item.tag_name] = item.body;
                                        files[root][repo] = {
                                            version: item.tag_name,
                                            url: item.html_url,
                                            page: html
                                        };
                                        callback(null);
                                    },
                                    function(err) {
                                        callback(null, null);
                                    }
                                );
                            },
                            function(callback) {
                                file.contents = new Buffer(JSON.stringify(contents));
                                files[update] = file;
                                callback(null, null);
                            }
                        ],
                        function(err, results) {
                            callback(null);
                        })
                });
            },
            function(err) {
                if (err) done(err);
                done();
            }
        );
    }
}