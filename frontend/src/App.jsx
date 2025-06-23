// App.jsx or MainLayout.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Service";

function App({ mode, toggleTheme }) {
  const [isPageScrollable, setIsPageScrollable] = React.useState(false);

React.useEffect(() => {
  function checkScroll() {
    setIsPageScrollable(document.documentElement.scrollHeight > window.innerHeight);
  }
  checkScroll();

  window.addEventListener("resize", checkScroll);
  return () => window.removeEventListener("resize", checkScroll);
}, [location]); // if using react-router `location` to detect page changes


  return (
    <>
      <Navbar mode={mode} toggleTheme={toggleTheme} isPageScrollable={isPageScrollable} />
      <Layout isPageScrollable={isPageScrollable}>
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          {/* other routes */}
        </Routes>
      </Layout>
    </>
  );
}

export default App;