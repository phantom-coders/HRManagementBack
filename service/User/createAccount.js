const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');

const prisma = new PrismaClient();

const createUser = async ({ name, email, password }) => {
  // Hash the user's password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const token = await generateToken(email);
  // Return the user and the token, skipping the password
  return {
    ...result,
    password: undefined,
    token,
  };
};

module.exports = {
  createUser,
};
