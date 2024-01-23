const Imap = require('node-imap');
const fs = require('fs');
const { inspect } = require('util'); // Add this line to import inspect

const imapConfig = {
  user: 'the_default@mail.botgmail.com',
  password: 'LI-&P7z+jZf,',
  host: 'mail.botgmail.com',
  port: 993,
  tls: true,
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:*', {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      struct: true,
    });

    f.on('message', function (msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function (stream, info) {
        var buffer = '';
        stream.on('data', function (chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function () {
          console.log(
            prefix + 'Parsed header: %s',
            inspect(Imap.parseHeader(buffer)),
          );
        });
      });

      msg.once('attributes', function (attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));

        const attachments =
          attrs?.struct?.length > 0 ? attrs.struct[0].attachments : [];
        if (attachments?.length > 0) {
          attachments.forEach((attachment) => {
            const fileName = attachment.params.name;

            // Fetch the attachment
            const f = imap.fetch(attrs.uid, { bodies: [attachment.part] });
            f.on('message', function (msg, seqno) {
              msg.on('body', function (stream, info) {
                const writeStream = fs.createWriteStream(fileName);
                stream.pipe(writeStream);
              });
            });
          });
        }
      });

      msg.once('end', function () {
        console.log(prefix + 'Finished');
      });
    });

    f.once('error', function (err) {
      console.log('Fetch error: ' + err);
    });

    f.once('end', function () {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
