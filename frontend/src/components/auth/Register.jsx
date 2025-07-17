import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { registerUser } from "../../api/authApi";

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // error message for UI

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (error) setError(""); // clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

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
      // err.message already contains the user-friendly message from handleApiError in api layer
      setError(err.message || "Registration failed. Please try again.");
      // Optionally, avoid console.error here since it’s already logged in api layer
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
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
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Stack>
    </form>
  );
}
