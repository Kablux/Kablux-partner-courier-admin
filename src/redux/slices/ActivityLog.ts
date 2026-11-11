import { createSlice } from "@reduxjs/toolkit";
import { fetchActivityLog } from "../../api/xhrHelper";
import { ActivityLogEntry } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";

/** OWNER only: 200 means allowed, 403 means denied. Asked only on the page. */
export type ActivityLogAccess = "unknown" | "allowed" | "denied";

interface ActivityLogState {
  entries: ActivityLogEntry[];
  /** Total across all pages, from the server. */
  count: number;
  access: ActivityLogAccess;
  loading: boolean;
  error: string | null;
  /** Only the latest request may update the list (filters/pages can change fast). */
  latestRequestId: string | null;
}

const initialState: ActivityLogState = {
  entries: [],
  count: 0,
  access: "unknown",
  loading: false,
  error: null,
  latestRequestId: null,
};

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // The activity log belongs to one organization; never show it to the next account.
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      .addCase(fetchActivityLog.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.loading = false;
        state.access = "allowed";
        state.entries = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.loading = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.entries = [];
          state.count = 0;
          return;
        }
        const fieldErrors = action.payload?.fieldErrors;
        const firstFieldError = fieldErrors
          ? Object.entries(fieldErrors).map(([field, msgs]) => `${field}: ${msgs[0]}`)[0]
          : undefined;
        state.error =
          firstFieldError || action.payload?.message || "Failed to load the activity log.";
      });
  },
});

export default activityLogSlice.reducer;
