import React from "react";
import { Box, Typography } from "@mui/material";

const images = [
  "https://source.unsplash.com/400x300/?car-service",
  "https://source.unsplash.com/400x300/?mechanic",
  "https://source.unsplash.com/400x300/?auto-shop",
  "https://source.unsplash.com/400x300/?engine",
];

export default function ServiceGallery() {
  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: "background.default" }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Inside Our Workshop
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Gallery ${i}`}
            style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
          />
        ))}
      </Box>
    </Box>
  );
}
