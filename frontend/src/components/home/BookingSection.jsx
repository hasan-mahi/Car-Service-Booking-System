import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
} from "@mui/material";

export default function BookingSection() {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box sx={{ py: 8, backgroundColor: isLight ? "#e3f2fd" : "#1e1e1e", px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Book a Service
        </Typography>
        <Box component="form" autoComplete="off" noValidate>
          <TextField label="Full Name" fullWidth sx={{ mb: 2 }} />
          <TextField label="Phone Number" fullWidth sx={{ mb: 2 }} />
          <TextField label="Vehicle Info" fullWidth sx={{ mb: 2 }} />
          <Button variant="contained" size="large" fullWidth>
            Confirm Booking
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
