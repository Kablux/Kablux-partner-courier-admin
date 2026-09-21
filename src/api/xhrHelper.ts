import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { setStoredTokens } from "./axios";
import {
  ApiErrorResponse,
  PartnerLoginPayload,
  PartnerLoginResponse,
  RejectedAuthError,
} from "../types/auth.types";
import { getDeviceInfo } from "../utils/device";

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
    message: data?.error || error?.message || "Something went wrong. Please try again.",
    fieldErrors: data?.errors,
  };
};

export const extractTokens = (
  data: PartnerLoginResponse
): { accessToken: string; refreshToken?: string } => {
  const accessToken = data.access || data.access_token || data.token || "";
  const refreshToken = data.refresh || data.refresh_token || undefined;
  return { accessToken, refreshToken };
};

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
    const { accessToken, refreshToken } = extractTokens(response);

    if (accessToken) {
      setStoredTokens(accessToken, refreshToken);
    }

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

