import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/bills";

export const generateBill = (data) =>
  axios.post(API, data);