const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const registerUserMail = require('../../utils/email-delivery/templates/registerUserMail');

const prisma = new PrismaClient();

const createUser = async ({ name, email, password, verifyToken }) => {
  // Hash the user's password before saving it to the database
  // if any of these unavailable, throw an error
  if (!name || !email || !password || !verifyToken) {
    throw new Error('Please provide all required fields!');
  }
  // check if the user already exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    throw new Error('User already exists!');
  }
  // decrypt the secret token using the user's email
  const decryptedToken = await bcrypt.compare(email, verifyToken);
  if (!decryptedToken) {
    throw new Error('Invalid token!');
  }
  // hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      verified: true,
      password: hashedPassword,
    },
  });
  const token = await generateToken(result.id);

  // Return the user and the token, skipping the password
  return {
    ...result,
    password: undefined,
    token,
  };
};

const mailVerification = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    throw new Error('User already exists!');
  }
  // create a secret token using the user's email to bcrypt
  const verifyToken = await bcrypt.hash(email, 10);
  const name = 'Guest';
  const result = await registerUserMail(name, email, verifyToken);
  return result;
};

module.exports = {
  createUser,
  mailVerification,
};
