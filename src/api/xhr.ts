import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse, ResetPasswordPayload, ResetPasswordResponse } from "../types/auth.types";
import {
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


 