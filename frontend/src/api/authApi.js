import axios from "axios";
import { handleApiError } from "../../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export function getAuthHeaders(token = getToken()) {
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// PUBLIC endpoints (no auth)
export async function registerUser(data) {
  try {
    return await axios.post(`${API_URL}/users/register`, data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function loginUser(data) {
  try {
    return await axios.post(`${API_URL}/users/login`, data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// AUTHENTICATED endpoints
export async function getUsers(token) {
  try {
    return await axios.get(`${API_URL}/users`, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getUserById(id, token) {
  try {
    return await axios.get(`${API_URL}/users/${id}`, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateUser(id, data, token) {
  try {
    return await axios.put(`${API_URL}/users/${id}`, data, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteUser(id, token) {
  try {
    return await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getRoles(token) {
  try {
    return await axios.get(`${API_URL}/users/roles`, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getRoleAccess(roleId, token) {
  try {
    return await axios.get(`${API_URL}/users/accesses/${roleId}`, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateRoleAccess(data, token) {
  try {
    return await axios.post(`${API_URL}/users/accesses`, data, getAuthHeaders(token));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
