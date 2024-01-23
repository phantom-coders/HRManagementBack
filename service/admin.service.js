const Admin = require('../model/admin.model');
const User = require('../model/user.model');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/mailSender');

const createAdmin = async (
  email,
  new_admin_password,
  new_admin_email,
  new_admin_role,
) => {
  const userExists = await User.findOne({ email: new_admin_email });
  if (!userExists) {
    const data = {
      status: 406,
      error: 'User does not exists',
    };
    return data;
  }
  const adminExists = await Admin.findOne({ email: new_admin_email });
  const existedAdmin = await Admin.findOne({ email: email });
  if (adminExists) {
    const data = {
      status: 204,
      error: 'Admin already exists',
    };
    return data;
  }

  if (existedAdmin?.role !== 'admin') {
    const data = {
      status: 405,
      error: 'You are not admin',
    };
    return data;
  }
  // console.log(existedAdmin);
  const user = await Admin.create({
    name: userExists?.name,
    uid: userExists?._id,
    email: new_admin_email,
    phone: userExists?.phone,
    password: new_admin_password,
    image: userExists?.image,
    is_admin: new_admin_role === 'admin' ? true : false,
    role: new_admin_role,
  });

  const subject = 'Stock Market: Super User Access Added';
  const text = `Hello ${user?.name},\n\nYour account associated  with email:(${new_admin_email}) is promoted to super user. Now you can interact with admin dashboard with your new super user password.\n\nAdmin panel password: ${new_admin_password}\n\nYou can change this password at your admin panel.\n\nRegards,\nStock Market team.`;
  sendEmail(new_admin_email, subject, text);

  if (user) {
    const data = {
      status: 200,
      user: {
        _id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_verified: user.is_verified,
        image: user.image,
        is_admin: user.is_admin,
        role: user.role,
        token: generateToken(user.email),
      },
    };
    return data;
  } else {
    return (data2 = {
      status: 400,
      error: 'admin not created',
    });
  }
};

// const loginUser = async (email, password) => {
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     const isPasswordCorrect = await userExists.matchPassword(password);
//     if (!isPasswordCorrect) {
//       const data = {
//         status: 401,
//         error: 'Password is incorrect',
//       };
//       return data;
//     }

//     const data = {
//       status: 200,
//       error: 'User exists',
//       user: {
//         token: generateToken(userExists.email),
//         _id: userExists._id,
//         name: userExists.name,
//         email: userExists.email,
//         phone: userExists.phone,
//         current_balance: userExists.current_balance,
//         is_verified: userExists.is_verified,
//         image: userExists.image,
//         total_plans: userExists.total_plans,
//         payment_status: userExists.payment_status,
//         user_about: userExists.user_about,
//       },
//     };
//     return data;
//   } else {
//     return (data2 = {
//       status: 400,
//       error: 'user not exists',
//     });
//   }
// };
const updateAdmin = async (email, current_pass, new_pass) => {
  try {
    const adminExists = await Admin.findOne({ email: email });
    // console.log(adminExists);

    if (!adminExists) {
      const data = {
        status: 204,
        error: 'admin not exists',
      };
      return data;
    }

    // Verify the current password
    const isPasswordCorrect = await adminExists.matchPassword(current_pass);
    // console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      const data = {
        status: 407,
        error: 'Password is incorrect',
      };
      return data;
    }

    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(new_pass, salt);

    const user = await Admin.findOneAndUpdate(
      { email },
      {
        password: newPass,
      },
      { new: true },
    );

    const data = {
      status: 200,
      user: {
        _id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_verified: user.is_verified,
        image: user.image,
        is_admin: user.is_admin,
        role: user.role,
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

const allAdmin = async (pageNum, limitNum) => {
  const page = pageNum ? parseInt(pageNum) : 1;
  const limit = limitNum ? parseInt(limitNum) : 50;
  const skipIndex = (page - 1) * limit;
  const users = await Admin.find({}, { password: 0 })
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
  const user = await Admin.find({ email }, { password: 0 });
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
const deleteAAdmin = async (email) => {
  const adminExists = await Admin.findOne({ email: email });
  if (adminExists?.role !== 'admin') {
    throw new Error('You are not admin');
  }
  if (adminExists?.is_super_admin === true) {
    throw new Error('You do not have permission to delete super admin');
  }

  const user = await Admin.deleteOne({ email });
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

module.exports = {
  createAdmin,
  updateAdmin,
  allAdmin,
  deleteAUser,
  findUser,
  singleUser,
  deleteAAdmin,
};
