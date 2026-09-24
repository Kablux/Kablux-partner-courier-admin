import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PinOutlinedIcon from "@mui/icons-material/PinOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useThemeMode } from "../../theme/ThemeContext";
import AppButton from "../../components/common/AppButton";
import AdminTextField from "../../components/common/TextInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { resetPassword } from "../../api/xhrHelper";
import { resetResetPasswordState, clearAuthErrors } from "../../redux/slices/Auth";

type FormValues = {
  code: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const MIN_PASSWORD_LENGTH = 8;

function getPasswordChecks(password: string) {
  return {
    length: password.length >= MIN_PASSWORD_LENGTH,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

const ResetPasswordPage = () => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Passed forward from ForgotPasswordPage for display only — the reset
  // endpoint itself only takes reset_token / new_password / confirm_password.
  const emailHint = (location.state as { email?: string } | null)?.email;

  const { loading: isSubmitting, error: apiError } = useAppSelector((s) => s.auth);

  const [values, setValues] = useState<FormValues>({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const checks = useMemo(() => getPasswordChecks(values.password), [values.password]);
  const passwordValid =
    checks.length && checks.upper && checks.lower && checks.number && checks.special;

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (apiError) dispatch(clearAuthErrors());
    };

    const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!values.code.trim()) next.code = "Enter the reset code from your email";

    if (!values.password) next.password = "New password is required";
    else if (!passwordValid)
      next.password = "Password doesn't meet the requirements below";

    if (!values.confirmPassword) next.confirmPassword = "Confirm your new password";
    else if (values.confirmPassword !== values.password)
      next.confirmPassword = "Passwords don't match";

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
      resetPassword({
        reset_token: values.code.trim(),
        new_password: values.password,
        confirm_password: values.confirmPassword,
      })
    );

    if (resetPassword.fulfilled.match(resultAction)) {
      setDone(true);
      const message =
        (resultAction.payload as { message?: string })?.message ||
        "Your password has been reset.";
      toast.success(message);
    } else if (resetPassword.rejected.match(resultAction)) {
      const errorMessage = resultAction.payload?.message || "Could not reset password";
      toast.error(errorMessage);
    }
  };

  const handleKeyDownNavigate = (e: React.KeyboardEvent, path: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(path);
    }
  };

  const goToLogin = () => {
    dispatch(resetResetPasswordState());
    navigate("/login", { replace: true });
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
              Help &amp; Support
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
          <Box sx={{ position: "absolute", left: "10%", top: "45%", opacity: 0.1 }}>
            <LightModeOutlinedIcon sx={{ fontSize: 100, color: "var(--accent-gold)" }} />
          </Box>
          <Box sx={{ position: "absolute", right: "10%", bottom: "20%", opacity: 0.1 }}>
            <LightModeOutlinedIcon sx={{ fontSize: 100, color: "var(--accent-gold)" }} />
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
                {done ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 28, color: "#000" }} />
                ) : (
                  <LockOutlinedIcon sx={{ fontSize: 26, color: "#000" }} />
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
                {done ? "Password reset" : "Set a new password"}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  mt: 1,
                  textAlign: "center",
                  maxWidth: 360,
                }}
              >
                {done
                  ? "Your password has been updated. Use it to sign back in."
                  : emailHint
                  ? `Enter the code sent to ${emailHint} along with your new password.`
                  : "Enter the reset code from your email along with your new password."}
              </Typography>
            </Box>

            {done ? (
              /* --- Success State --- */
              <Box className="flex flex-col gap-3">
                <AppButton fullWidth onClick={goToLogin}>
                  Continue to login
                </AppButton>
              </Box>
            ) : (
              /* --- Form State --- */
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                <AdminTextField
                  label="Reset Code"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={values.code}
                  onChange={handleChange("code")}
                  error={Boolean(errors.code)}
                  helperText={errors.code}
                  disabled={isSubmitting}
                  fullWidth
                  autoComplete="off"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinOutlinedIcon
                            sx={{ fontSize: 18, color: "var(--text-muted)" }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Box>
                  <AdminTextField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange("password")}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    disabled={isSubmitting}
                    fullWidth
                    autoComplete="new-password"
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

                  {/* Strength meter + live checklist */}
                  {values.password.length > 0 && (
                    <Box sx={{ mt: 1.25 }}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          ([
                            checks.length,
                            checks.upper,
                            checks.lower,
                            checks.number,
                            checks.special,
                          ].filter(Boolean).length /
                            5) *
                          100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: "var(--border-subtle)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            backgroundColor: passwordValid
                              ? "#2e7d32"
                              : "var(--accent-gold)",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mt: 1,
                        }}
                      >
                        {[
                          { key: "length", label: `${MIN_PASSWORD_LENGTH}+ characters` },
                          { key: "upper", label: "One uppercase letter" },
                          { key: "lower", label: "One lowercase letter" },
                          { key: "special", label: "One special character" },
                          { key: "number", label: "One number" },
                        ].map((rule) => {
                          const ok = (checks as Record<string, boolean>)[rule.key];
                          return (
                            <Box
                              key={rule.key}
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                            >
                              {ok ? (
                                <CheckCircleOutlineRoundedIcon
                                  sx={{ fontSize: 14, color: "#2e7d32" }}
                                />
                              ) : (
                                <RadioButtonUncheckedRoundedIcon
                                  sx={{ fontSize: 14, color: "var(--text-muted)" }}
                                />
                              )}
                              <Typography
                                sx={{
                                  fontSize: 11.5,
                                  color: ok ? "#2e7d32" : "var(--text-muted)",
                                }}
                              >
                                {rule.label}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>

                <AdminTextField
                  label="Confirm New Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  disabled={isSubmitting}
                  fullWidth
                  autoComplete="new-password"
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
                            onClick={() => setShowConfirm((s) => !s)}
                            edge="end"
                            sx={{ color: "var(--text-muted)" }}
                          >
                            {showConfirm ? (
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

                <AppButton fullWidth type="submit" loading={isSubmitting} sx={{ mt: 1 }}>
                  Reset password
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
                  <ArrowBackRoundedIcon sx={{ fontSize: 16, color: "var(--text-muted)" }} />
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

export default ResetPasswordPage;