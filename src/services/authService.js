'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const nodemailer = require('nodemailer');
require('dotenv').config();

const {
  User,
} = require('../models/userModel');
const {
  InvalidRequestError,
} = require('../utils/errors');

const registration = async ({email, password, role}) => {
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    role,
  });

  await user.save();
};

const login = async ({email, password}) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new InvalidRequestError('Invalid email or password');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new InvalidRequestError('Invalid email or password');
  }

  const jwtToken = jwt.sign({
    _id: user._id,
    email: user.email,
    role: user.role,
  }, 'secret');
  return jwtToken;
};

const forgotPassword = async ({email}) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new InvalidRequestError('User doesn\'t exist');
  }

  const newPassword = passwordGenerator.generate({
    length: 8,
    numbers: true,
  });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: `${email}`,
    subject: 'Forgot Password Message',
    text: `New Password: ${newPassword}. Please, change it as fast as you can`,
  });
};

module.exports = {
  registration,
  login,
  forgotPassword,
};
