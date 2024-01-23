const Imap = require('node-imap');

const imap = new Imap({
  user: 'hstu@team.xdomainhost.com',
  password: '+{Brre,8r7HSV+LlC.',
  host: 'team.xdomainhost.com',
  port: 993,
  tls: true,
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function () {
  openInbox(function (err) {
    if (err) throw err;

    // Example: Search for all unseen messages sent to a specific email address
    const toAddress = 'template+no-personal-use@paradox-bd.biz';
    const criteria = [
      ['TO', toAddress],
      // ["OR", ["TO", toAddress], ["UNSEEN"]], // Match either seen or unseen messages
    ];

    imap.search(criteria, function (err, results) {
      if (err) throw err;

      console.log('Matching UIDs:', results);

      // You can use the UIDs to fetch or perform other operations on the messages

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
