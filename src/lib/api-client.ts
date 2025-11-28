import axios from "axios";
import { attachInterceptors } from "./interceptor";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  timeout: 15000,
});

attachInterceptors(apiClient);
