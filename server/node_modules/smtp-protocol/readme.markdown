# smtp-protocol

write smtp clients and servers

This module does not relay any messages or perform disk I/O by itself.

[![build status](https://secure.travis-ci.org/substack/node-smtp-protocol.png)](http://travis-ci.org/substack/node-smtp-protocol)

# examples

## server

``` js
var smtp = require('smtp-protocol');

var server = smtp.createServer(function (req) {
    req.on('to', function (to, ack) {
        var domain = to.split('@')[1] || 'localhost';
        if (domain === 'localhost') ack.accept()
        else ack.reject()
    });
    
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        stream.pipe(process.stdout, { end : false });
        ack.accept();
    });
});

server.listen(9025);
```

usage:

```
$ node example/server.js 
```

elsewhere:

```
$ nc localhost 9025
250 beep
helo
250 
mail from:<beep@localhost>
250 
rcpt to:<boop@localhost>
250 
data
354 
Beep boop.
I am a computer.
.
250 
quit
221 Bye!
```

meanwhile:

```
from: beep@localhost
to: boop@localhost
Beep boop.
I am a computer.
```

## client

``` js
var smtp = require('smtp-protocol');
var fs = require('fs');

smtp.connect('localhost', 9025, function (mail) {
    mail.helo('example.com');
    mail.from('substack@example.com');
    mail.to('root@example.com');
    mail.data();
    fs.createReadStream('/etc/issue').pipe(mail.message());
    mail.quit();
});
```

output:

```
$ node example/client.js
[ 'beep ESMTP Postfix (Ubuntu)' ]
{ helo: 250,
  from: 250,
  to: 250,
  data: 354,
  message: 250,
  quit: 221 }
```

# server methods

var smtp = require('smtp-protocol')

## smtp.createServer(opts, cb)

Return a new `net.Server` so you can `.listen()` on a port.

Optionally:

* `opts.domain` - domain to use in hello message
* `opts.tls` - listen on TLS at the start instead of upgrading with STARTTLS
* `opts.key`, `opts.cert`, `opts.pfx` - configure tls

`cb(req)` fires for new connection. See the "requests" section below.

# server requests

## events

Every event that can 

Every acknowledgeable event except "message" will implicitly call `ack.accept()`
if no listeners are registered.

If there are any listeners for an acknowledgeable event, exactly one listener
MUST call either `ack.accept()` or `ack.reject()`.

### 'command', cmd, r

This event fires for every smtp command. `cmd` has the command name as
`cmd.name` and the `cmd.data` as the command data.

If you want to override the default behavior for a command, call
`r.preventDefault()`, then call `r.write(code, data)` to write a response and
`r.next()` when the next command should be processed.

### 'greeting', cmd, ack

Emitted when `HELO`, `EHLO`, or `LHLO` commands are received.

Read the name of the command with `cmd.greeting`.
Read the optional hostname parameter with `cmd.hostname`.

### 'from', from, ack

Emitted when the `MAIL FROM:` command is received.

`from` is the email address of the sender as a string.

### 'to', to, ack

Emitted when the `RCPT TO:` command is received.

`to` is the email address of the recipient as a string.

### 'message', stream, ack

Emitted when the `DATA` command is received.

If the message request is accepted, the message body will be streamed through
`stream`.

This event has no implicit `ack.accept()` when there are no listeners.

### 'received', ack

Emitted when the body after the `DATA` command finishes.

### 'reset'

Emitted when the connection is reset from a `RSET` command.

### 'quit'

Emitted when the connection is closed from a `QUIT` command.

### 'tls'

Emitted when the connection is upgraded to TLS by the client.

## properties

### req.from

The email address of the sender as a string.

### req.fromExt

Extended sender data if sent as a string.

### req.to

Array of the email addresses of the recipients as a string.

### req.toExt

Array of extended recipient data if sent as a string.

### req.greeting

The greeting command. One of `'helo'`, `'ehlo'`, or `'lhlo'`.

### req.hostname

The hostname specified in the greeting.

### req.socket

The underlying tcp socket. This is handy if you need to verify the address of
the remote host with `req.socket.remoteAddress`.

# server acknowledgements

Many request events have a trailing `ack` parameter.

If there are any listeners for an acknowledgeable event, exactly one listener
MUST call either `ack.accept()` or `ack.reject()`.

Consult [this handy list of SMTP codes](http://www.greenend.org.uk/rjk/2000/05/21/smtp-replies.html#SEND)
for which codes to use in acknowledgement responses.

## ack.accept(code=250, message)

Accept the command. Internal staged state modifications from the command are executed.

## ack.reject(code, message)

Reject the command. Any staged state modifications from the command are discarded.

# client methods

For all `client` methods, `cb(err, code, lines)` fires with the server response.

## var stream = smtp.connect(host='localhost', port=25, options={}, cb)

Create a new SMTP client connection.

`host`, `port`, `options` and `cb` are detected by their types in the arguments array so
they may be in any order. `cb(client)` fires when the connection is ready.

You can use unix sockets by supplying a string argument that matches `/^[.\/]/`.

Alternatively supply your own stream as `opts.stream` (the stream must already be connected).

To make a connection using TLS, set `opts.tls` to `true` (for more control you can also assign
options to pass through to `tls.connect`.) You can also upgrade the connection
to TLS at any time by calling `client.startTLS()`.

By default, connections to unauthorized servers will be closed and the error
will be emitted as an `'error'` event on the stream object but you can provide
your own authorization logic by doing:

``` js
stream.on('secure', function (ack) {
    if (...) ack.accept()
    else ack.reject()
})
```

## client.helo(hostname, cb)

Greet the server with the `hostname` string.

`cb(err, code, lines)` fires with the server response.

## client.from(addr, ext=undefined, cb)

Set the sender to the email address `addr` with optional extension data `ext`.

`cb(err, code, lines)` fires with the server response.

## client.to(addr, ext=undefined, cb)

Set the recipient to the email address `addr` with optional extension data `ext`.

`cb(err, code, lines)` fires with the server response.

## client.data(cb)

Tell the server that we are about to transmit data.

`cb(err, code, lines)` fires with the server response.

## var stream = client.message(cb)

Return a writable stream to send data to the server in a message body.
For example, you could do:

``` js
fs.createReadStream('foo.txt').pipe(client.message());
```

`cb(err, code, lines)` fires with the server response.

## client.quit(cb)

Ask the server to sever the connection.

`cb(err, code, lines)` fires with the server response.

## client.reset(cb)

Ask the server to reset the connection.

`cb(err, code, lines)` fires with the server response.

## client.startTLS(opts={}, cb)

Upgrade the current connection to TLS with `opts` passed through to
`tls.connect(opts)`.

If `opts.servername` isn't given, its value will be taken from the HELO/EHLO
hostname value because otherwise the TLS library will complain about how the
certificate name doesn't match.

You'll probably want to pass in the `opts.ca` here as well to satisfy the TLS
machinery.

## client.verify(username, cb)

Send a VRFY for `username`.

`cb(err, code, lines)` fires with the server response.

## client.login(username, password, authType, cb)

Login with the given username and password. `authType` can be one of `PLAIN`, `LOGIN` and `CRAM-MD5`.

`cb(err, code, lines)` fires with the server response.

# client events

## 'greeting', code, lines

Fired when the stream initializes. This should be the first message that the
server sends.

## 'tls', clearTextStream

When the connection is upgraded to TLS, this event fires.

# install

With [npm](http://npmjs.org) do:

```
npm install smtp-protocol
```

# license

MIT
