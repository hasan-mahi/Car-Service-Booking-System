import axiosClient from "./axiosClient";

const VEHICLE_BASE_URL = "/vehicles";

export const getVehicles = () => axiosClient.get(VEHICLE_BASE_URL);

export const createVehicle = (data) => axiosClient.post(VEHICLE_BASE_URL, data);

export const updateVehicle = (id, data) =>
  axiosClient.put(`${VEHICLE_BASE_URL}/${id}`, data);

export const deleteVehicle = (id) => axiosClient.delete(`${VEHICLE_BASE_URL}/${id}`);
