import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/payments";

export const getPayments = () => axios.get(API);

export const createPayment = (data) => axios.post(API, data);

export const deletePayment = (id) => axios.delete(`${API}/${id}`);