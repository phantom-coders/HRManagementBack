const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs').promises;

const imapConfig = {
  user: 'the_default@mail.botgmail.com',
  password: 'LI-&P7z+jZf,',
  host: 's782.bom1.mysecurecloudhost.com',
  port: 993,
  tls: true,
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

function processMessage(msg, seqno) {
  const prefix = `(#${seqno}) `;

  return new Promise((resolve, reject) => {
    msg.once('body', (stream, info) => {
      simpleParser(stream, async (err, parsed) => {
        if (err) {
          console.error(`Error parsing message #${seqno}:`, err);
          reject(err);
          return;
        }

        console.log(prefix + 'Subject:', parsed.subject);

        const attachments = parsed.attachments || [];

        await Promise.all(
          attachments.map(async (attachment, index) => {
            const fileName = attachment.filename || `attachment-${index + 1}`;

            try {
              await fs.writeFile(
                fileName,
                await streamToString(attachment.content),
              );
              console.log(`Downloaded: ${fileName}`);
            } catch (writeErr) {
              console.error(`Error writing file ${fileName}:`, writeErr);
            }
          }),
        );

        resolve();
      });
    });

    msg.once('end', () => {
      console.log(prefix + 'Finished');
    });
  });
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

imap.connect();

imap.once('ready', () => {
  openInbox(async (err) => {
    if (err) throw err;

    const f = imap.seq.fetch('1:*', {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      struct: true,
    });

    f.on('message', async (msg, seqno) => {
      try {
        await processMessage(msg, seqno);
      } catch (err) {
        console.error(`Error processing message #${seqno}:`, err);
      }
    });

    f.once('error', (err) => {
      console.log('Fetch error:', err);
    });

    f.once('end', () => {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', (err) => {
  console.log('Error:', err);
});

imap.once('end', () => {
  console.log('Connection ended');
});
