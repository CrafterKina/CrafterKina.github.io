module.exports = function(opts) {
    opts = opts || {};

    return function(files, metalsmith, done) {
        console.log(files);
        done();
    }
}