const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ userId:id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

module.exports = generateToken;