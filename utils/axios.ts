import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { ["kyoka-token"]: token } = parseCookies();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  });

  api.interceptors.request.use((config) => {
    console.log(config);

    return config;
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}
