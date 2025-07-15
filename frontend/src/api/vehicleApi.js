import axios from "axios";

// Make sure this base URL matches your backend server
const BASE_URL = "http://localhost:3001/vehicles";

export const getVehicles = () => axios.get(BASE_URL);

export const createVehicle = (data) => axios.post(BASE_URL, data);

export const updateVehicle = (id, data) => axios.put(`${BASE_URL}/${id}`, data);

export const deleteVehicle = (id) => axios.delete(`${BASE_URL}/${id}`);
