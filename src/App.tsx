import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { darkTheme, lightTheme } from "./theme/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import AdminRolePage from "./pages/AdminRolePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import VendorPage from "./pages/VendorPage";
import WalletPage from "./pages/WalletPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/auth/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import CreateAdminRolePage from "./pages/CreateAdminRole";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuthSession } from "./utils/UseAuthSession";
import ResetPasswordPage from "./pages/auth/ResetPassword";

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
           <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            {/* <Route path="/map" element={<MapPage />} /> */}
            <Route path="/users" element={<UsersPage />} />
            {/* <Route path="/riders" element={<RidersPage />} /> */}

            {/* Payment */}
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Partners */}
            <Route path="/vendor" element={<VendorPage />} />
            {/* <Route path="/partners" element={<PartnersPage />} /> */}
            <Route path="/admin-role" element={<AdminRolePage />} />
            <Route
              path="/admin-role/create"
              element={<CreateAdminRolePage />}
            />

            {/* Settings */}
            <Route path="/notification" element={<NotificationsPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  useAuthSession();
  return (
    <ThemeModeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: "1px solid #010e14",
            padding: "8px",
            color: "#010e14",
            fontSize: "14px",
          },
        }}
      />
      <ThemedApp />
    </ThemeModeProvider>
  );
}
