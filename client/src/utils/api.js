import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchPincode = async (pincode) => {
  const response = await api.get(`/api/pincode/${pincode}`);
  return response.data;
};

export const fetchSuggestions = async (query) => {
  const response = await api.get(`/api/suggest?q=${query}`);
  return response.data.suggestions;
};

export const fetchAllPincodes = async () => {
  const response = await api.get("/api/pincodes");
  return response.data.pincodes;
};

export default api;
