'use strict';

const {InvalidRequestError} = require('../utils/errors');

const isDriver = (request, response, next) => {
  const {role} = request.user;

  if (role !== 'DRIVER') {
    throw new InvalidRequestError('Available only for drivers', 403);
  }

  try {
    next();
  } catch (error) {
    throw new InvalidRequestError({message: error.message}, 404);
  }
};

const isShipper = (request, response, next) => {
  const {role} = request.user;

  if (role !== 'SHIPPER') {
    throw new InvalidRequestError('Available only for shipper', 403);
  }

  try {
    next();
  } catch (error) {
    throw new InvalidRequestError({message: error.message}, 404);
  }
};

module.exports = {
  isDriver,
  isShipper,
};
