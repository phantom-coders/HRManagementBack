async function MailSender(
  subject,
  description,
  recipient_name,
  recipient_email,
) {
  const { Resend } = require('resend');
  const dotenv = require('dotenv');
  const path = require('path');

  //location
  dotenv.config({ path: path.join(process.cwd(), '.env') });

  const Title = process.env.EMAIL_TITLE;
  const From = process.env.EMAIL_FROM;
  const Password = process.env.EMAIL_PASSWORD;
  const resender = new Resend(Password);
  // console.log(description);
  // Import NodeMailer (after npm install)
  // Async function enables allows handling of promises with await
  subject = subject || 'Welcome to HR Management App';
  description =
    description ||
    `<p>We are delighted to have you as a part of HR Management App. Our team is dedicated to providing high-quality software solutions tailored to meet your needs.</p>`;
  recipient_name = recipient_name || 'User';
  recipient_email;

  const MainHtml = `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #0F6CBD;">${subject}</h1>
        <p>Dear ${recipient_name},</p>
        ${description}
        <br></br>
        <hr></hr>
        <u style="color: #3498db;">HR Management App Provide Innovative Software Solutions</u>
        <p>Explore our services and learn more about what HR Management App can offer:</p>
        <ul>
            <li><a href="https://spider-eye.onrender.com/" target="_blank" style="color: #3498db; text-decoration: none;">Visit our website</a></li>
            <li>Contact Information:
                <ul>
                    <li>Email: admin@paradox-bd.com</li>
                    <li>Phone: <a href="https://api.whatsapp.com/send?phone=+880123456789&text=Hi,%20is%20anyone%20available%20here?">+880123456789</a></li>
                </ul>
            </li>
        </ul>
        <p>Feel free to reach out if you have any questions or if there's anything else we can assist you with.</p>
        <p style="margin-bottom: 0;">Best regards,<br>
            The HR Management App Team.</p>
    </div>
  `;
  // Define and send message inside transporter.sendEmail() and await info about send from promise:
  // try catch block
  try {
    const info = await resender.emails.send({
      from: `${Title} <${From}>`,
      to: `${recipient_email}`,
      subject: `${subject}`,
      html: MainHtml,
    });
    await console.log('Message sent: %s', await info);
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }

  // Random ID generated after successful send (optional)
}

module.exports = MailSender;
// export default MailSender;
