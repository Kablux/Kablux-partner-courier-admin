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
  phone_number?: string;
  profile_photo?: string | null;
  [key: string]: unknown;
}

export interface PartnerTokens {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  expires_in?: number;
}

export interface PartnerLoginData {
  user_type?: string;
  account_status?: string;
  tokens?: PartnerTokens;
  user?: PartnerUser;
  requires_action?: string;
  [key: string]: unknown;
}

export interface PartnerLoginResponse {
  success?: boolean;
  message?: string;
  data?: PartnerLoginData;
  // Legacy / flat fallbacks — kept so extractTokens can handle either shape.
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

export interface RejectedApiError {
  message: string;
  fieldErrors?: Record<string, string[]>;
}
 
export interface ResetPasswordPayload {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}
 
export interface ResetPasswordResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}