var path = require('path');
var extname = path.extname;
var yaml = require('js-yaml');
var match = require('minimatch');

var parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.yml': yaml.safeLoad
};

module.exports = function(opts) {
    opts = opts || {};

    return function(files, metalsmith, done) {
        var exts = Object.keys(parsers);
        for (let pattern of Object.keys(opts)) {
            var meta = opts[pattern].replace(/(\/|\\)/g, path.sep);
            var ext = extname(meta);
            var str = files[meta].contents.toString();
            var parse = parsers[ext];
            try {
                var data = parse(str);
            } catch (e) {
                return done(new Error('malformed data in "' + val + '"'));
            }
            delete files[meta];
            for (let file of Object.keys(files)) {
                if (match(file, pattern)) {
                    for (let datum of Object.keys(data)) {
                        files[file][datum] = data[datum];
                    }
                }
            }
        }
        done();
    };
};