
export type DeviceType = "WEB" | "IOS" | "ANDROID";

export interface PartnerLoginPayload {
  email: string;
  password: string;
  device_id: string;
  device_type: DeviceType;
  fcm_token: string;
}

export interface PartnerUser {
  id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

export interface PartnerLoginResponse {
  success?: boolean;
  access?: string;
  access_token?: string;
  refresh?: string;
  refresh_token?: string;
  token?: string;
  user?: PartnerUser;
  error?: string;
  errors?: Record<string, string[]>;
  error_code?: string;

  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}

export interface RejectedAuthError {
  message: string;
  fieldErrors?: Record<string, string[]>;
}