var through = require('through');
var combine = require('stream-combiner');

exports.dot = function (source) {
    var first = true;
    var dot = through(function (buf) {
        var data = buf.toString();
        var s = first
            ? data.replace(/(^|\n)\./g, '$1..')
            : data.replace(/\n\./g, '\n..')
        ;
        first = data.charCodeAt(data.length - 1) === 10;
        this.queue(s);
    });
    source.pipe(dot);
    return dot;
};

exports.undot = function (target) {
    var first = true;
    var dot = through(function (data) {
        var s = first
            ? data.replace(/(^|\n)\.\./g, '$1.')
            : data.replace(/\n\.\./g, '\n.')
        ;
        first = data.charCodeAt(data.length - 1) === 10;
        this.queue(s);
    });
    return combine(dot, target);
};
