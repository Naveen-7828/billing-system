import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/invoices";

export const getInvoices = () => axios.get(API);
export const createInvoice = (data) => axios.post(API, data);