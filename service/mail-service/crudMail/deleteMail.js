const Imap = require("node-imap");

const imap = new Imap({
  user: "hstu@team.xdomainhost.com",
  password: "+{Brre,8r7HSV+LlC.",
  host: "team.xdomainhost.com",
  port: 993,
  tls: true,
});

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

imap.once("ready", function () {
  openInbox(function (err) {
    if (err) throw err;

    // Specify the UID of the message you want to delete
    const uidToDelete = 2;

    // Add the \Deleted flag to the message
    imap.addFlags(uidToDelete, ["\\Deleted"], function (err) {
      if (err) throw err;

      // Permanently remove the message
      imap.expunge(function (err) {
        if (err) throw err;

        console.log("Message deleted successfully.");

        // Close the connection
        imap.end();
      });
    });
  });
});

imap.once("error", function (err) {
  console.log(err);
});

imap.once("end", function () {
  console.log("Connection ended");
});

imap.connect();
