const MailSender = require('../mailSender');

const template = (verifyToken, recipient_email) => {
  const verificationLink = `${process.env.FrontendUrl}/register?email=${recipient_email}&secret=${verifyToken}`;
  return `
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff;">
        <p style="color: #666; margin-bottom: 20px;">
          Thank you for creating an account. To complete the verification
          process, please click the button below:
        </p>

        <a
          href="${verificationLink}"
          type="button"
          style="display: inline-block; padding: 10px 20px; font-size: 16px; text-decoration: none; background-color: #87CEEB; color: #fff; border-radius: 5px;"
        >
          Verify Account
        </a>

        <p style="color: #666;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
      `;
};
// template ends here

const registerUserMail = async (
  recipient_name,
  recipient_email,
  verifyToken,
) => {
  const subject = 'Onboarding to HR Management Website: Verify your account.';
  const description = template(verifyToken, recipient_email);
  // console.log(description);

  try {
    const result = await MailSender(
      subject,
      description,
      recipient_name,
      recipient_email,
    );
    return result;
  } catch (error) {
    // console.log(error);
    return error;
  }
};
// registerUserMail();
module.exports = registerUserMail;
