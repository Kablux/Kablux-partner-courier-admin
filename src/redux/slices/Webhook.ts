import { createSlice } from "@reduxjs/toolkit";
import { fetchWebhookEndpoint, saveWebhookEndpoint } from "../../api/xhrHelper";
import { WebhookEndpoint } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";

/**
 * The webhook endpoint is OWNER only, so its answer decides what the Settings
 * page shows: 200 means allowed, 403 means denied. It's only asked when the
 * Settings page is opened.
 */
export type SettingsAccess = "unknown" | "allowed" | "denied";

interface WebhookState {
  /** Null when no receiver is set. The signing secret is never stored here. */
  endpoint: WebhookEndpoint | null;
  access: SettingsAccess;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

const initialState: WebhookState = {
  endpoint: null,
  access: "unknown",
  loading: false,
  error: null,
  saving: false,
};

const webhookSlice = createSlice({
  name: "webhook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      .addCase(fetchWebhookEndpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebhookEndpoint.fulfilled, (state, action) => {
        state.loading = false;
        state.access = "allowed";
        state.endpoint = action.payload;
      })
      .addCase(fetchWebhookEndpoint.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.endpoint = null;
          return;
        }
        state.error =
          action.payload?.message || "Failed to load webhook settings.";
      })

      .addCase(saveWebhookEndpoint.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveWebhookEndpoint.fulfilled, (state, action) => {
        state.saving = false;
        // Only the endpoint is kept; the one-time secret stays with the caller.
        state.endpoint = action.payload.endpoint;
      })
      .addCase(saveWebhookEndpoint.rejected, (state, action) => {
        state.saving = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.endpoint = null;
        }
      });
  },
});

export default webhookSlice.reducer;
