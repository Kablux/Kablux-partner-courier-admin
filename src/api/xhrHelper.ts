import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { setStoredAuthData } from "./axios";
import {
  ApiErrorResponse,
  PartnerLoginPayload,
  PartnerLoginResponse,
  PartnerUser,
  RejectedApiError,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/auth.types";
import { getDeviceInfo } from "../utils/device";
import { extractAuthTokens, extractAuthUser } from "../utils/token";
import {
  partnerLogin,
  partnerForgotPassword,
  partnerResetPassword,
  fetchPartnerNotifications,
} from "./xhr";
import {
  NotificationsListData,
  NotificationsQueryParams,
} from "../types/index.types";

export const extractError = (error: any): RejectedApiError => {
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
  data: PartnerLoginResponse,
): { accessToken: string; refreshToken?: string } => extractAuthTokens(data);

export const extractUser = (data: PartnerLoginResponse): PartnerUser | null =>
  extractAuthUser<PartnerUser>(data);

export const loginPartner = createAsyncThunk<
  PartnerLoginResponse,
  { email: string; password: string },
  { rejectValue: RejectedApiError }
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

    setStoredAuthData(
      accessToken,
      refreshToken,
      extractAuthUser<PartnerUser>(response),
    );

    return response;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const forgotPassword = createAsyncThunk<
  unknown,
  string,
  { rejectValue: RejectedApiError }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await partnerForgotPassword(email);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload,
  { rejectValue: RejectedApiError }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    return await partnerResetPassword(payload);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

///dashboard
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/teams/dashboard/");
      return response.data.data; // Assuming response is { success: true, data: { ... } }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data",
      );
    }
  },
);

///Notifications
export const fetchNotifications = createAsyncThunk<
  NotificationsListData,
  NotificationsQueryParams,
  { rejectValue: RejectedApiError }
>("notifications/fetch", async (params, { rejectWithValue }) => {
  try {
    return await fetchPartnerNotifications(params);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});
