import axios from "axios";

const API = "http://localhost:8080/api/payments";

export const getPayments = () => axios.get(API);

export const createPayment = (data) => axios.post(API, data);

export const deletePayment = (id) => axios.delete(`${API}/${id}`);