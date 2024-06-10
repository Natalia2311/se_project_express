const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.error('string.uri');
  }

  module.exports.validateCardBody = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
  
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      weather: Joi.string().valid("hot", "warm", "cold").required().messages({
        "any.requared": 'The "weather" field must be filled in',
        "any.only": 'The "weather" field must be one of "hot", "warm" or "cold"',
      }),
    }),
  });

  module.exports.validateUser = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),

      email: Joi.string().required().messages({
        "string.empty": 'The "Email" field must be filled in', 
        "string.email": 'The "email" field must be a valid email', 
      }),

      avatar: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "avatar" field must be filled in',
        "string.uri": 'The "avatar" field must be a valid url',
      }),

      password: Joi.string().required().messages({
        "string.empty": 'The "password" field must be filled in', 
      }),


    }),
  });

  module.exports.validateLogin= celebrate({
    body: Joi.object().keys({

      email: Joi.string().required().messages({
        "string.empty": 'The "Email" field must be filled in', 
        "string.email": 'The "email" field must be a valid email', 
      }),

      password: Joi.string().required().messages({
        "string.empty": 'The "password" field must be filled in', 
      }),


    }),
  });

  module.exports.validateId = celebrate({
    params: Joi.object().keys({
      ItemId: Joi.string().hex().length(24).messages({
        "string-hex": 'ID must be hexadecimal string',
        "string.max": 'ID must be 24 characters in lenght',
      }),
    }),
  });