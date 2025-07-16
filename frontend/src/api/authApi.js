import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Utility: Get JWT token from localStorage
function getToken() {
  return localStorage.getItem("token") || null;
}

// Helper: Attach Authorization header if token exists
function getAuthHeaders(token = getToken()) {
  if (!token) return {}; // no auth header if no token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// PUBLIC endpoints (no auth)
export async function registerUser(data) {
  return axios.post(`${API_URL}/users/register`, data);
}

export async function loginUser(data) {
  return axios.post(`${API_URL}/users/login`, data);
}

// AUTHENTICATED endpoints (require token)

// Get all users
export async function getUsers(token) {
  return axios.get(`${API_URL}/users`, getAuthHeaders(token));
}

// Get user by ID
export async function getUserById(id, token) {
  return axios.get(`${API_URL}/users/${id}`, getAuthHeaders(token));
}

// Update user by ID
export async function updateUser(id, data, token) {
  return axios.put(`${API_URL}/users/${id}`, data, getAuthHeaders(token));
}

// Delete user by ID
export async function deleteUser(id, token) {
  return axios.delete(`${API_URL}/users/${id}`, getAuthHeaders(token));
}

// Get roles
export async function getRoles(token) {
  return axios.get(`${API_URL}/users/roles`, getAuthHeaders(token));
}

// Get access permissions for a role
export async function getRoleAccess(roleId, token) {
  return axios.get(`${API_URL}/users/accesses/${roleId}`, getAuthHeaders(token));
}

// Update role access permissions
export async function updateRoleAccess(data, token) {
  return axios.post(`${API_URL}/users/accesses`, data, getAuthHeaders(token));
}
