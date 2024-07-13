var test = require('tap').test;
var smtp = require('../');

var EventEmitter = require('events').EventEmitter;

test('data/greeting race', {timeout: 1000}, function(t) {

    t.plan(3);

    stream = new EventEmitter();

    smtp.connect({stream: stream}, function(mail) {

        var listeners = stream.listeners('data');

        t.equals(listeners.length, 1, "data listener is bound");

        stream.emit('data', new Buffer('220 localhost ESMTP\r\n'));

        setTimeout(function() {
            mail.on('greeting', function(code, text) {
                t.equals(code, 220, "smtp code");
                t.equals(code, 220, "localhost ESMTP");
                t.end();
            })
        }, 250);

    });

});
