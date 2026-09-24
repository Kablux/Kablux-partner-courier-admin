import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getStoredAccessToken,
  getStoredUser,
  setStoredAuthData,
  clearStoredTokens,
  hasStoredSession,
} from "../../api/axios";
import { PartnerUser, PartnerLoginResponse } from "../../types/auth.types";
import {
  loginPartner,
  extractTokens,
  extractUser,
  forgotPassword,
  resetPassword,
} from "../../api/xhrHelper";

interface AuthState {
  user: PartnerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
}

const initialToken = getStoredAccessToken();
const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  // Session survives a reload as long as a usable token pair is in storage.
  // The user object is optional — the login response may not return one.
  isAuthenticated: hasStoredSession(),
  loading: false,
  error: null,
  fieldErrors: null,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
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
    // Fired by the `auth:unauthorized` listener when refresh fails.
    sessionExpired: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.fieldErrors = null;
      state.error = "Your session has expired. Please sign in again.";

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
    resetResetPasswordState: (state) => {
      state.resetPasswordSuccess = false;
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
          // User lives at data.user in the partner API response.
          const user = extractUser(action.payload) ?? state.user;

          state.loading = false;
          state.token = accessToken || state.token;
          state.user = user;
          state.isAuthenticated = Boolean(state.token);
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
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordSuccess = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.fieldErrors = action.payload.fieldErrors || null;
        } else {
          state.error = "Failed to reset password.";
        }
      });
  },
});

export const {
  logout,
  sessionExpired,
  clearAuthErrors,
  resetForgotPasswordState,
  resetResetPasswordState,
} = authSlice.actions;
export default authSlice.reducer;