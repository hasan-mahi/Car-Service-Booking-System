import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })  // <-- disable TLD validation here
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().min(3).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 3 characters",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })  // <-- disable TLD validation here too
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  role_id: Joi.number().integer().required().messages({
    "any.required": "Role ID is required",
    "number.base": "Role ID must be a number",
    "number.integer": "Role ID must be an integer",
  }),
});

export const accessSchema = Joi.object({
  role_id: Joi.number().integer().required().messages({
    "any.required": "Role ID is required",
    "number.base": "Role ID must be a number",
    "number.integer": "Role ID must be an integer",
  }),
  resource: Joi.string().required().messages({
    "any.required": "Resource is required",
    "string.empty": "Resource is required",
  }),
  can_create: Joi.boolean().required().messages({
    "any.required": "Permission 'can_create' is required",
  }),
  can_read: Joi.boolean().required().messages({
    "any.required": "Permission 'can_read' is required",
  }),
  can_update: Joi.boolean().required().messages({
    "any.required": "Permission 'can_update' is required",
  }),
  can_delete: Joi.boolean().required().messages({
    "any.required": "Permission 'can_delete' is required",
  }),
});
