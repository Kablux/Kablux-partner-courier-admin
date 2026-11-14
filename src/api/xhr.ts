import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse, ResetPasswordPayload, ResetPasswordResponse } from "../types/auth.types";
import {
  ApiEnvelope,
  WalletSummary,
  WalletTopUpResult,
  WalletTransaction,
  WalletTransactionsData,
  ActivityLogData,
  ActivityLogParams,
  ActivityLogResponse,
  ApiKey,
  ApiKeysResponse,
  CreateApiKeyResponse,
  CreatedApiKey,
  NotificationsListData,
  NotificationsQueryParams,
  NotificationsResponse,
  OrderDetail,
  OrderDetailResponse,
  OrderListItem,
  OrdersListData,
  OrdersResponse,
  SaveWebhookResult,
  WebhookEndpoint,
  WebhookEndpointPayload,
  WebhookEndpointResponse,
} from "../types/index.types";

 
export const partnerLogin = async (
  payload: PartnerLoginPayload,
): Promise<PartnerLoginResponse> => {
  const { data } = await api.post<PartnerLoginResponse>(
    "/auth/partner/login/",
    payload,
  );
  return data;
};
 
/**
 * Invalidates the access and refresh tokens on the server. With
 * `all_devices: true` every session for this user is signed out.
 * Has a short timeout so a slow network never blocks signing out.
 */
export const partnerLogout = async (payload: {
  refresh_token: string;
  all_devices: boolean;
  fcm_token: string;
}): Promise<void> => {
  await api.post("/auth/logout/", payload, { timeout: 8000 });
};

export const partnerForgotPassword = async (email: string) => {
  const { data } = await api.post("/auth/partner/forgot-password/", { email });
  return data;
};
 
 
 export const partnerResetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    "/auth/reset-password/",
    payload
  );
  return response.data;
};
 
export const fetchPartnerNotifications = async (
  params: NotificationsQueryParams
): Promise<NotificationsListData> => {
  const { data } = await api.get<NotificationsResponse>("/teams/notifications/", {
    params,
  });
 
  if (!data?.data) {
    throw new Error("Notifications response was missing its data payload.");
  }
 
  return data.data;
};

/** OWNER only: anyone else gets a 403. */
export const fetchPartnerApiKeys = async (): Promise<ApiKey[]> => {
  const { data } = await api.get<ApiKeysResponse>("/teams/api-keys/");

  if (!Array.isArray(data?.data)) {
    throw new Error("API keys response was in an unexpected format.");
  }

  return data.data;
};

/** OWNER only. The full key is in the response once and can't be fetched again. */
export const createPartnerApiKey = async (
  name: string,
): Promise<CreatedApiKey> => {
  const { data } = await api.post<CreateApiKeyResponse>("/teams/api-keys/", {
    name,
  });

  if (!data?.data?.key) {
    throw new Error("The new API key was missing from the response.");
  }

  return data.data;
};

/**
 * OWNER only. Revoking can't be undone; revoking an already revoked key is a
 * no-op on the server. Resolves to the updated key (no secret is returned).
 */
export const revokePartnerApiKey = async (keyId: string): Promise<ApiKey> => {
  const { data } = await api.post<ApiEnvelope<ApiKey>>(
    `/teams/api-keys/${keyId}/revoke/`,
  );

  if (!data?.data?.id) {
    throw new Error("The revoked key was missing from the response.");
  }

  return data.data;
};

/** Owner or member. Requires the current password. */
export const changePartnerPassword = async (payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<void> => {
  await api.post("/teams/change-password/", payload);
};

/** Keeps only what the panel needs, so the signing secret never reaches app state. */
const toWebhookEndpoint = ({
  endpoint_id,
  url,
  enabled,
}: WebhookEndpointPayload): WebhookEndpoint => ({ endpoint_id, url, enabled });

/** OWNER only: anyone else gets a 403. Resolves to null when no receiver is set. */
export const fetchPartnerWebhookEndpoint =
  async (): Promise<WebhookEndpoint | null> => {
    const { data } = await api.get<WebhookEndpointResponse>(
      "/teams/webhook-endpoint/",
    );

    if (!data || data.data === undefined) {
      throw new Error("Webhook response was in an unexpected format.");
    }

    return data.data ? toWebhookEndpoint(data.data) : null;
  };

/** OWNER only. Creates or replaces the receiver URL. */
export const savePartnerWebhookEndpoint = async (
  url: string,
): Promise<SaveWebhookResult> => {
  const { data } = await api.put<WebhookEndpointResponse>(
    "/teams/webhook-endpoint/",
    { url },
  );

  if (!data?.data) {
    throw new Error("Webhook response was missing its data payload.");
  }

  return {
    endpoint: toWebhookEndpoint(data.data),
    secret: data.data.webhook_secret || null,
  };
};

/** Organization wallet balance and amount spent. Members get a 403. */
export const fetchPartnerWalletSummary = async (): Promise<WalletSummary> => {
  const { data } = await api.get<ApiEnvelope<WalletSummary>>("/teams/wallet/summary/");
  if (!data?.data) throw new Error("Wallet summary was missing from the response.");
  return data.data;
};

/** Paginated on the server. */
export const fetchPartnerWalletTransactions = async (params: {
  page: number;
  page_size: number;
}): Promise<WalletTransactionsData> => {
  const { data } = await api.get<ApiEnvelope<WalletTransactionsData>>(
    "/teams/wallet/transactions/",
    { params },
  );
  if (!Array.isArray(data?.data?.results)) {
    throw new Error("Wallet transactions response was in an unexpected format.");
  }
  return data.data;
};

/** The latest few transactions (same shape as the list), for the dashboard. */
export const fetchPartnerRecentWalletTransactions = async (): Promise<WalletTransaction[]> => {
  const { data } = await api.get<ApiEnvelope<{ results: WalletTransaction[] }>>(
    "/teams/wallet/transactions/recent/",
  );
  if (!Array.isArray(data?.data?.results)) {
    throw new Error("Recent transactions response was in an unexpected format.");
  }
  return data.data.results;
};

export const fetchPartnerWalletTransaction = async (
  transactionId: string,
): Promise<WalletTransaction> => {
  const { data } = await api.get<ApiEnvelope<WalletTransaction>>(
    `/teams/wallet/transactions/${transactionId}/`,
  );
  if (!data?.data) throw new Error("Transaction was missing from the response.");
  return data.data;
};

/**
 * Starts a Paystack top-up (owner only). `amount` is a decimal string such as
 * "5000.00". The wallet is only credited after Paystack confirms the payment.
 */
export const createPartnerWalletTopUp = async (
  amount: string,
): Promise<WalletTopUpResult> => {
  const { data } = await api.post<ApiEnvelope<WalletTopUpResult>>(
    "/teams/wallet/topups/",
    { amount },
  );
  if (!data?.data?.authorization_url) {
    throw new Error("The payment link was missing from the response.");
  }
  return data.data;
};

/** OWNER only: anyone else gets a 403. Paginated and filtered on the server. */
export const fetchPartnerActivityLog = async (
  params: ActivityLogParams,
): Promise<ActivityLogData> => {
  // Drop empty filters so the server only sees the ones in use.
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  );
  const { data } = await api.get<ActivityLogResponse>("/teams/activities/", {
    params: query,
  });

  if (!Array.isArray(data?.data?.results)) {
    throw new Error("Activity log response was in an unexpected format.");
  }

  return data.data;
};

const ORDERS_PAGE_SIZE = 100;

/**
 * Loads every page, because the status tabs and overview cards are worked out
 * in the browser and there is no documented status filter or count endpoint.
 * It stops early if a page adds nothing new, so a backend that ignores `page`
 * can't cause an endless loop.
 */
export const fetchPartnerOrders = async (): Promise<OrdersListData> => {
  const ordersById = new Map<string, OrderListItem>();
  let count = 0;
  let page = 1;

  while (true) {
    const { data } = await api.get<OrdersResponse>("/teams/rides/", {
      params: { page, page_size: ORDERS_PAGE_SIZE },
    });
    const pageData = data?.data;

    if (!Array.isArray(pageData?.results)) {
      throw new Error("Orders response was in an unexpected format.");
    }

    const loadedBefore = ordersById.size;
    pageData.results.forEach((order) => ordersById.set(order.id, order));
    count = pageData.count;

    if (ordersById.size >= count || ordersById.size === loadedBefore) break;
    page += 1;
  }

  return { results: [...ordersById.values()], count };
};

export const fetchPartnerOrderDetail = async (
  orderId: string,
): Promise<OrderDetail> => {
  const { data } = await api.get<OrderDetailResponse>(
    `/teams/rides/${orderId}/`,
  );

  if (!data?.data) {
    throw new Error("Order response was missing its data payload.");
  }

  return data.data;
};


 