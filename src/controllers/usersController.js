'use strict';

const express = require('express');
const router = new express.Router();

const {
  asyncWrapper,
} = require('../utils/apiUtils');
const {
  getUserProfileInfo,
  changeUserAccountPassword,
  deleteUserAccount,
} = require('../services/userService');
const { passwordValidator } = require('../middlewares/validationMiddleware');

router.get(
    '/me',
    asyncWrapper(async (request, response) => {
      const { userId } = request.user;
      const userProfileInfo = await getUserProfileInfo(userId);
      response.json(userProfileInfo);
    }),
);

router.delete(
    '/me',
    asyncWrapper(async (request, response) => {
      const { userId } = request.user;
      await deleteUserAccount(userId);
      response.json({ message: 'Profile deleted successfully' });
    }),
);

router.patch(
    '/me/password',
    passwordValidator,
    asyncWrapper(async (request, response) => {
      const { userId } = request.user;
      const {
        oldPassword,
        newPassword,
      } = request.body;

      await changeUserAccountPassword(userId, oldPassword, newPassword);
      response.json({ message: 'Password changed successfully' });
    }),
);

module.exports = {
  usersRoute: router,
};
