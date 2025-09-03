import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;


export const api = axios.create({
  baseURL: API_BASE,
});

export const getRecords = (params) => api.get("/records", { params });
export const addRecord = (data) => api.post("/records", data);
export const updateRecord = (id, data) => api.put(`/records/${id}`, data);
export const getStates = () => api.get("/meta/states");
