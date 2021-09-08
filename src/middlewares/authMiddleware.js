'use strict';

const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
  const {
    authorization,
  } = request.headers;
  const {
    jwt_token: jwtToken,
  } = request.cookies;

  console.log(jwtToken);
  if (!authorization) {
    return response.status(401).json({message: 'Provide authorization header'});
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return response.status(401).json({
      message: 'Please, include token to request',
    });
  }

  try {
    const tokenPayload = jwt.verify(token, 'secret');
    request.user = {
      userId: tokenPayload._id,
      email: tokenPayload.email,
      role: tokenPayload.role,
    };
    next();
  } catch (error) {
    response.status(401).json({message: error.message});
  }
};

module.exports = {authMiddleware};
