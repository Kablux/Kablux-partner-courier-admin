import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { darkTheme, lightTheme } from "./theme/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ToastContainer } from "react-toastify";
import DashboardPage from "./pages/DashboardPage";
import AdminRolePage from "./pages/AdminRolePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MapPage from "./pages/MapPage";
import NotificationsPage from "./pages/NotificationsPage";
import PartnersPage from "./pages/PartnersPage";
import SettingsPage from "./pages/SettingsPage";
import VendorPage from "./pages/VendorPage";
import WalletPage from "./pages/WalletPage";
import UsersPage from "./pages/UsersPage";
import RidersPage from "./pages/RidersPage";
import LoginPage from "./pages/auth/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ApiKeysPage from "./pages/ApiKeysPage";

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<DashboardLayout />}>
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
  return (
    <ThemeModeProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        // theme="dark"
      />

      <ThemedApp />
    </ThemeModeProvider>
  );
}
