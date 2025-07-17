// utils/validate.js
const validate = (schema, data) => {
  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(data, options);

  if (error) {
    const details = error.details.map((d) => d.message);
    return { isValid: false, errors: details };
  }

  return { isValid: true, value };
};

// Express middleware factory
const validateMiddleware = (schema) => (req, res, next) => {
  const { isValid, value, errors } = validate(schema, req.body);
  if (!isValid) {
    return res.status(400).json({ error: errors.join(", ") });
  }
  req.validatedBody = value; // Attach sanitized data to request
  next();
};

module.exports = { validate, validateMiddleware };
