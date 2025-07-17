const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(3).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 3 characters",
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  role_id: Joi.number().integer().required().messages({
    "any.required": "Role ID is required",
  }),
});

const accessSchema = Joi.object({
  role_id: Joi.number().integer().required(),
  resource: Joi.string().required(),
  can_create: Joi.boolean().required(),
  can_read: Joi.boolean().required(),
  can_update: Joi.boolean().required(),
  can_delete: Joi.boolean().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  accessSchema,
};
