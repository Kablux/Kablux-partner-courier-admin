import { DeviceType } from "../types/auth.types";

const DEVICE_ID_KEY = "partner_device_id";

export const getDeviceInfo = (): {
  device_id: string;
  device_type: DeviceType;
  fcm_token: string;
} => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return {
    device_id: deviceId,
    device_type: "WEB",
    fcm_token: "",
  };
};