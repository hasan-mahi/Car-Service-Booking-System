import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { registerUser } from "../../api/authApi";
import { registerSchema } from "../../../validators/userValidator"; // adjust path if needed

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const { error } = registerSchema.validate(form, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }

    const errs = {};
    error.details.forEach((detail) => {
      const key = detail.path[0];
      if (!errs[key]) errs[key] = detail.message;
    });
    setErrors(errs);

    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Clear specific field error on change
    setErrors((errs) => ({ ...errs, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onRegisterSuccess?.(user, token);
    } catch (err) {
      setSubmitError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>

      {submitError && (
        <Typography color="error" mb={2}>
          {submitError}
        </Typography>
      )}

      <Stack spacing={2}>
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
          autoFocus
          autoComplete="username"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Stack>
    </form>
  );
}
