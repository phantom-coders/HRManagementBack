const Imap = require('node-imap');

const imap = new Imap({
  user: 'hstu@team.xdomainhost.com',
  password: '+{Brre,8r7HSV+LlC.',
  host: 'team.xdomainhost.com',
  port: 993,
  tls: true,
});

imap.once('ready', function () {
  // Get the names of all mailboxes
  imap.getBoxes(function (err, mailboxes) {
    if (err) throw err;

    console.log('Mailbox Names:', Object.keys(mailboxes));

    // Disconnect after fetching mailbox names
    imap.end();
  });
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
