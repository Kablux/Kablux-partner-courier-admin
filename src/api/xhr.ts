import api from "./axios";
import { PartnerLoginPayload, PartnerLoginResponse } from "../types/auth.types";


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