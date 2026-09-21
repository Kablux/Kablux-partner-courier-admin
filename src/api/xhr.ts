import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { PartnerUser } from "../types/auth.types";
import { hasLiveSession, isTokenExpired } from "../utils/token";

export const TOKEN_KEY = "partner_access_token";
export const REFRESH_KEY = "partner_refresh_token";
export const USER_KEY = "partner_user";

// Storage Helper Functions
export function setStoredTokens(access?: string, refresh?: string): void {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function setStoredAuthData(
  access?: string,
  refresh?: string,
  user?: PartnerUser | null
): void {
  setStoredTokens(access, refresh);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): PartnerUser | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as PartnerUser;
  } catch {
    return null;
  }
}

/**
 * Source of truth for "is this browser still logged in?" on app boot.
 * Deliberately does NOT depend on a stored user object — the login response
 * may not include one.
 */
export function hasStoredSession(): boolean {
  return hasLiveSession(getStoredAccessToken(), getStoredRefreshToken());
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.yourdomain.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor
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
    } else if (config.headers && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh Token Queue Handler
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Exclude refresh on auth endpoints
      if (
        originalRequest.url?.includes("/auth/partner/login/") ||
        originalRequest.url?.includes("/auth/partner/forgot-password/")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");
        if (isTokenExpired(refreshToken)) throw new Error("Refresh token expired");

        const response = await axios.post(`${API_BASE_URL}/auth/partner/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access || response.data.access_token;
        // Backend may rotate the refresh token — persist it when it does.
        const rotatedRefresh = response.data.refresh || response.data.refresh_token;
        setStoredTokens(newAccessToken, rotatedRefresh);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredTokens();
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;