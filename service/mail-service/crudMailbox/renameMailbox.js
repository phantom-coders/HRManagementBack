const Imap = require('node-imap');

const imap = new Imap({
  user: 'hstu@team.xdomainhost.com',
  password: '+{Brre,8r7HSV+LlC.',
  host: 'team.xdomainhost.com',
  port: 993,
  tls: true,
});

function renameMailbox(oldMailboxName, newMailboxName) {
  imap.renameBox(oldMailboxName, newMailboxName, function (err) {
    if (err) {
      console.error(`Error renaming mailbox ${oldMailboxName}:`, err);
    } else {
      console.log(
        `Mailbox ${oldMailboxName} renamed to ${newMailboxName} successfully.`,
      );
    }

    // Disconnect after renaming the mailbox
    imap.end();
  });
}

imap.once('ready', function () {
  // Specify the names of the old and new mailboxes
  const oldMailboxName = 'INBOX';
  const newMailboxName = 'NEW_INBOX';

  renameMailbox(oldMailboxName, newMailboxName);
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
