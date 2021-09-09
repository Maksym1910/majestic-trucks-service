const { validateToken } = require('../services/tokenService');

const authMiddleware = (request, response, next) => {
  const {
    authorization,
  } = request.headers;

  if (!authorization) {
    return response.status(401).json({ message: 'Provide authorization header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return response.status(401).json({
      message: 'Please, include token to request',
    });
  }

  try {
    const tokenPayload = validateToken(token, process.env.JWT_ACCESS_SECRET);
    request.user = {
      userId: tokenPayload._id,
      email: tokenPayload.email,
      role: tokenPayload.role,
      isActivated: tokenPayload.isActivated,
    };
    next();
  } catch (error) {
    response.status(401).json({ message: error.message });
  }
};

module.exports = { authMiddleware };
