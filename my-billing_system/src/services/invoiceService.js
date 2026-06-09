import axios from "axios";

const API = "http://localhost:8080/api/invoices";

export const getInvoices = () => axios.get(API);
export const createInvoice = (data) => axios.post(API, data);