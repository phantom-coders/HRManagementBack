const {
  createUser,
  mailVerification,
} = require('../service/User/createAccount');
const loginUser = require('../service/User/loginAccount');
const catchAsync = require('../utils/catchAsync');
const sandResponse = require('../utils/sandResponse');

module.exports.createUser = catchAsync(async (req, res) => {
  try {
    const user = await createUser(req.body);
    sandResponse(res, {
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    sandResponse(res, {
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
});

module.exports.verifyEmail = catchAsync(async (req, res) => {
  try {
    const user = await mailVerification(req.body);
    sandResponse(res, {
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    sandResponse(res, {
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
});

module.exports.loginUser = catchAsync(async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);
    sandResponse(res, {
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    sandResponse(res, {
      success: false,
      statusCode: 400,
      message: error.message,
    });
  }
});
