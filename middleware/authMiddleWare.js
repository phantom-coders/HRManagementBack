const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //bearer token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      // console.log(req.body);
      const selectedUser = req.body.email;
      const decodedUser = decoded.id;
      // console.log(selectedUser, decodedUser);
      if (selectedUser === decodedUser) {
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized, forbidden');
      }
    } catch (error) {
      //   console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
