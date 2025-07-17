import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import Testimonials from "./Testimonials";
import ServiceGallery from "./ServiceGallery";
import BookingSection from "./BookingSection";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        <HeroSection />
        <Testimonials />
        <ServiceGallery />
        <BookingSection />
      </Box>
    </motion.div>
  );
}
