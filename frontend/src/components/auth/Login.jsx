import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { loginUser } from "../../api/authApi";
import { loginSchema } from "../../../validators/userValidator"; // adjust path as needed

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({}); // Track errors per field
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(""); // For API error messages

  const validate = () => {
    const { error } = loginSchema.validate(form, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }

    const errs = {};
    error.details.forEach((detail) => {
      const key = detail.path[0];
      // Only keep the first error message per field
      if (!errs[key]) errs[key] = detail.message;
    });

    setErrors(errs);
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Clear field error when user starts typing
    setErrors((errs) => ({ ...errs, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess?.(user, token);
    } catch (err) {
      setSubmitError(err.message || "Login failed. Please try again later.");
      setForm((f) => ({ ...f, password: "" })); // Clear password
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={2}>
        Login
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
          autoFocus
          disabled={loading}
          autoComplete="username"
          error={!!errors.username}
          helperText={errors.username}
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
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Stack>
    </form>
  );
}
