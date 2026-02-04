// src/services/auth.ts
import { api, ApiError, setToken } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export async function registerUser(
  payload: RegisterRequest
): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/users/signup", payload);
    if (res.data.token) setToken(res.data.token);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Unknown error during registration", 500);
  }
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/users/signin", payload);
    if (res.data.token) setToken(res.data.token);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Unknown error during login", 500);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/users/signout");
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Unknown error during logout", 500);
  } finally {
    localStorage.removeItem("token");
  }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const res = await api.get<AuthResponse>("/users/current");
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to fetch current user", 500);
  }
}
