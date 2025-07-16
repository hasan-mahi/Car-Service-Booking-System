import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { registerUser } from "../../api/authApi";

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Assuming your API responds with user data and token, e.g.:
      // { user: {...}, token: "jwt-token" }
      const { user, token } = res.data;

      // Save token and user info locally if you want
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Call callback to auto-login & navigate
      onRegisterSuccess?.(user, token);
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={2}>Register</Typography>
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
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Stack>
    </form>
  );
}
