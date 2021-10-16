const express = require('express');
const router = new express.Router();

const {
  asyncWrapper,
} = require('../utils/apiUtils');

const {
  forgotPassword,
  registration,
  login,
} = require('../services/authService');

const {
  registrationValidator,
} = require('../middlewares/validationMiddleware');

router.post(
    '/register',
    registrationValidator,
    asyncWrapper(async (request, response) => {
      const {
        email,
        password,
        role,
      } = request.body;

      await registration({ email, password, role });

      response.json({ message: 'Profile created successfully' });
    }),
);

router.post(
    '/login',
    asyncWrapper(async (request, response) => {
      const {
        email,
        password,
      } = request.body;

      const tokens = await login({ email, password });
      response.cookie(
          'refreshToken',
          tokens.refreshToken,
          {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          },
      );
      response.json(tokens);
    }),
);

router.post(
    '/logout',
    asyncWrapper(async (request, response) => {
      // const {
      //   email,
      //   password,
      // } = request.body;
      //
      // const token = await login({ email, password });
      //
      // response.json({ jwt_token: token });
    }),
);

router.get(
    '/activate/:link',
    asyncWrapper(async (request, response) => {
      // const {
      //   email,
      //   password,
      // } = request.body;
      //
      // const token = await login({ email, password });
      //
      // response.json({ jwt_token: token });
    }),
);

router.get(
    '/refresh',
    asyncWrapper(async (request, response) => {
      // const {
      //   email,
      //   password,
      // } = request.body;
      //
      // const token = await login({ email, password });
      //
      // response.json({ jwt_token: token });
    }),
);

router.post(
    '/forgot_password',
    asyncWrapper(async (request, response) => {
      const { email } = request.body;

      await forgotPassword({ email });

      response.json({ message: 'New password sent to your email address' });
    }),
);

module.exports = {
  authRoute: router,
};
