const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const prisma = new PrismaClient();
const loginUser = async (email, password) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userExists) {
    throw new Error('Invalid email or password!');
  }
  const passwordMatch = await bcrypt.compare(password, userExists.password);
  if (!passwordMatch) {
    throw new Error('Invalid email or password!');
  }
  const token = await generateToken(userExists.id);
  return {
    ...userExists,
    password: undefined,
    token,
  };
};

module.exports = loginUser;
