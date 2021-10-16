require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Token } = require('../models/tokenModel');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' });
  const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

const saveToken = async (userId, refreshToken) => {
  const existedRefreshToken = await Token.findOne({ user: userId });

  if (existedRefreshToken) {
    existedRefreshToken.refreshToken = refreshToken;
    return existedRefreshToken.save();
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

module.exports = {
  generateTokens,
  saveToken,
};
