import { createAsyncThunk } from "@reduxjs/toolkit";
import { partnerLogin, partnerForgotPassword } from "./xhr";
import { ApiErrorResponse, PartnerLoginResponse } from "../types/auth.types";
import { getDeviceInfo } from "../utils/device";
import { setStoredTokens } from "./axios";


const extractError = (error: any): string => {
  const data: ApiErrorResponse | undefined = error?.response?.data;
  if (data?.error) return data.error;
  if (data?.errors) {
    const firstField = Object.values(data.errors)[0];
    if (Array.isArray(firstField) && firstField[0]) return firstField[0];
  }
  return error?.message || "Something went wrong. Please try again.";
};

export const extractTokens = (
  data: PartnerLoginResponse
): { accessToken: string; refreshToken?: string } => {
  const accessToken =
    data.access || data.access_token || data.token || "";
  const refreshToken =
    data.refresh || data.refresh_token || undefined;

  return { accessToken, refreshToken };
};

export const loginPartner = createAsyncThunk<
  PartnerLoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginPartner", async (credentials, { rejectWithValue }) => {
  try {
    const payload = {
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
})

export const forgotPassword = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await partnerForgotPassword(email);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});