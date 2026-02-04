export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.message ?? "Request failed";
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
