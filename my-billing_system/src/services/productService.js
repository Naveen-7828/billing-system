 import axios from "axios";

 const API = import.meta.env.VITE_API_URL + "/api/product";

export const getProducts = () => axios.get(API);
export const createProduct = (data) => axios.post(API, data);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API}/${id}`);