import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse, ResetPasswordPayload, ResetPasswordResponse } from "../types/auth.types";

 
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