import axios, { AxiosError } from "axios";
import { loadToken, saveToken } from "../utils/storage";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function setToken(token: string) {
  saveToken(token);
}

export function getToken(): string | null {
  return loadToken();
}

const useCredentials = import.meta.env.VITE_USE_CREDENTIALS === "true";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: useCredentials,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Обробка помилок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message;
    const status = error.response?.status ?? 500;
    throw new ApiError(message, status);
  }
);
