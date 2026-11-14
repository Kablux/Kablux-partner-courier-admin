import { createSlice } from "@reduxjs/toolkit";
import { createApiKey, fetchApiKeys, revokeApiKey } from "../../api/xhrHelper";
import { ApiKey } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";

/**
 * The API keys endpoint is OWNER only, so its answer decides what the page
 * shows: 200 means allowed, 403 means denied. It's only asked when the
 * API Keys page is opened.
 */
export type ApiKeysAccess = "unknown" | "allowed" | "denied";

interface ApiKeysState {
  /** Metadata only. The secret from a create is never stored here. */
  keys: ApiKey[];
  access: ApiKeysAccess;
  loading: boolean;
  error: string | null;
  creating: boolean;
  /** Id of the key being revoked, if any. */
  revokingId: string | null;
}

const initialState: ApiKeysState = {
  keys: [],
  access: "unknown",
  loading: false,
  error: null,
  creating: false,
  revokingId: null,
};

const apiKeysSlice = createSlice({
  name: "apiKeys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      // List
      .addCase(fetchApiKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.access = "allowed";
        state.keys = action.payload;
      })
      .addCase(fetchApiKeys.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.keys = [];
          return;
        }
        state.error = action.payload?.message || "Failed to load API keys.";
      })

      // Create
      .addCase(createApiKey.pending, (state) => {
        state.creating = true;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.creating = false;
        // Drop the secret: only the dialog that asked for it may show it.
        const { key: _secret, ...metadata } = action.payload;
        state.keys.unshift(metadata);
      })
      .addCase(createApiKey.rejected, (state, action) => {
        state.creating = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.keys = [];
        }
      })

      // Revoke
      .addCase(revokeApiKey.pending, (state, action) => {
        state.revokingId = action.meta.arg;
      })
      .addCase(revokeApiKey.fulfilled, (state, action) => {
        state.revokingId = null;
        const index = state.keys.findIndex((k) => k.id === action.payload.id);
        if (index !== -1) state.keys[index] = action.payload;
      })
      .addCase(revokeApiKey.rejected, (state, action) => {
        state.revokingId = null;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.keys = [];
        }
      });
  },
});

export default apiKeysSlice.reducer;
