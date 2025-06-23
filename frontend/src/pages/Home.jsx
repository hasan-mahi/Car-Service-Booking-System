import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import Testimonials from "../components/home/Testimonials";
import ServiceGallery from "../components/home/ServiceGallery";
import BookingSection from "../components/home/BookingSection";

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
