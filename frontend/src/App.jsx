// src/App.jsx or MainLayout.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Service";
import Vehicles from "./pages/Vehicles"; // ✅ New import

function App({ mode, toggleTheme }) {
  const [isPageScrollable, setIsPageScrollable] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    function checkScroll() {
      setIsPageScrollable(document.documentElement.scrollHeight > window.innerHeight);
    }
    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [location]);

  return (
    <>
      <Navbar mode={mode} toggleTheme={toggleTheme} isPageScrollable={isPageScrollable} />
      <Layout isPageScrollable={isPageScrollable}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicles" element={<Vehicles />} /> {/* ✅ New route */}
        </Routes>
      </Layout>
    </>
  );
}

export default App;
