import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useThemeMode } from "../../theme/ThemeContext";
import AppButton from "../../components/common/AppButton";
import AdminTextField from "../../components/common/TextInput";
import { loginPartner } from "../../api/xhrHelper";
import { clearAuthErrors } from "../../redux/slices/Auth";
import { AppDispatch, RootState } from "../../redux/store";

type FormValues = { email: string; password: string };
type FormErrors = { email?: string; password?: string };

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  // Pull global auth state from Redux
  const {
    loading: isSubmitting,
    error: apiError,
    fieldErrors,
  } = useSelector((state: RootState) => state.auth);

  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));

      // Clear global backend errors as soon as the user starts typing again
      if (apiError || fieldErrors) {
        dispatch(clearAuthErrors());
      }
    };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!values.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Enter a valid email address";

    if (!values.password) next.password = "Password is required";
    else if (values.password.length < 6)
      next.password = "Password must be at least 6 characters";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate();

    if (Object.keys(found).length > 0) {
      setErrors(found);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    const resultAction = await dispatch(
      loginPartner({ email: values.email, password: values.password }),
    );

    // Handle Success
    if (loginPartner.fulfilled.match(resultAction)) {
      const successMessage =
        (resultAction.payload as { message?: string })?.message ||
        "Login successful! ";
      toast.success(`${successMessage}👋🏻Welcome!`);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    // Handle Error
    else if (loginPartner.rejected.match(resultAction)) {
      const errorMessage =
        resultAction.payload?.message || "Login failed. Please try again.";

      toast.error(errorMessage);
    }
  };
  const emailFieldError = errors.email || fieldErrors?.email?.[0];
  const passwordFieldError = errors.password || fieldErrors?.password?.[0];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        alignItems: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box className="maxContainer w-full flex flex-col items-center text-white">
        {/* --- Top Navigation Bar --- */}
        <Box
          component="header"
          sx={{
            height: 64,
            backgroundColor: "#0A1929",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            m: 4,
            borderRadius: 2,
            width: "85%",
          }}
        >
          <h4 className="poppins text-lg font-semibold ">
            Kablux{" "}
            <Box component="span" sx={{ fontWeight: 400 }}>
              Partners
            </Box>
          </h4>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, ml: 8 }}>
            <p className="poppins cursor-pointer text-sm hidden sm:block">
              Terms and Conditions
            </p>
            <p className="poppins cursor-pointer text-sm hidden sm:block">
              Help & Support
            </p>
          </Box>
          <Box>
            <IconButton onClick={toggleMode} sx={{ color: "#FFF" }}>
              {isDark ? (
                <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Box>
        </Box>

        {/* --- Main Content Area --- */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          {/* Background Sunburst Decorators */}
          <Box
            sx={{ position: "absolute", left: "10%", top: "45%", opacity: 0.1 }}
          >
            <LightModeOutlinedIcon
              sx={{ fontSize: 100, color: "var(--accent-gold)" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: "10%",
              bottom: "20%",
              opacity: 0.1,
            }}
          >
            <LightModeOutlinedIcon
              sx={{ fontSize: 100, color: "var(--accent-gold)" }}
            />
          </Box>

          {/* Central Form Card */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 3,
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-card)",
              p: { xs: 4, md: 5 },
              zIndex: 10,
              boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
            }}
          >
            {/* Logo + heading */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  backgroundColor: "var(--accent-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ fontSize: 22, fontWeight: 800, color: "#000" }}
                >
                  K
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Kablux
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  mt: 1,
                  textAlign: "center",
                }}
              >
                Partner Administration Portal
              </Typography>

              <Typography
                className="text-center"
                sx={{ fontSize: 14, color: "var(--text-muted)", mt: 1 }}
              >
                Sign in to access the super administrator dashboard.
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              <AdminTextField
                label="Administrative Email"
                type="email"
                placeholder="admin@kablux.com"
                value={values.email}
                onChange={handleChange("email")}
                error={Boolean(emailFieldError)}
                helperText={emailFieldError}
                disabled={isSubmitting}
                fullWidth
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon
                          sx={{ fontSize: 18, color: "var(--text-muted)" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <AdminTextField
                label="Secure Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange("password")}
                error={Boolean(passwordFieldError)}
                helperText={passwordFieldError}
                disabled={isSubmitting}
                fullWidth
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{ fontSize: 18, color: "var(--text-muted)" }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                          sx={{ color: "var(--text-muted)" }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Forgot password */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                <Typography
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate("/forgot-password")}
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--accent-gold)",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <AppButton
                fullWidth
                type="submit"
                loading={isSubmitting}
                sx={{ mt: 1 }}
              >
                Sign In
              </AppButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
