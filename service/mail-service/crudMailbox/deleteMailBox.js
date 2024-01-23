const Imap = require('node-imap');

const imap = new Imap({
  user: 'hstu@team.xdomainhost.com',
  password: '+{Brre,8r7HSV+LlC.',
  host: 'team.xdomainhost.com',
  port: 993,
  tls: true,
});

function createMailbox(mailboxName, callback) {
  imap.addBox(`INBOX.${mailboxName}`, function (err) {
    if (err) {
      console.error(`Error creating mailbox "${mailboxName}":`, err);
    } else {
      console.log(`Mailbox "${mailboxName}" created successfully.`);
      // After creating the mailbox, delete it
      deleteMailbox(mailboxName);
    }

    // Disconnect after creating the mailbox (or after attempting to create it)
    imap.end();
  });
}

function deleteMailbox(mailboxName) {
  imap.delBox(`INBOX.${mailboxName}`, function (err) {
    if (err) {
      console.error(`Error deleting mailbox "${mailboxName}":`, err);
    } else {
      console.log(`Mailbox "${mailboxName}" deleted successfully.`);
    }
  });
}

imap.once('ready', function () {
  // Specify the name of the new mailbox you want to create
  const newMailboxName = 'TheNewMailbox';
  createMailbox(newMailboxName);
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
