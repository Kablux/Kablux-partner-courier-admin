import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNotifications, fetchUnreadNotificationCount } from "../../api/xhrHelper";
import { NotificationItem, NotificationReadFilter } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";


interface NotificationsState {
  results: NotificationItem[];
  count: number;
  page: number;
  pageSize: number;
  filter: NotificationReadFilter;
  loading: boolean;
  error: string | null;
  /** Total unread, for the header bell. Null until first loaded. */
  unreadCount: number | null;
}

const initialState: NotificationsState = {
  results: [],
  count: 0,
  page: 1,
  pageSize: 10,
  filter: "all",
  loading: false,
  error: null,
  unreadCount: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsFilter: (state, action: PayloadAction<NotificationReadFilter>) => {
      state.filter = action.payload;
      state.page = 1; // reset to first page whenever the filter changes
    },
    setNotificationsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setNotificationsPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Notifications belong to one account; never show them to the next.
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // On failure the bell keeps its last known number.

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.count = action.payload.count;
        state.page = action.payload.page;
        state.pageSize = action.payload.page_size;
        // The Unread filter's total is the same number the bell shows.
        if (action.meta.arg.is_read === false) {
          state.unreadCount = action.payload.count;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load notifications.";
      });
  },
});

export const { setNotificationsFilter, setNotificationsPage, setNotificationsPageSize } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;