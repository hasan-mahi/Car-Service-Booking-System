import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: "center",
        background: isLight ? "#f5f7fa" : "#121212",
      }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CarRepairIcon sx={{ fontSize: 70, color: isLight ? "#FF6F00" : "#FFAB40" }} />
        <Typography
          variant="h3"
          fontWeight="bold"
          color={isLight ? "#1e293b" : "#f3f4f6"}
          mt={2}
        >
          Quality Car Repairs You Can Trust
        </Typography>
        <Typography
          variant="subtitle1"
          color={isLight ? "#334155" : "#cbd5e1"}
          mt={1}
          mb={4}
        >
          Fast. Affordable. Guaranteed.
        </Typography>
        <Button
          component={Link}
          to="/bookings"
          size="large"
          variant="contained"
          sx={{
            backgroundColor: isLight ? "#FF6F00" : "#FFAB40",
            '&:hover': {
              backgroundColor: isLight ? "#e65c00" : "#ff9900"
            }
          }}
        >
          Book Now
        </Button>
      </motion.div>
    </Box>
  );
}
