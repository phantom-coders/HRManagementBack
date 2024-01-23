const User = require('../model/user.model');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/mailSender');
const jwt = require('jsonwebtoken');
const generateVerifyToken = require('../utils/generateVerifyToken');
const generatePasswordResetToken = require('../utils/generatePasswordResetToken');

const createUser = async (
  name,
  email,
  phone,
  password,
  current_balance,
  is_verified,
  image,
  total_plans,
  payment_status,
  user_about,
  referred_by,
) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    const data = {
      status: 204,
      error: 'User already exists',
    };
    return data;
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    image,
    user_about,
    referred_by,
  });
  const secretCode = generateVerifyToken(user.email);
  const verifyLink = `${process.env.FRONT_END}/onboarding?secret=${secretCode}`;
  const subject = 'Welcome to the Stock Market App';
  const text = `Hello ${name},\n\nWelcome to the Stock Market App. We are glad to have you on board.\n\nPlease click here or paste the link to browser to confirm your email address: ${verifyLink}\n\nRegards,\nStock Market App Team`;
  sendEmail(email, subject, text);

  if (user) {
    const data = {
      status: 200,
      user: {
        _id: user._id,
        //send user data without password
        name: user.name,
        email: user.email,
        phone: user.phone,
        current_balance: user.current_balance,
        is_verified: user.is_verified,
        image: user.image,
        total_plans: user.total_plans,
        payment_status: user.payment_status,
        user_about: user.user_about,
        referred_by: user.referred_by,
        token: generateToken(user.email),
      },
    };
    return data;
  } else {
    return (data2 = {
      status: 400,
      error: 'user not created',
    });
  }
};

const loginUser = async (email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    // check whether password is correct or not
    const isPasswordCorrect = await userExists.matchPassword(password);
    if (!isPasswordCorrect) {
      const data = {
        status: 401,
        error: 'Password is incorrect',
      };
      return data;
    }

    const data = {
      status: 200,
      error: 'User exists',
      user: {
        token: generateToken(userExists.email),
        _id: userExists._id,
        //send userExists data without password
        name: userExists.name,
        email: userExists.email,
        phone: userExists.phone,
        current_balance: userExists.current_balance,
        is_verified: userExists.is_verified,
        image: userExists.image,
        total_plans: userExists.total_plans,
        payment_status: userExists.payment_status,
        user_about: userExists.user_about,
        referred_by: userExists.referred_by,
      },
    };
    return data;
  } else {
    return (data2 = {
      status: 400,
      error: 'user not exists',
    });
  }
};

const updateUser = async (updatedData) => {
  const id = updatedData?.email;
  const updatedValue = updatedData;

  try {
    const userExist = await User.find({ email: id });
    const userExists = userExist[0];
    // console.log(userExists);

    if (!userExists.email) {
      const data = {
        status: 204,
        error: 'User not exists',
      };
      return data;
    }

    // if (updatedValue.password) {
    //   // If the password is included in the update data, hash it
    //   const salt = await bcrypt.genSalt(10);
    //   updatedValue.password = await bcrypt.hash(updatedValue.password, salt);
    // }

    const newUpdatedValue = {
      name: updatedValue?.name,
      phone: updatedValue?.phone,
      user_about: updatedValue?.user_about,
      image: updatedValue?.image,
    };
    const user = await User.findByIdAndUpdate(userExists._id, newUpdatedValue, {
      new: true,
    });

    const data = {
      status: 200,
      user: {
        _id: user._id,
        // Send user data without password
        name: user.name,
        email: user.email,
        phone: user.phone,
        current_balance: user.current_balance,
        is_verified: user.is_verified,
        image: user.image,
        total_plans: user.total_plans,
        payment_status: user.payment_status,
        user_about: user.user_about,
        referred_by: user.referred_by,
        token: generateToken(user.email),
      },
    };

    return data;
  } catch (error) {
    return {
      status: 500,
      error: 'Internal Server Error',
    };
  }
};

const allUser = async (pageNum, limitNum) => {
  const page = pageNum ? parseInt(pageNum) : 1;
  const limit = limitNum ? parseInt(limitNum) : 50;
  const skipIndex = (page - 1) * limit;
  const users = await User.find({}, { password: 0 })
    .skip(skipIndex)
    .limit(limit);
  if (users) {
    return users;
  }
  return [];
};

const findUser = async (searchKey) => {
  const keyword = searchKey
    ? {
        $or: [
          { name: { $regex: searchKey, $options: 'i' } },
          { email: { $regex: searchKey, $options: 'i' } },
        ],
      }
    : {};
  const users = await User.find({ ...keyword }, { password: 0 })
    .find({})
    .limit(10);
  if (users) {
    return users;
  }
  return [];
};

const singleUser = async (email) => {
  const user = await User.find({ email }, { password: 0 });
  if (user) {
    return user;
  }
  return [];
};

const deleteAUser = async (email) => {
  const user = await User.deleteOne({ email });
  // console.log(user);
  if (user?.deletedCount === 1) {
    return (data = {
      status: 200,
      message: 'user deleted successfully',
    });
  } else {
    return (data = {
      status: 400,
      message: 'user not deleted',
    });
  }
};

const verifyUser = async (secret, email) => {
  const decoded = jwt.verify(secret, process.env.VERIFY_SECRET);
  const userMail = decoded.id;
  // check whether usermail is correct or not
  if (userMail !== email) {
    throw new Error('invalid request!');
  }

  const userExists = await User.findOne({ email: userMail });
  if (!userExists) {
    const data = {
      status: 401,
      error: 'User not exists',
    };
    return data;
  } else if (userExists?.is_verified === true) {
    const data = {
      status: 405,
      error: 'User already verified',
    };
    return data;
  }
  const user = await User.findByIdAndUpdate(
    userExists._id,
    { is_verified: true },
    {
      new: true,
    },
  );
  return {
    status: 200,
    user: {
      _id: user._id,
      // Send user data without password
      name: user.name,
      email: user.email,
      phone: user.phone,
      current_balance: user.current_balance,
      is_verified: user.is_verified,
      image: user.image,
      total_plans: user.total_plans,
      payment_status: user.payment_status,
      user_about: user.user_about,
      referred_by: user.referred_by,
      token: generateToken(user.email),
    },
  };
};

const verifyRequest = async (email) => {
  const userExists = await User.findOne({ email: email });
  if (!userExists) {
    const data = {
      status: 401,
      error: 'User not exists',
    };
    return data;
  } else if (userExists?.is_verified === true) {
    const data = {
      status: 405,
      error: 'User already verified',
    };
    return data;
  }
  const secretCode = generateVerifyToken(email);
  const verifyLink = `${process.env.FRONT_END}/onboarding?secret=${secretCode}`;
  const subject = 'CT Option: Email Verification Request';
  const text = `Hello ${userExists.name},\n\nPlease click here or paste the link to browser to confirm your email address: ${verifyLink}\n\nThis link expires in 60 Minutes.\n\nRegards,\nStock Market App Team`;
  sendEmail(email, subject, text);
  return {
    status: 200,
    data: 'success',
  };
};

const refer = async (email, referTo) => {
  const userExists = await User.findOne({ email: email });
  const referExists = await User.findOne({ email: referTo });
  if (!userExists) {
    throw new Error('User not exists');
  }
  if (referExists) {
    throw new Error('The invited email already has an account');
  }
  const userId = userExists._id;
  // send mail to referTo email to join
  const secretCode = userId;
  const joinLink = `${process.env.FRONT_END}/login?invite=${secretCode}`;
  const subject = 'CT Option: Joining Invitation';
  // create an amazing email template to attract the user
  const text = `Hello,\n\n${userExists.name} has invited you to join Stock Market App. Please click here or paste the link to browser to join: ${joinLink}\n\nRegards,\nStock Market App Team`;
  sendEmail(referTo, subject, text);
  return {
    status: 200,
    data: 'success',
  };
};
const changePassword = async (data) => {
  const { email, password, newPassword } = data;
  const userExists = await User.findOne({ email: email });
  if (!userExists) {
    throw new Error('User not exists');
  }

  const isPasswordCorrect = await userExists.matchPassword(password);

  if (!isPasswordCorrect) {
    throw new Error('Password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const update = await User.findByIdAndUpdate(
    userExists._id,
    { password: hashedPassword },
    {
      new: true,
    },
  );
  // console.log(update);
  const subject = 'CT Option: Password change notification';
  const text = `Hello ${userExists?.name},\n\n Your password associated with email:${email} has been changed. If this was not you, them immediately reset your password.\n\nRegards,\nStock Market App Team.`;
  sendEmail(email, subject, text);
  return {
    status: 200,
    data: 'success',
  };
};
const resetPassRequest = async (email) => {
  const userExists = await User.findOne({ email: email });
  if (!userExists) {
    throw new Error('User not exists');
  }

  const secretCode = generatePasswordResetToken(userExists.password);
  const verifyLink = `${process.env.FRONT_END}/forget-pass?email=${email}&secret=${secretCode}`;
  const subject = 'CT Option: Reset Password Request';
  const text = `Hello ${userExists.name},\n\nPlease click here or paste the link to browser to reset your password: ${verifyLink}\n\nThis link expires in 60 Minutes. If you didn't asked to reset password, then skip this email.\n\nRegards,\nStock Market App Team`;
  sendEmail(email, subject, text);
  return {
    status: 200,
    data: 'success',
  };
};
const forgetPass = async (email, secret, newPassword) => {
  const userExists = await User.findOne({ email: email });
  if (!userExists) {
    throw new Error('User not exists');
  }
  const decoded = jwt.verify(secret, process.env.PASSWORD_RESET_SECRET);
  const userPass = decoded.id;
  // check whether usermail is correct or not
  if (userPass !== userExists.password) {
    throw new Error('invalid request! Token invalid or already used');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const update = await User.findByIdAndUpdate(
    userExists._id,
    { password: hashedPassword },
    {
      new: true,
    },
  );
  const subject = 'CT Option: Password change notification';
  const text = `Hello ${userExists?.name},\n\n Your password associated with email:${email} has been changed. If this was not you, them immediately reset your password.\n\nRegards,\nStock Market App Team.`;
  sendEmail(email, subject, text);
  return {
    status: 200,
    data: 'success',
  };
};

module.exports = {
  createUser,
  updateUser,
  allUser,
  deleteAUser,
  findUser,
  singleUser,
  loginUser,
  verifyUser,
  verifyRequest,
  refer,
  changePassword,
  resetPassRequest,
  forgetPass,
};
