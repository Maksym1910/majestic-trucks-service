/* eslint-disable require-jsdoc */
'use strict';

class AppError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
  }
}

class InvalidRequestError extends AppError {
  constructor(message = 'Invalid request', status = 400) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends AppError {
  constructor(message = 'Invalid data') {
    super(message);
    this.status = 400;
  }
}

class InvalidCredentialstError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  AppError,
  InvalidRequestError,
  ValidationError,
  InvalidCredentialstError,
};
