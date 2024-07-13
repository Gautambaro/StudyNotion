var smtp = require('../');
var test = require('tap').test;
var through = require('through');

var seq = require('seq');
var fs = require('fs');

test('client/server', function (t) {
    t.plan(5);
    
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    var server = smtp.createServer('localhost', function (req) {
        req.on('to', function (to, ack) {
            var domain = to.split('@')[1];
            if (domain === 'localhost') ack.accept()
            else ack.reject(553, [
                'Recipients must be on these domains:',
                'localhost',
            ])
        });
        
        req.on('message', function (stream, ack) {
            t.equal(req.from, 'beep@localhost');
            t.deepEqual(req.to, [ 'boop@localhost' ]);
            
            var data = '';
            stream.on('data', function (buf) { data += buf });
            stream.on('end', function () {
                t.equal(data, 'Beep boop.\r\n...I am a computer.\r\n');
            });
            ack.accept();
        });
        
        req.on('quit', function () {
            t.ok(true);
        });
    });
    server.listen(port, function () {
        var script = '';
        var c = smtp.connect(port, sendData);
        
        var script = '';
        c.on('data', function (buf) { script += buf });
        
        c.on('end', function () {
            t.equal(script, [
                '220 localhost',
                '250 localhost',
                '250 OK',
                '553-Recipients must be on these domains:',
                '553 localhost',
                '250 OK',
                '354 OK',
                '250 OK',
                '221 Bye!',
                ''
            ].join('\r\n'));
            t.end();
            server.close();
        });
    });
});

function sendData (mail) {
    seq()
        .seq_(function (next) {
            mail.on('greeting', function (code, lines) {
                next();
            });
        })
        .seq(function (next) {
            mail.helo('localhost', this);
        })
        .seq(function () {
            mail.from('beep@localhost', this);
        })
        .seq(function () {
            mail.to('boop@example.com', this.ok);
        })
        .seq(function () {
            mail.to('boop@localhost', this);
        })
        .seq(function () {
            mail.data(this)
        })
        .seq(function () {
            var stream = through();
            setTimeout(function () {
                stream.queue('Beep boop.\r\n');
            }, 10);
            setTimeout(function () {
                stream.queue('...I am a computer.');
                stream.queue(null);
            }, 20);
            mail.message(stream, this);
        })
        .seq(function () {
            mail.quit(this);
        })
    ;
}
