// src/api/vehicleApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // Adjust based on your backend
});

export const getVehicles = () => API.get("/vehicles");
export const getVehicleById = (id) => API.get(`/vehicles/${id}`);
export const createVehicle = (data) => API.post("/vehicles", data);
export const updateVehicle = (id, data) => API.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);
