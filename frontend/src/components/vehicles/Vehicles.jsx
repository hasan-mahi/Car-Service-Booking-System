import React, { useState } from "react";
import VehicleForm from "./VehicleForm";
import VehicleList from "./VehicleList";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Vehicles = () => {
  const [current, setCurrent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNew = () => {
    setCurrent(null);
    setShowForm(true);
  };

  const handleSaved = () => {
    setCurrent(null);
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (vehicle) => {
    setCurrent(vehicle);
    setShowForm(true);
  };

  const handleCancel = () => {
    setCurrent(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <h1>Vehicle Management</h1>

      <button onClick={handleAddNew} style={{ marginBottom: 16 }}>
        Add New Vehicle
      </button>

      <VehicleList key={refreshKey} onEdit={handleEdit} />

      <Dialog open={showForm} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {current ? "Edit Vehicle" : "Add New Vehicle"}
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <VehicleForm current={current} onSaved={handleSaved} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicles;
