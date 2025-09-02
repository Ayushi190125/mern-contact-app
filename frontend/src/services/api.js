import axios from "axios";

const BASE = "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE });

export const getRecords = (params) => api.get("/records", { params });
export const addRecord = (data) => api.post("/records", data);
export const updateRecord = (id, data) => api.put(`/records/${id}`, data);
export const getStates = () => api.get("/meta/states");