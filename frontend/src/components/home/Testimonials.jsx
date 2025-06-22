import React from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Emily", feedback: "Great experience! Fixed quickly and affordably." },
  { name: "Mark", feedback: "Friendly staff, quality service, and honest pricing." },
  { name: "Sophia", feedback: "Highly recommend them for regular maintenance!" },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        What Our Customers Say
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          mt: 4,
          px: 2,
        }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.2 }}
          >
            <Card
              sx={{
                width: 280,
                borderRadius: 3,
                backgroundColor: "background.paper",
                boxShadow: 3,
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar sx={{ mx: "auto", bgcolor: "primary.main" }}>
                  {t.name[0]}
                </Avatar>
                <Typography fontWeight="bold" mt={1}>
                  {t.name}
                </Typography>
                <Typography variant="body2" mt={1} color="text.secondary">
                  "{t.feedback}"
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
