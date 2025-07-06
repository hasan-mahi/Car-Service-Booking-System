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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVehicles, deleteVehicle } from "../../api/vehicleApi";

export default function VehicleList({ onEdit }) {
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        console.error(err);
        alert("Failed to delete vehicle.");
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

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
                  secondary={`License Plate: ${v.licensePlate}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit">
                    <IconButton
                      edge="end"
                      onClick={() => onEdit(v)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(v.id)}
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
    </Paper>
  );
}
