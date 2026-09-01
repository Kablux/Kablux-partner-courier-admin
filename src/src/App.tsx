import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { darkTheme, lightTheme } from "./theme/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ToastContainer } from "react-toastify";
import OnboardingFlow from "./pages/Onboarding";

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<OnboardingFlow />} />
          <Route path="/" element={<DashboardLayout />} />
          
          {/* You can add more routes here later, e.g.: */}
          {/* <Route path="/login" element={<Login />} /> */}
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
