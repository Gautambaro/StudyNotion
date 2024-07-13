var net = require('net');
var tls = require('tls');

var proto = exports.protocol = {
    client : require('./lib/client/proto'),
    server : require('./lib/server/proto'),
};

exports.createServer = function (opts, cb) {
    if (typeof opts === 'string') {
        opts = { domain: opts };
    }
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};;
    }
    if (!opts) opts = {};
    var istls = Boolean(opts.tls);
    var tnet = istls ? tls : net;
    
    return tnet.createServer(opts, function (stream) {
        var req = proto.client(opts, stream);
        var clienttls = istls;
        
        req.on('error', function () {});
        stream.on('error', function (err) {});
        
        req.on('_tlsNext', function (write, next) {
            if (clienttls) {
                write(220, 'Already using TLS?');
                //write(503, 'Bad sequence: already using TLS.');
                return next();
            }
            clienttls = true;
            
            var tserver = tls.createServer(opts);
            tserver.listen(0, '127.0.0.1', function () {
                var s = net.connect(tserver.address().port, '127.0.0.1');
                s.on('error', function (err) { stream.end() });
                s.pipe(stream).pipe(s);
                write(220, 'Ready to start TLS.');
            });
            
            var index = 0;
            tserver.on('secureConnection', function (sec) {
                if (index ++ > 0) return sec.end();
                req._swapStream(sec);
                req.emit('tls', sec);
            });
            stream.on('close', function () {
                tserver.close();
            });
        });
        cb(req);
    });
};

exports.connect = function () {
    var args = [].slice.call(arguments).reduce(function (acc, arg) {
        acc[typeof arg] = arg;
        return acc;
    }, {});

    var stream;
    var cb = args.function;
    var options = args.object || {};
    
    var tlsOpts = options.tls;
    options.port = args.number || 25;
    options.host = args.string || 'localhost';
    
    if (args.string && args.string.match(/^[.\/]/)) {
        // unix socket
        stream = net.createConnection(args.string);
    }
    else if (tlsOpts) {
        stream = tls.connect(options.port, options.host, tlsOpts, function () {
            var pending = stream.listeners('secure').length;
            var allOk = true;
            if (pending === 0 && !stream.authorized
            && tlsOpts.rejectUnauthorized !== false) {
                allOk = false;
            }
            if (pending === 0) return done()
            
            var ack = {
                accept : function (ok) {
                    allOk = allOk && (ok !== false);
                    if (--pending === 0) done();
                },
                reject : function () {
                    allOk = false;
                    if (--pending === 0) done();
                }
            };
            stream.emit('secure', ack);
            
            function done () {
                if (!allOk) {
                    stream.end();
                    stream.emit('error', new Error(stream.authorizationError));
                }
                else cb(proto.server(stream));
            }
        });
    }
    else if (options.stream) {
        cb(proto.server(options.stream));
    }
    else {
        stream = net.connect(options);
        stream.on('connect', function () {
            cb(proto.server(stream));
        });
    }
    
    return stream;
};
