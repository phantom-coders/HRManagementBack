const Imap = require('node-imap');

const imap = new Imap({
  user: 'hstu@team.xdomainhost.com',
  password: '+{Brre,8r7HSV+LlC.',
  host: 'team.xdomainhost.com',
  port: 993,
  tls: true,
});

function getMailboxDetails(callback) {
  imap.getBoxes('', function (err, boxes) {
    if (err) {
      console.error('Error fetching mailbox details:', err);
    } else {
      console.log('Mailbox Details:', boxes);
    }

    // Disconnect after fetching mailbox details
    imap.end();
  });
}

imap.once('ready', function () {
  getMailboxDetails();
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
