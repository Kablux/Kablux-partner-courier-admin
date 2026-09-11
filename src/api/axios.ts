import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

// ============================================================================
// TOKEN MANAGEMENT HELPERS
// ============================================================================
export const TOKEN_KEY = "partner_access_token";
export const REFRESH_KEY = "partner_refresh_token";

export function setStoredTokens(access?: string, refresh?: string): void {
  if (access) {
    localStorage.setItem(TOKEN_KEY, access);
  } else {
    console.warn("Auth: Attempted to save an undefined access token.");
  }

  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh);
  }
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: API_BASE_URL,
  // Note: We don't set a default Content-Type here so the interceptor 
  // can dynamically assign it based on the payload type.
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      if (config.headers && config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    } else {
      if (config.headers && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Intercept 401 Unauthorized responses to clear stale tokens
    if (error.response?.status === 401) {
      clearStoredTokens();
      
      // Optional: Force a window reload or dispatch an event to redirect the user to /login
      // window.dispatchEvent(new Event('auth-unauthorized')); 
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;