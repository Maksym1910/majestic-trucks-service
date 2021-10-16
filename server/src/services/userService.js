'use strict';

const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const { InvalidCredentialstError } = require('../utils/errors');

const getUserProfileInfo = async (userId) => {
  const user = await User.findById(userId);
  return {
    user: {
      _id: user._id,
      role: user.role,
      email: user.email,
      created_date: user.createdDate,
    },
  };
};

const changeUserAccountPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new InvalidCredentialstError('Invalid old password');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

const deleteUserAccount = async (userId) => {
  await User.findOneAndRemove({ _id: userId });
};

module.exports = {
  getUserProfileInfo,
  changeUserAccountPassword,
  deleteUserAccount,
};
