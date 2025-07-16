import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function AuthPage({ onLoginSuccess }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize isLogin based on URL param "mode"
  const modeParam = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(modeParam !== "register");

  useEffect(() => {
    // Sync local state when URL changes externally
    setIsLogin(modeParam !== "register");
  }, [modeParam]);

  const toggleMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);

    // Update URL query param accordingly without reload
    if (newIsLogin) {
      searchParams.delete("mode");
      setSearchParams(searchParams);
    } else {
      searchParams.set("mode", "register");
      setSearchParams(searchParams);
    }
  };

  // Called when registration succeeds - auto-login user
  const handleRegisterSuccess = (user, token) => {
    if (onLoginSuccess) onLoginSuccess(user, token);
    // Redirect to homepage or dashboard after register/login
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      {isLogin ? (
        <Login onLoginSuccess={onLoginSuccess} />
      ) : (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}

      <Button
        type="button"
        variant="text"
        onClick={toggleMode}
        sx={{ mt: 2 }}
      >
        <Typography variant="body2" color="primary">
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </Typography>
      </Button>
    </Box>
  );
}
