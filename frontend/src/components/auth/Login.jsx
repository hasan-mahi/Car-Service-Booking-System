import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import { loginUser } from "../../api/authApi";

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password) {
      alert("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess?.(user, token);
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.error || "Login failed");
      setForm((f) => ({ ...f, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" mb={2}>Login</Typography>
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
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Stack>
    </form>
  );
}
