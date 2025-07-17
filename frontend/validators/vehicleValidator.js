import Joi from "joi";

export const vehicleSchema = Joi.object({
  make: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Make is required",
    "string.min": "Make must be at least 2 characters",
  }),
  model: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Model is required",
    "string.min": "Model must be at least 1 character",
  }),
  year: Joi.number().integer().min(1886).max(new Date().getFullYear() + 1).required().messages({
    "number.base": "Year must be a number",
    "number.min": "Year must be a valid production year",
    "number.max": "Year cannot be in the future",
  }),
  license_plate: Joi.string().min(2).max(20).required().messages({
    "string.empty": "License plate is required",
    "string.min": "License plate must be at least 2 characters",
  }),
});

export function validateVehicle(data) {
  const { error, value } = vehicleSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (!error) {
    return { isValid: true, value };
  }

  // Collect all error messages
  const errors = {};
  error.details.forEach((detail) => {
    errors[detail.path[0]] = detail.message;
  });

  return { isValid: false, errors };
}
