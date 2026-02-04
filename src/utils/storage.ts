const TOKEN_KEY = "vocab_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function loadToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
