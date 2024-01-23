const jwt = require('jsonwebtoken');

const generatePasswordResetToken = (id) => {
  return jwt.sign({ id }, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = generatePasswordResetToken;
