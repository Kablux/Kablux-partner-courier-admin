import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/Auth";
// import dashboardReducer from "./slices/Dashboard";
import onboardingReducer from "./slices/Onboarding";


export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // dashboard: dashboardReducer,
    onboarding: onboardingReducer,
   
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
