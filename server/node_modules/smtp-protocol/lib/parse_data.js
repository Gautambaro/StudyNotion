exports.parseData = function (cb) {
    var self = this;
    var bufs = [];
    
    self.stream.on('data', function ondata (buf, offset) {
        if (offset === undefined) offset = 0;
        
        if (self.bytes) {
            var ix = Math.min(buf.length, offset + self.bytes);
            var chunk = buf.slice(offset, ix);
            self.target.write(chunk);
            
            self.bytes -= chunk.length;
            if (self.bytes === 0) {
                if (buf.length > offset + chunk.length) {
                    ondata(buf, offset + chunk.length);
                }
                self.target.end();
            }
        }
        else {
            for (var i = offset; i < buf.length; i++) {
                if (buf[i] === 10) {
                    if (i > offset) bufs.push(buf.slice(offset, i));
                    cb(Buffer.concat(bufs).toString('utf8').replace(/\r$/, ''));
                    bufs = [];
                    if (buf.length > i + 1) ondata(buf, i + 1);
                    return;
                }
            }
            if (offset < buf.length) {
                bufs.push(buf.slice(offset, buf.length));
            }
        }
    });
}

exports.getBytes = function (n, target) {
    this.bytes = n;
    this.target = target;
};
