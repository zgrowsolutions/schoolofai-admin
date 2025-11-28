import type { AxiosInstance } from "axios";
import { useUser } from "@/store/use-user";

export const attachInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const token = useUser.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        useUser.getState().logout();
      }
      return Promise.reject(err);
    }
  );
};
