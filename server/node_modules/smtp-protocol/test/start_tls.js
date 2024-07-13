var smtp = require('../');
var tls = require('tls');
var net = require('net');
var fs = require('fs');
var test = require('tap').test;
var concat = require('concat-stream');
var split = require('split');

var keys = {
    key: fs.readFileSync(__dirname + '/keys/key.pem'),
    cert: fs.readFileSync(__dirname + '/keys/cert.pem'),
    ca: fs.readFileSync(__dirname + '/keys/ca.pem')
};

test('server upgrade to TLS', function (t) {
    t.plan(10);
    t.on('end', function () {
        server.close();
    });
    
    var opts = {
        domain: 'beep',
        key: keys.key,
        cert: keys.cert
    };
    var server = smtp.createServer(opts, function (req) {
        req.on('tls', function () {
            t.ok(true, 'upgraded to tls');
        });
        
        req.on('from', function (from, ack) {
            t.equal(from, 'beep@a.com');
            ack.accept();
        });
        
        req.on('to', function (to, ack) {
            t.equal(to, 'boop@b.com');
            ack.accept();
        });
        
        req.on('message', function (stream, ack) {
            stream.pipe(concat(function (body) {
                t.equal(body, 'beep boop\r\n');
            }));
            ack.accept();
        });
        
        return server;
    });
    server.listen(0, function () {
        var stream = net.connect(server.address().port);
        
        var steps = [
            function (line) {
                t.equal(line, '220 beep');
                stream.write('ehlo beep\n');
            },
            function (line) {
                t.equal(line, '250-beep');
            },
            function (line) {
                t.equal(line, '250 STARTTLS');
                stream.write('starttls\n');
            },
            function (line) {
                t.equal(line, '220 Ready to start TLS.');
                
                t.ok(true, 'secure connection established');
                var sec = tls.connect({
                    servername: 'localhost',
                    socket: stream,
                    ca: keys.ca
                });
                sec.pipe(concat(function (body) {
                    t.deepEqual(body.toString('utf8').split(/\r?\n/), [
                        '250-beep',
                        '250 STARTTLS',
                        '250 OK',
                        '250 OK',
                        '354 OK',
                        '250 OK',
                        '221 Bye!',
                        ''
                    ]);
                }));
                sec.write('ehlo beep\n');
                sec.write('mail from:<beep@a.com>\n');
                sec.write('rcpt to:<boop@b.com>\n');
                sec.write('data\nbeep boop\n.\nquit\n')
            }
        ];
        
        var ix = -1;
        stream.pipe(split()).on('data', function ondata (line) {
            if (/^\d{3}([\s-]|$)/.test(line)) {
                var f = steps[++ix];
                if (f) return f(line)
                this.removeListener('data', ondata);
            }
        });
    });
});
