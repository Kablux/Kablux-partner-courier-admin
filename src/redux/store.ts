import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";
import notificationsReducer from "./slices/Notifications";
import membersReducer from "./slices/Member";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
    members: membersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
