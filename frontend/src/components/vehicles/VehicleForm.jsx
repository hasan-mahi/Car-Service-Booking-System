import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import { createVehicle, updateVehicle } from "../../api/vehicleApi";

export default function VehicleForm({ current, onSaved, onCancel }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    license_plate: "", // ✅ keep snake_case for consistency
  });

  useEffect(() => {
    if (current) {
      setForm(current);
    } else {
      setForm({ make: "", model: "", year: "", license_plate: "" });
    }
  }, [current]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        license_plate: form.license_plate.trim(), // ✅ matches backend
      };

      console.log("🚀 Payload being sent to backend:", payload);

      if (current?.id) {
        await updateVehicle(current.id, payload);
      } else {
        await createVehicle(payload);
      }

      onSaved();
    } catch (error) {
      console.error("❌ Failed to save vehicle:", error);
      alert("Failed to save vehicle");
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {current ? "Edit Vehicle" : "Add New Vehicle"}
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="make"
              label="Make"
              value={form.make}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="model"
              label="Model"
              value={form.model}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="year"
              label="Year"
              type="number"
              value={form.year}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 1886, max: new Date().getFullYear() + 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="license_plate" // ✅ field name matches backend + DB
              label="License Plate"
              value={form.license_plate}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="primary">
            {current ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </Stack>
      </form>
    </>
  );
}
