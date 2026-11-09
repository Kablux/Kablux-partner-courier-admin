import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";
import notificationsReducer from "./slices/Notifications";
import membersReducer from "./slices/Member";
import ordersReducer from "./slices/Orders";
import apiKeysReducer from "./slices/ApiKeys";
import webhookReducer from "./slices/Webhook";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
    members: membersReducer,
    orders: ordersReducer,
    apiKeys: apiKeysReducer,
    webhook: webhookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
