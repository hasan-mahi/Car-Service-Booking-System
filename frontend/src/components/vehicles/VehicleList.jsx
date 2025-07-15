// src/components/VehicleList.jsx
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVehicles, deleteVehicle } from "../../api/vehicleApi";

export default function VehicleList({ onEdit }) {
  const [vehicles, setVehicles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenDialog = (id) => {
    setSelectedVehicleId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedVehicleId(null);
    setOpenDialog(false);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicleId) return;
    setIsDeleting(true);
    try {
      await deleteVehicle(selectedVehicleId); // handles 204 response
      await fetchVehicles(); // refresh list
      handleCloseDialog(); // close dialog
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete vehicle.");
      handleCloseDialog();
    }
  };

  return (
    <Paper sx={{ p: 3 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Vehicle List
      </Typography>

      {vehicles.length === 0 ? (
        <Typography>No vehicles found.</Typography>
      ) : (
        <List>
          {vehicles.map((v, i) => (
            <React.Fragment key={v.id}>
              <ListItem>
                <ListItemText
                  primary={`${v.make} ${v.model} (${v.year})`}
                  secondary={`License Plate: ${v.license_plate}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit">
                    <IconButton edge="end" onClick={() => onEdit(v)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(v.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              {i < vehicles.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
