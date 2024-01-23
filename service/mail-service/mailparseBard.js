const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;

const imap = new Imap({
  user: 'the_default@mail.botgmail.com',
  password: 'LI-&P7z+jZf,',
  host: 's782.bom1.mysecurecloudhost.com',
  port: 993, // Secure IMAP port
  tls: true, // Use TLS encryption
});

imap.once('ready', () => {
  console.log('Connected to IMAP server!');

  // Open the mailbox
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.error('Error opening mailbox:', err);
      imap.end();
      return;
    }

    // Fetch emails
    imap.search(['ALL'], (err, results) => {
      if (err) {
        console.error('Error searching emails:', err);
        imap.end();
        return;
      }

      imap.fetch(results, { bodies: '' }, (err, messages) => {
        if (err) {
          console.error('Error fetching emails:', err);
          imap.end();
          return;
        }

        // Process each message
        messages.forEach((message) => {
          message.on('body', (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                console.error('Error parsing email:', err);
                return;
              }

              // Access attachments
              const attachments = parsed.attachments;

              for (const attachment of attachments) {
                // Save attachment to disk
                fs.writeFile(
                  `./${attachment.filename}`,
                  attachment.content,
                  (err) => {
                    if (err) {
                      console.error('Error saving attachment:', err);
                    } else {
                      console.log(
                        `Attachment ${attachment.filename} saved successfully!`,
                      );
                    }
                  },
                );
              }
            });
          });
        });

        imap.end();
      });
    });
  });
});

imap.once('error', (err) => {
  console.error('Connection error:', err);
});

imap.connect();
