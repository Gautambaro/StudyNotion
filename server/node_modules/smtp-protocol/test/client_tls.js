var smtp = require('../');
var test = require('tap').test;
var tls = require('tls');
var split = require('split');
var net = require('net');
var fs = require('fs');
var concat = require('concat-stream');

var keys = {
    key: fs.readFileSync(__dirname + '/keys/key.pem'),
    cert: fs.readFileSync(__dirname + '/keys/cert.pem'),
    ca: fs.readFileSync(__dirname + '/keys/ca.pem')
};

test('client TLS upgrade', function (t) {
console.log('DISABLED');
return t.end();
    t.plan(2);
    t.on('end', function () { server.close() });
    
    var server = net.createServer(function (stream) {
        stream.write('220 beep\n');
        
        stream.pipe(split()).on('data', ondata);
        
        function ondata (line) {
            if (/^EHLO\b/i.test(line)) {
                stream.write('250-beep\n');
                stream.write('250 STARTTLS\n');
            }
            
            if (line !== 'STARTTLS') return;
            this.removeListener('data', ondata);
            stream.write('220 Ready to start TLS.\n');
            
            var opts = {
                key: keys.key,
                cert: keys.cert
            };
            var tserver = tls.createServer(opts, function (s) {
                s.pipe(concat(function (body) {
                    t.deepEqual(body.toString('utf8').split(/\r?\n/), [
                        'MAIL FROM:<alice@beep>',
                        'RCPT TO:<bob@beep>',
                        'DATA',
                        'beep boop!',
                        '',
                        '.',
                        'QUIT',
                        ''
                    ]);
                }));
                s.pipe(split()).on('data', function (line) {
                    if (/^quit\b/i.test(line)) s.end();
                });
            });
            
            t.on('end', function () { tserver.close() });
            
            tserver.listen(0, function () {
                var s = net.connect(tserver.address().port);
                s.pipe(stream).pipe(s);
            });
        }
    });
    
    server.listen(0, function () {
        smtp.connect(server.address().port, function (r) {
            r.ehlo('localhost');
            
            r.on('greeting', function (code, host) {
                t.equal(code, 220);
                r.startTLS({ ca: keys.ca });
            });
            
            r.on('tls', function () {
                r.from('alice@beep');
                r.to('bob@beep');
                r.data();
                r.message().end('beep boop!\n');
                r.quit();
            });
        });
    });
});
