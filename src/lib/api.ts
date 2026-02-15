/**
 * Base URL for the backend API.
 * In dev with Vite we use "" so /api is proxied to localhost:5001 (no CORS).
 * Set VITE_API_BASE to override (e.g. "http://localhost:5001" for direct hit).
 */
export const API_BASE =
  (import.meta.env?.VITE_API_BASE as string | undefined) ??
  (import.meta.env?.DEV ? "" : "http://localhost:5001");

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}
