import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Layout from "./components/Layout";

import Home from "./components/home/Home";
import Services from "./pages/Service";
import Vehicles from "./components/vehicles/Vehicles";
import AuthPage from "./components/auth/Auth";


function App({ mode, toggleTheme }) {
  const [isPageScrollable, setIsPageScrollable] = useState(false);
  const location = useLocation();

  // Load user from localStorage or null, safely parse JSON
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const checkScroll = () => {
      setIsPageScrollable(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Protect admin routes: only logged-in admin users
  const RequireAdmin = ({ children }) => {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    if (user.role !== "admin") {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Unauthorized</h2>
          <p>Admins only. Please log in with an admin account.</p>
        </div>
      );
    }
    return children;
  };

  return (
    <>
      <Navbar
        mode={mode}
        toggleTheme={toggleTheme}
        isPageScrollable={isPageScrollable}
        user={user}
        onLogout={handleLogout}
      />
      <Layout isPageScrollable={isPageScrollable}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicles" element={<Vehicles />} />

          {/* Auth routes */}
          <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <AuthPage onLoginSuccess={setUser} />}
          />

          {/* Admin routes */}
          {/* <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminPage onLogout={handleLogout} />
              </RequireAdmin>
            }
          /> */}

          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
