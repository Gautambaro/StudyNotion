var parser = require('./parser');
var EventEmitter = require('events').EventEmitter;
var dot = require('../dot.js').dot;
var crypto = require('crypto');
var util = require('util');
var through = require('through');
var copy = require('shallow-copy');
var tls = require('tls');

module.exports = function (stream) {
    return new Client(stream);
};

function Client (stream) {
    EventEmitter.call(this);
    var self = this;
    self.stream = stream;
    self.queue = [
        function (err, code, lines) {
            if (err) self.emit('error', err);
            else {
                self.greeting = [code, lines];
                self.emit('greeting', code, lines)
            }
        }
    ];
    self._writeQueue = [];
    
    parser(stream, function (err, code, lines) {
        if (!self.queue.length) return;
        
        var cb = self.queue.shift();
        if (cb) cb(err, code, lines);
        
        self._nextWrite();
    });
    
    self.on('newListener', function(event, listener) {

        if (event === 'greeting' && this.greeting) {
            listener(this.greeting[0], this.greeting[1])
        }

    });

    return self;
}

util.inherits(Client, EventEmitter);

Client.prototype._nextWrite = function next () {
    var self = this;
    
    if (!self._writeQueue.length) return;
    var r = self._writeQueue.shift();
    var msg = r[0];
    if (msg && typeof msg === 'object'
    && typeof msg.pipe === 'function') {
        msg.on('data', function () {});
        msg.on('end', next);
        msg.pipe(self.stream, { end: false });
        msg.resume();
    }
    else {
        self.stream.write(msg);
        if (r[1]) next();
    }
};

Client.prototype._write = function (msg, cb) {
    this._writeQueue.push([ msg, !cb ]);
    if (cb) this.queue.push(cb);
    this._nextWrite();
};

Client.prototype.login = function (username, password, type, cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    var supportedTypes =  ['PLAIN','LOGIN','CRAM-MD5'];
    type = (type) ? type.toUpperCase() : 'PLAIN';
    if(supportedTypes.indexOf(type) < 0){
        cb('Unsupported login type', 451);
    }
    switch(type){
        case 'PLAIN':
            var buf = new Buffer(username + "\0" + username + "\0" + password);
            self._write("AUTH PLAIN " + buf.toString("base64") + "\r\n", cb);
            break;
        case "LOGIN":
		case "CRAM-MD5":
            self.authtype = type;
            self.username = username;
            self.password = password;
            self._write("AUTH " + type + "\r\n", function(err,code,lines){
                if(err){
                    cb(err,code,lines);
                    return true;
                }
                if(code != 334){
                    cb(type+' Auth Failed',code,lines);
                    return true;
                }
                switch (self.authtype) {
                    case "LOGIN":
                        var buf = new Buffer(self.username);
                        self._write(buf.toString("base64") + "\r\n");
                        self.queue.push(function(erro,code,lines){
                            if(erro){
                                cb(erro,code,lines);
                                return true;
                            }
                            if(code != 334){
                                cb('LOGIN Auth Failed at username',code,lines);
                                return true;
                            }
                            var buf = new Buffer(self.password);
                            self._write(buf.toString("base64") + "\r\n", cb);
                        });
                        break;
                    case "CRAM-MD5":
                        var hmac = crypto.createHmac('md5', self.password);
                        msg = (new Buffer(msg, "base64")).toString("ascii");
                        hmac.update(msg);
                        self._write(
                            (new Buffer(self.username + " "
                            + hmac.digest("hex")).toString("base64")) + "\r\n",
                            cb
                        );
                        break;
                }
            });
    }
};

Client.prototype.helo = function (hostname, cb) {
    var self = this;
    
    if (typeof hostname === 'function') {
        cb = hostname;
        hostname = undefined;
    }
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    this._write(
        'HELO'
        + (hostname !== undefined ? ' ' + hostname : '')
        + '\r\n',
        cb
    );
    this.hostname = hostname;
};

Client.prototype.ehlo = function (hostname, cb) {
    var self = this;
    
    if (typeof hostname === 'function') {
        cb = hostname;
        hostname = undefined;
    }
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    this.hostname = hostname;
    this._write(
        'EHLO'
        + (hostname !== undefined ? ' ' + hostname : '')
        + '\r\n',
        cb
    );
};

Client.prototype.startTLS = function (opts, cb) {
    var self = this;
    
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    opts = copy(opts || {});
    
    if (!opts.servername) {
        opts.servername = opts.hostname || self.hostname;
    }
    opts.socket = self.stream;
    
    this._write('STARTTLS\r\n', function (err) {
        if (err) return self.emit('error', err);
        if (cb) cb.apply(this, arguments);
        
        self.stream = tls.connect(opts, function (err) {
            if (err) self.emit('error', err)
            else self.emit('tls')
        });
        self.stream.on('error', function (err) {
            self.emit('error', err);
        });
    });
};

Client.prototype.verify = function (username, cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    this._write('VRFY ' + username + '\r\n', cb);
};

Client.prototype.to = function (addr, ext, cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    if (typeof ext === 'function') {
        cb = ext;
        ext = undefined;
    }
    this._write(
        'RCPT TO:<' + addr + '>'
        + (ext ? ' ' + ext : '')
        + '\r\n',
        cb
    );
};

Client.prototype.from = function (addr, ext, cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    if (typeof ext === 'function') {
        cb = ext;
        ext = undefined;
    }
    this._write(
        'MAIL FROM:<' + addr + '>'
        + (ext ? ' ' + ext : '')
        + '\r\n',
        cb
    );
};

Client.prototype.data = function (cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    
    this._write('DATA\r\n', cb);
};

Client.prototype.message = function (source, cb) {
    var self = this;
    if (!cb) cb = function (err) {
        if (err) self.emit('error', err)
    };
    
    var newline = true;
    
    if (!source || typeof source === 'function') {
        cb = source;
        source = through();
    }
    var tr = through(null, end);
    tr.pause();
    
    self._write(dot(source).pipe(tr), cb);
    
    return source;
    
    function end () {
        this.queue('\r\n.\r\n');
    }
};

Client.prototype.quit = function (cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    this._write('QUIT\r\n', cb);
};

Client.prototype.reset = function (cb) {
    var self = this;
    if (!cb) cb = function (err) { if (err) self.emit('error', err) };
    this._write('RSET\r\n', cb);
};
