const jwt = require('jsonwebtoken');

const generateVerifyToken = (id) => {
  return jwt.sign({ id }, process.env.VERIFY_SECRET, {
    expiresIn: '60m',
  });
};

module.exports = generateVerifyToken;
