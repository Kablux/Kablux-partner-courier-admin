import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getStoredAccessToken,
  getStoredUser,
  setStoredAuthData,
  clearStoredTokens,
} from "../../api/axios";
import { PartnerUser, PartnerLoginResponse } from "../../types/auth.types";
import { loginPartner, extractTokens, forgotPassword } from "../../api/xhrHelper";

interface AuthState {
  user: PartnerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  forgotPasswordSuccess: boolean;
}

const initialToken = getStoredAccessToken();
const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  loading: false,
  error: null,
  fieldErrors: null,
  forgotPasswordSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.fieldErrors = null;
      state.forgotPasswordSuccess = false;

      clearStoredTokens();
    },
    clearAuthErrors: (state) => {
      state.error = null;
      state.fieldErrors = null;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordSuccess = false;
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN PARTNER
      .addCase(loginPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(
        loginPartner.fulfilled,
        (state, action: PayloadAction<PartnerLoginResponse>) => {
          const { accessToken, refreshToken } = extractTokens(action.payload);
          const user = action.payload.user || null;

          state.loading = false;
          state.token = accessToken || state.token;
          state.user = user;
          state.isAuthenticated = true;
          state.error = null;
          state.fieldErrors = null;

          setStoredAuthData(accessToken, refreshToken, user);
        }
      )
      .addCase(loginPartner.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fieldErrors || null;
        } else {
          state.error = "Login failed. Please try again.";
        }
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordSuccess = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fieldErrors || null;
        } else {
          state.error = "Failed to process forgot password request.";
        }
      });
  },
});

export const { logout, clearAuthErrors, resetForgotPasswordState } = authSlice.actions;
export default authSlice.reducer;