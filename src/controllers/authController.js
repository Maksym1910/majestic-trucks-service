const express = require('express');
const router = new express.Router();

const {
  asyncWrapper,
} = require('../utils/apiUtils');

const {
  forgotPassword,
  registration,
  login,
  activateAccount,
  logout,
  refreshTokens,
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

      response.json({
        message: 'Profile created successfully. For activation check your email',
      });
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
      const {
        refreshToken,
      } = request.cookies;

      await logout(refreshToken);
      response.clearCookie('refreshToken');
      response.json({ message: 'Successfully logout' });
    }),
);

router.get(
    '/activate/:link',
    asyncWrapper(async (request, response) => {
      const {
        link,
      } = request.params;

      await activateAccount(link);

      response.redirect(process.env.CLIENT_URL);
    }),
);

router.post(
    '/refresh',
    asyncWrapper(async (request, response) => {
      const {
        refreshToken,
      } = request.cookies;

      const tokens = await refreshTokens(refreshToken);
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
