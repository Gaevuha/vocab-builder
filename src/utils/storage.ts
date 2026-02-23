const TOKEN_KEY = "access_token";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getCookieValue(name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookieValue(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function removeCookieValue(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function saveToken(token: string) {
  setCookieValue(TOKEN_KEY, token);
  // clean legacy storage if present
  localStorage.removeItem(TOKEN_KEY);
}

export function loadToken() {
  const cookieToken = getCookieValue(TOKEN_KEY);
  if (cookieToken) return cookieToken;

  // legacy fallback + migration from localStorage
  const legacyToken = localStorage.getItem(TOKEN_KEY);
  if (legacyToken) {
    setCookieValue(TOKEN_KEY, legacyToken);
    localStorage.removeItem(TOKEN_KEY);
  }
  return legacyToken;
}

export function clearToken() {
  removeCookieValue(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
