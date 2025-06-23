import React from "react";
import { motion } from "framer-motion";

export default function Service() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1>Service Page</h1>
        <p>This is the service page content.</p>
        {/* Add more content or components as needed */}
      </div>
    </motion.div>
  );
}
