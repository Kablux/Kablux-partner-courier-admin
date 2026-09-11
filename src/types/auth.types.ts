
export type DeviceType = "WEB" | "IOS" | "ANDROID";

export interface PartnerLoginPayload {
  email: string;
  password: string;
  device_id: string;
  device_type: DeviceType;
  fcm_token: string;
}

export interface PartnerUser {
  id?: string;
  email?: string;
  full_name?: string;
  [key: string]: unknown;
}

// The 200 response schema is generic, so token field names are unknown. 
export interface PartnerLoginResponse {
  access?: string;
  refresh?: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: PartnerUser;
  [key: string]: unknown;
}

// Matches the documented 400 error shape.
export interface ApiErrorResponse {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}