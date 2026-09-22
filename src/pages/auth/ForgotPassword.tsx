import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useThemeMode } from "../../theme/ThemeContext";
import AppButton from "../../components/common/AppButton";
import AdminTextField from "../../components/common/TextInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { forgotPassword } from "../../api/xhrHelper";
import {
  resetForgotPasswordState,
  clearAuthErrors,
} from "../../redux/slices/Auth";

const ForgotPasswordPage = () => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading: isSubmitting, error: apiError } = useAppSelector(
    (s) => s.auth,
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordState());
    };
  }, [dispatch]);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email address";
    return undefined;
  };

  const submit = async (isResend = false) => {
    const result = await dispatch(forgotPassword(email.trim()));

    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);

      const backendMessage =
        (result.payload as { message?: string; detail?: string })?.message ||
        (result.payload as { message?: string; detail?: string })?.detail;

      const fallbackMessage = isResend
        ? "A new reset code has been sent"
        : "A Reset code has been sent to your email.";

      toast.success(backendMessage || fallbackMessage);
    } else {
      const errorMessage =
        typeof result.payload === "string"
          ? result.payload
          : result.payload?.message || "Could not send reset code";

      toast.error(errorMessage);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(undefined);
    await submit(false);
  };

  const handleKeyDownNavigate = (e: React.KeyboardEvent, path: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(path);
    }
  };

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

          {/* Central Card */}
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
                {sent ? (
                  <MarkEmailReadRoundedIcon
                    sx={{ fontSize: 28, color: "#000" }}
                  />
                ) : (
                  <Typography
                    sx={{ fontSize: 22, fontWeight: 800, color: "#000" }}
                  >
                    K
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textAlign: "center",
                }}
              >
                {sent ? "Check your email" : "Forgot password?"}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  mt: 1,
                  textAlign: "center",
                  maxWidth: 340,
                }}
              >
                {sent
                  ? `We've sent a reset code to ${email}. Enter it on the next screen to set a new password.`
                  : "Enter the email linked to your partner account and we'll send you a reset code."}
              </Typography>
            </Box>

            {sent ? (
              /* --- Success State --- */
              <Box className="flex flex-col gap-4">
                {/* Resend Code */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography
                    role="button"
                    tabIndex={0}
                    onClick={() => !isSubmitting && submit(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!isSubmitting) submit(true);
                      }
                    }}
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--text-primary)",
                      cursor: isSubmitting ? "default" : "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                      opacity: isSubmitting ? 0.6 : 1,
                      transition: "opacity 0.2s ease",
                      "&:hover": {
                        opacity: isSubmitting ? 0.6 : 0.8,
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} sx={{ color: "inherit" }} />
                    ) : (
                      "Resend code"
                    )}
                  </Typography>
                </Box>

                {/* Enter Reset Code */}
                <AppButton
                  fullWidth
                  onClick={() => {
                    // Pass email in location state to prepopulate reset password form
                    navigate("/reset-password", { state: { email } });
                  }}
                >
                  Enter reset code
                </AppButton>

                {/* Back to Login */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <ArrowBackRoundedIcon
                    sx={{ fontSize: 16, color: "var(--text-muted)" }}
                  />
                  <Typography
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/login")}
                    onKeyDown={(e) => handleKeyDownNavigate(e, "/login")}
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      "&:hover": { color: "var(--accent-gold)" },
                    }}
                  >
                    Back to login
                  </Typography>
                </Box>
              </Box>
            ) : (
              /* --- Form Request State --- */
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(undefined);
                    if (apiError) dispatch(clearAuthErrors());
                  }}
                  error={Boolean(error)}
                  helperText={error}
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

                <AppButton
                  fullWidth
                  type="submit"
                  loading={isSubmitting}
                  sx={{ mt: 1 }}
                >
                  Send reset code
                </AppButton>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <ArrowBackRoundedIcon
                    sx={{ fontSize: 16, color: "var(--text-muted)" }}
                  />
                  <Typography
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/login")}
                    onKeyDown={(e) => handleKeyDownNavigate(e, "/login")}
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      "&:hover": { color: "var(--accent-gold)" },
                    }}
                  >
                    Back to login
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
