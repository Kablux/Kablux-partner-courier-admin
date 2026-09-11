import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStoredAccessToken, clearStoredTokens } from "../../api/axios";
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

const initialState: AuthState = {
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
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
    },
  },
  extraReducers: (builder) => {
    builder
      // ==========================================
      // LOGIN PARTNER
      // ==========================================
      .addCase(loginPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(
        loginPartner.fulfilled,
        (state, action: PayloadAction<PartnerLoginResponse>) => {
          const { accessToken } = extractTokens(action.payload);
          
          state.loading = false;
          state.token = accessToken || state.token;
          state.user = action.payload.user || null;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(loginPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed. Please try again.";
      })

      // ==========================================
      // FORGOT PASSWORD
      // ==========================================
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordSuccess = false;
        state.error = action.payload || "Failed to process forgot password request.";
      });
  },
});

export const { logout, clearAuthErrors, resetForgotPasswordState } = authSlice.actions;
export default authSlice.reducer;