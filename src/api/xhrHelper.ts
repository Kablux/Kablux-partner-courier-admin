import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { getStoredRefreshToken, setStoredAuthData } from "./axios";
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
  partnerLogout,
  partnerLogin,
  partnerForgotPassword,
  partnerResetPassword,
  fetchPartnerNotifications,
  fetchPartnerOrders,
  fetchPartnerOrderDetail,
  fetchPartnerApiKeys,
  createPartnerApiKey,
  fetchPartnerWebhookEndpoint,
  savePartnerWebhookEndpoint,
  fetchPartnerActivityLog,
  fetchPartnerWalletSummary,
  fetchPartnerWalletTransactions,
  fetchPartnerWalletTransaction,
  createPartnerWalletTopUp,
} from "./xhr";
import {
  WalletSummary,
  WalletTopUpResult,
  WalletTransaction,
  WalletTransactionsData,
  ActivityLogData,
  ActivityLogParams,
  AddMemberPayload,
  ApiKey,
  CreatedApiKey,
  NotificationsListData,
  NotificationsQueryParams,
  OrderDetail,
  OrdersListData,
  SaveWebhookResult,
  TeamMember,
  WebhookEndpoint,
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
    status: error?.response?.status,
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

/**
 * Asks the server to invalidate this session's tokens (or every session with
 * `allDevices`). It never rejects: local sign-out must happen even if the
 * server can't be reached, so the result only says whether the server confirmed.
 * Call `logout()` afterwards (see useSignOut) to clear the app's state.
 */
export const logoutPartner = createAsyncThunk<
  { serverConfirmed: boolean },
  { allDevices?: boolean } | void
>(
  "auth/logoutPartner",
  async (arg) => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return { serverConfirmed: false };
    try {
      await partnerLogout({
        refresh_token: refreshToken,
        all_devices: Boolean(arg && arg.allDevices),
        fcm_token: getDeviceInfo().fcm_token,
      });
      return { serverConfirmed: true };
    } catch {
      return { serverConfirmed: false };
    }
  },
  {
    // Ignore repeat clicks while a sign-out is already running.
    condition: (_, { getState }) =>
      !(getState() as { auth: { loggingOut: boolean } }).auth.loggingOut,
  },
);

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

///Orders
export const fetchOrders = createAsyncThunk<
  OrdersListData,
  void,
  { rejectValue: RejectedApiError }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await fetchPartnerOrders();
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const fetchOrderDetail = createAsyncThunk<
  OrderDetail,
  string,
  { rejectValue: RejectedApiError }
>("orders/fetchOrderDetail", async (orderId, { rejectWithValue }) => {
  try {
    return await fetchPartnerOrderDetail(orderId);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

///API keys
export const fetchApiKeys = createAsyncThunk<
  ApiKey[],
  void,
  { rejectValue: RejectedApiError }
>(
  "apiKeys/fetchApiKeys",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPartnerApiKeys();
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
  {
    // Skip if a request is already in flight (e.g. StrictMode's double effect).
    condition: (_, { getState }) =>
      !(getState() as { apiKeys: { loading: boolean } }).apiKeys.loading,
  },
);

export const createApiKey = createAsyncThunk<
  CreatedApiKey,
  string,
  { rejectValue: RejectedApiError }
>("apiKeys/createApiKey", async (name, { rejectWithValue }) => {
  try {
    return await createPartnerApiKey(name);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

///Webhook endpoint
export const fetchWebhookEndpoint = createAsyncThunk<
  WebhookEndpoint | null,
  void,
  { rejectValue: RejectedApiError }
>(
  "webhook/fetchWebhookEndpoint",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPartnerWebhookEndpoint();
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
  {
    // Skip if a request is already in flight (e.g. StrictMode's double effect).
    condition: (_, { getState }) =>
      !(getState() as { webhook: { loading: boolean } }).webhook.loading,
  },
);

export const saveWebhookEndpoint = createAsyncThunk<
  SaveWebhookResult,
  string,
  { rejectValue: RejectedApiError }
>("webhook/saveWebhookEndpoint", async (url, { rejectWithValue }) => {
  try {
    return await savePartnerWebhookEndpoint(url);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

/**
 * Unread total for the header bell. Asks for a single unread item and reads
 * the list's `count`, so the whole list is never downloaded just for a number.
 */
/** A count fetched within this window is reused instead of asking again. */
export const UNREAD_COUNT_MAX_AGE_MS = 5 * 60_000;

export const fetchUnreadNotificationCount = createAsyncThunk<
  number,
  { force?: boolean } | void,
  { rejectValue: RejectedApiError }
>(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const { count } = await fetchPartnerNotifications({
        is_read: false,
        page: 1,
        page_size: 1,
      });
      return count;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
  {
    // Skip if a request is already running (covers StrictMode's double effect),
    // or if the count is still fresh — unless the caller forces a refresh.
    condition: (arg, { getState }) => {
      const { unreadLoading, unreadFetchedAt } = (
        getState() as { notifications: { unreadLoading: boolean; unreadFetchedAt: number | null } }
      ).notifications;
      if (unreadLoading) return false;
      if (arg && arg.force) return true;
      return !unreadFetchedAt || Date.now() - unreadFetchedAt > UNREAD_COUNT_MAX_AGE_MS;
    },
  },
);

///Wallet
export const fetchWalletSummary = createAsyncThunk<
  WalletSummary,
  void,
  { rejectValue: RejectedApiError }
>("wallet/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    return await fetchPartnerWalletSummary();
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const fetchWalletTransactions = createAsyncThunk<
  WalletTransactionsData,
  { page: number; page_size: number },
  { rejectValue: RejectedApiError }
>("wallet/fetchTransactions", async (params, { rejectWithValue }) => {
  try {
    return await fetchPartnerWalletTransactions(params);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const fetchWalletTransaction = createAsyncThunk<
  WalletTransaction,
  string,
  { rejectValue: RejectedApiError }
>("wallet/fetchTransaction", async (transactionId, { rejectWithValue }) => {
  try {
    return await fetchPartnerWalletTransaction(transactionId);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const createWalletTopUp = createAsyncThunk<
  WalletTopUpResult,
  string,
  { rejectValue: RejectedApiError }
>("wallet/createTopUp", async (amount, { rejectWithValue }) => {
  try {
    return await createPartnerWalletTopUp(amount);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

///Activity log
export const fetchActivityLog = createAsyncThunk<
  ActivityLogData,
  ActivityLogParams,
  { rejectValue: RejectedApiError }
>("activityLog/fetch", async (params, { rejectWithValue }) => {
  try {
    return await fetchPartnerActivityLog(params);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

///Members
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/teams/members/");
      return response.data.data as TeamMember[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch team members"
      );
    }
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (payload: AddMemberPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/teams/members/", payload);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: "Failed to add team member" });
    }
  }
);

export const removeMember = createAsyncThunk(
  "members/removeMember",
  async (membershipId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/teams/members/${membershipId}/`);
      return membershipId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to remove member"
      );
    }
  }
);
