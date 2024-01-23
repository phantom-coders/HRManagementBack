const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../model/admin.model');

const adminProtect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //bearer token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decodedUser = decoded.id;
      // console.log(decodedUser);
      const user = await Admin.findOne({ email: decodedUser });
      if (user?.role == 'admin' || user?.role === 'moderator') {
        next();
      } else {
        res.status(401);
        throw new Error("Chill out! you're not an admin");
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { adminProtect };
