import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse, ResetPasswordPayload, ResetPasswordResponse } from "../types/auth.types";
import { NotificationsListData, NotificationsQueryParams, NotificationsResponse } from "../types/index.types";

 
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