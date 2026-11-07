import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse, ResetPasswordPayload, ResetPasswordResponse } from "../types/auth.types";
import {
  NotificationsListData,
  NotificationsQueryParams,
  NotificationsResponse,
  OrderDetail,
  OrderDetailResponse,
  OrderListItem,
  OrdersListData,
  OrdersResponse,
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


 