const Imap = require("node-imap");

const imap = new Imap({
  user: "hstu@team.xdomainhost.com",
  password: "+{Brre,8r7HSV+LlC.",
  host: "team.xdomainhost.com",
  port: 993,
  tls: true,
});

function createMailbox(mailboxName, callback) {
  imap.addBox(`INBOX.${mailboxName}`, function (err) {
    if (err) {
      console.error(`Error creating mailbox "${mailboxName}":`, err);
    } else {
      console.log(`Mailbox "${mailboxName}" created successfully.`);
    }

    // Disconnect after creating the mailbox
    imap.end();
  });
}

imap.once("ready", function () {
  // Specify the name of the new mailbox you want to create
  const newMailboxName = "NewMailbox";
  createMailbox(newMailboxName);
});

imap.once("error", function (err) {
  console.log(err);
});

imap.once("end", function () {
  console.log("Connection ended");
});

imap.connect();
