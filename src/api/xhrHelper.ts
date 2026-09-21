import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { setStoredAuthData } from "./axios";
import {
  ApiErrorResponse,
  PartnerLoginPayload,
  PartnerLoginResponse,
  PartnerUser,
  RejectedAuthError,
} from "../types/auth.types";
import { getDeviceInfo } from "../utils/device";
import { extractAuthTokens, extractAuthUser } from "../utils/token";

export const partnerLogin = async (
  payload: PartnerLoginPayload
): Promise<PartnerLoginResponse> => {
  const response = await api.post<PartnerLoginResponse>("/auth/partner/login/", payload);
  return response.data;
};

export const partnerForgotPassword = async (email: string): Promise<unknown> => {
  const response = await api.post("/auth/partner/forgot-password/", { email });
  return response.data;
};

export const extractError = (error: any): RejectedAuthError => {
  const data: ApiErrorResponse | undefined = error?.response?.data;

  return {
    message:
      data?.error ||
      (data as any)?.message ||
      error?.message ||
      "Something went wrong. Please try again.",
    fieldErrors: data?.errors,
  };
};

/**
 * Re-exported from utils/token so axios.ts and the thunks share one parser.
 * The partner API nests tokens under `data.tokens`.
 */
export const extractTokens = (
  data: PartnerLoginResponse
): { accessToken: string; refreshToken?: string } => extractAuthTokens(data);

export const extractUser = (data: PartnerLoginResponse): PartnerUser | null =>
  extractAuthUser<PartnerUser>(data);

export const loginPartner = createAsyncThunk<
  PartnerLoginResponse,
  { email: string; password: string },
  { rejectValue: RejectedAuthError }
>("auth/loginPartner", async (credentials, { rejectWithValue }) => {
  try {
    const payload: PartnerLoginPayload = {
      ...credentials,
      ...getDeviceInfo(),
    };

    const response = await partnerLogin(payload);
    const { accessToken, refreshToken } = extractAuthTokens(response);

    if (!accessToken) {
      return rejectWithValue({
        message: "Login succeeded but no access token was returned.",
      });
    }

    setStoredAuthData(accessToken, refreshToken, extractAuthUser<PartnerUser>(response));

    return response;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const forgotPassword = createAsyncThunk<
  unknown,
  string,
  { rejectValue: RejectedAuthError }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await partnerForgotPassword(email);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});