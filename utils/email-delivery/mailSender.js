async function MailSender(
  subject,
  description,
  recipient_name,
  recipient_email,
) {
  const nodemailer = require('nodemailer');
  const dotenv = require('dotenv');
  const path = require('path');

  //location
  dotenv.config({ path: path.join(process.cwd(), '.env') });

  const Title = process.env.EMAIL_TITLE || 'Bangladeshi Software';
  const From = process.env.EMAIL_FROM || 'bangladeshisoft@outlook.com';
  const Password = process.env.EMAIL_PASSWORD || 'bdSoft1!';
  const Host = process.env.EMAIL_HOST || 'smtp-mail.outlook.com';
  const PortType = process.env.EMAIL_PORT || '587';
  const SecureVal = process.env.EMAIL_SECURE || 'false';

  const Port = parseInt(`${PortType}`);
  let Secure;
  if (SecureVal === 'true') {
    Secure = true;
  } else if (SecureVal === 'false') {
    Secure = false;
  } else {
    Secure = SecureVal;
  }
  // console.log(description);
  // Import NodeMailer (after npm install)
  // Async function enables allows handling of promises with await
  subject = subject || 'Welcome to Bangladeshi Software';
  description =
    description ||
    `<p>We are delighted to have you as a part of Bangladeshi Software. Our team is dedicated to providing high-quality software solutions tailored to meet your needs.</p>`;
  recipient_name = recipient_name || 'User';
  recipient_email = recipient_email || [
    // 'bangladeshisoft@outlook.com',
    'paradoxtechbd@outlook.com',
    // 'admin@bangladeshisoftware.com',
  ];
  // First, define send settings by creating a new transporter:
  let transporter = nodemailer.createTransport({
    host: `${Host}`, // SMTP server address (usually mail.your-domain.com)
    port: Port, // Port for SMTP (usually 465).. sometimes: 587
    secure: Secure, // Usually true if connecting to port 465 .... false for port 587
    auth: {
      user: `${From}`, // Your email address
      pass: `${Password}`, // Password (for gmail, your app password)
      // ⚠️ For better security, use environment variables set on the server for these values when deploying
    },
  });

  const MainHtml = `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #0F6CBD;">${subject}</h1>
        <p>Dear ${recipient_name},</p>
        ${description}
        <br></br>
        <hr></hr>
        <u style="color: #3498db;">Bangladeshi Software Provide Innovative Software Solutions</u>
        <p>Explore our services and learn more about what Bangladeshi Software can offer:</p>
        <ul>
            <li><a href="https://www.bangladeshisoftware.com" target="_blank" style="color: #3498db; text-decoration: none;">Visit our website</a></li>
            <li>Contact Information:
                <ul>
                    <li>Email: admin@bangladeshisoftware.com</li>
                    <li>Phone: <a href="https://api.whatsapp.com/send?phone=+8801719182586&text=Hi,%20is%20anyone%20available%20here?">+8801719182586</a></li>
                </ul>
            </li>
        </ul>
        <p>Feel free to reach out if you have any questions or if there's anything else we can assist you with.</p>
        <p style="margin-bottom: 0;">Best regards,<br>
            The Bangladeshi Software Team.</p>
    </div>
  `;
  // Define and send message inside transporter.sendEmail() and await info about send from promise:
  // try catch block
  try {
    let info = await transporter.sendMail({
      from: `${Title} <${From}>`,
      to: `${recipient_email}`,
      subject: `${subject}`,
      html: MainHtml,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }

  // Random ID generated after successful send (optional)
}

module.exports = MailSender;
// export default MailSender;
