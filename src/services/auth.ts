import { request } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export function registerUser(payload: RegisterRequest) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginRequest) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
