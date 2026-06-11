import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/users";

// GET ALL USERS
export const getUsers = () => {
  return axios.get(API_URL);
};

// GET USER BY ID
export const getUserById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// CREATE USER
export const createUser = (user) => {
  return axios.post(API_URL, user);
};

// UPDATE USER
export const updateUser = (id, user) => {
  return axios.put(`${API_URL}/${id}`, user);
};

// DELETE USER
export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};