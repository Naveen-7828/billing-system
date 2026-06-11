import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/customer`;

export const getCustomers = () => {
    return axios.get(API_URL);
};

export const getCustomerById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createCustomer = (customer) => {
    return axios.post(API_URL, customer);
};

export const updateCustomer = (id, customer) => {
    return axios.put(`${API_URL}/${id}`, customer);
};

export const deleteCustomer = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};