'use strict';

const Joi = require('joi');
const {ValidationError} = require('../utils/errors');

const registrationValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(5)
        .max(20)
        .required(),
    role: Joi.string()
        .valid('DRIVER', 'SHIPPER')
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.message));
  }
};

const passwordValidator = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
        .required(),
    newPassword: Joi.string()
        .min(5)
        .max(20)
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.message));
  }
};

const trucksTypeValidator = async (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string()
        .valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT')
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.message));
  }
};

const loadValidator = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
        .max(20)
        .required(),
    payload: Joi.number()
        .positive()
        .required(),
    pickup_address: Joi.string()
        .max(50)
        .required(),
    delivery_address: Joi.string()
        .max(50)
        .required(),
    dimensions: Joi.object({
      width: Joi.number(),
      length: Joi.number(),
      height: Joi.number(),
    })
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new ValidationError(err.message));
  }
};

module.exports = {
  registrationValidator,
  passwordValidator,
  trucksTypeValidator,
  loadValidator,
};
