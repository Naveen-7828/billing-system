import axios from "axios";

const API = "http://localhost:8080/api/billing";

export const generateBill = (data) =>
  axios.post(API, data);