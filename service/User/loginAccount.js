const User = require('../model/user.model');
const generateToken = require('../utils/generateToken');

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

module.exports = loginUser;
