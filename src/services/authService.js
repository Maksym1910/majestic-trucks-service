const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const uuid = require('uuid');

const {
  User,
} = require('../models/userModel');

const {
  InvalidRequestError,
} = require('../utils/errors');

const {
  sendActivationMail,
  sendRestorePasswordMail,
} = require('./mailService');

const {
  generateTokens, saveToken,
} = require('./tokenService');

const registration = async ({ email, password, role }) => {
  const activationLink = uuid.v4();
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    role,
    activationLink,
  });

  await sendActivationMail({
    to: email,
    link: `${process.env.API_URL}/api/activate/${activationLink}`,
  });
  await user.save();
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new InvalidRequestError('Invalid email or password');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new InvalidRequestError('Invalid email or password');
  }

  const tokens = generateTokens({
    _id: user._id,
    email: user.email,
    role: user.role,
    isActivated: user.isActivated,
  });
  await saveToken(user._id, tokens.refreshToken);
  return tokens;
};

const logout = async () => {
};

const activateAccount = async () => {

};

const refreshToken = async () => {

};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new InvalidRequestError('User doesn\'t exist');
  }

  const newPassword = passwordGenerator.generate({
    length: 8,
    numbers: true,
  });

  await sendRestorePasswordMail({
    to: email,
    newPassword,
  });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

module.exports = {
  registration,
  login,
  logout,
  activateAccount,
  refreshToken,
  forgotPassword,
};
