import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Grid, Stack } from "@mui/material";
import { createVehicle, updateVehicle } from "../../api/vehicleApi";
import { validateVehicle } from "../../../validators/vehicleValidator";

export default function VehicleForm({ current, onSaved, onCancel }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "", // string for controlled input
    license_plate: "",
  });

  const [errors, setErrors] = useState({});

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
    setErrors({});
  }, [current]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    const { isValid, errors: fieldErrors } = validateVehicle({
      ...form,
      [name]: value,
    });

    if (!isValid) {
      setErrors(fieldErrors);
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors, value } = validateVehicle(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (current?.id) {
        await updateVehicle(current.id, value);
      } else {
        await createVehicle(value);
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
          {["make", "model", "year", "license_plate"].map((field) => (
            <Grid key={field}>
              <TextField
                name={field}
                label={field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                value={form[field]}
                onChange={handleChange}
                fullWidth
                required
                type={field === "year" ? "number" : "text"}
                error={!!errors[field]}
                helperText={errors[field]}
                inputProps={field === "year" ? { min: 1886, max: new Date().getFullYear() + 1 } : {}}
                autoComplete="off"
                autoFocus={field === "make"}
              />
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            {current ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </Stack>
      </form>
    </>
  );
}
