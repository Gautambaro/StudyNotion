var smtp = require('../');
var fs = require('fs');

smtp.connect('localhost', 9025, function (mail) {
    mail.helo('example.com');
    mail.from('substack@example.com');
    mail.to('root@example.com');
    mail.data();
    fs.createReadStream('/etc/issue').pipe(mail.message());
    mail.quit();
});
