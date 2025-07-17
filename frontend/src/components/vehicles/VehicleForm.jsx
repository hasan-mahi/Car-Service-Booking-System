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
    year: "", // keep as string for controlled input
    license_plate: "",
  });

  useEffect(() => {
    if (current) {
      setForm({
        make: current.make || "",
        model: current.model || "",
        year: current.year ? String(current.year) : "",
        license_plate: current.license_plate || "",
      });
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

    // Validate year: must be a number within a reasonable range
    const yearNum = Number(form.year);
    const currentYear = new Date().getFullYear();
    if (
      !form.make.trim() ||
      !form.model.trim() ||
      !form.license_plate.trim() ||
      !form.year ||
      isNaN(yearNum) ||
      yearNum < 1886 || // first car invention year
      yearNum > currentYear + 1
    ) {
      alert("Please fill all fields with valid values. Year must be between 1886 and next year.");
      return;
    }

    try {
      const payload = {
        make: form.make.trim(),
        model: form.model.trim(),
        year: yearNum,
        license_plate: form.license_plate.trim(),
      };

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
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="license_plate"
              label="License Plate"
              value={form.license_plate}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="off"
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
