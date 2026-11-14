import React, { useState } from "react";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import toast from "react-hot-toast";
import { changePassword } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import AppButton from "../common/AppButton";
import AdminTextField from "../common/TextInput";
import SettingsCard, { SettingsField } from "./SettingsCard";

const FORM_ID = "change-password-form";
const MIN_PASSWORD_LENGTH = 8;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type PasswordField = "current_password" | "new_password" | "confirm_password";
type PasswordValues = Record<PasswordField, string>;
type PasswordErrors = Partial<Record<PasswordField, string>>;

const EMPTY: PasswordValues = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const validate = (values: PasswordValues): PasswordErrors => {
  const errors: PasswordErrors = {};
  if (!values.current_password) {
    errors.current_password = "Enter your current password.";
  }
  if (values.new_password.length < MIN_PASSWORD_LENGTH) {
    errors.new_password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (values.new_password === values.current_password) {
    errors.new_password = "Choose a password different from your current one.";
  }
  if (values.confirm_password !== values.new_password) {
    errors.confirm_password = "Passwords don't match.";
  }
  return errors;
};

function PasswordInput({
  id,
  value,
  onChange,
  error,
  autoComplete,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <AdminTextField
      id={id}
      type={visible ? "text" : "password"}
      placeholder="••••••••"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={Boolean(error)}
      helperText={error}
      autoComplete={autoComplete}
      disabled={disabled}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
                sx={{ color: "var(--text-muted)" }}
              >
                {visible ? (
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
  );
}

export default function AccountSection() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [values, setValues] = useState<PasswordValues>(EMPTY);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [saving, setSaving] = useState(false);

  const name = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((part) => capitalize(String(part)))
    .join(" ");
  const email = (user?.email as string | undefined) || "";

  const setField = (field: PasswordField) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const hasInput = Object.values(values).some(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setSaving(true);
    const result = await dispatch(changePassword(values));
    setSaving(false);

    if (changePassword.fulfilled.match(result)) {
      setValues(EMPTY);
      setErrors({});
      toast.success("Password updated.");
      return;
    }

    const err = result.payload;
    const fieldErrors: PasswordErrors = {};
    (Object.keys(EMPTY) as PasswordField[]).forEach((field) => {
      const message = err?.fieldErrors?.[field]?.[0];
      if (message) fieldErrors[field] = message;
    });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
    } else {
      toast.error(err?.message || "Couldn't update your password.");
    }
  };

  return (
    <SettingsCard title="Account" maxWidth={700}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: 2.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <SettingsField label="Name" htmlFor="settings-name">
          <AdminTextField
            id="settings-name"
            value={name}
            placeholder="Not provided"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </SettingsField>

        <SettingsField label="Email" htmlFor="settings-email">
          <AdminTextField
            id="settings-email"
            value={email}
            placeholder="Not provided"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </SettingsField>
      </Box>

      <Box
        component="form"
        id={FORM_ID}
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3.5, display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Change password</Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", mt: 0.5 }}>
            Enter your current password, then choose a new one of at least{" "}
            {MIN_PASSWORD_LENGTH} characters.
          </Typography>
        </Box>

        <SettingsField label="Current password" htmlFor="settings-current-password">
          <PasswordInput
            id="settings-current-password"
            value={values.current_password}
            onChange={setField("current_password")}
            error={errors.current_password}
            autoComplete="current-password"
            disabled={saving}
          />
        </SettingsField>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "flex-start",
            gap: 2.5,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <SettingsField label="New password" htmlFor="settings-new-password">
            <PasswordInput
              id="settings-new-password"
              value={values.new_password}
              onChange={setField("new_password")}
              error={errors.new_password}
              autoComplete="new-password"
              disabled={saving}
            />
          </SettingsField>

          <SettingsField label="Confirm new password" htmlFor="settings-confirm-password">
            <PasswordInput
              id="settings-confirm-password"
              value={values.confirm_password}
              onChange={setField("confirm_password")}
              error={errors.confirm_password}
              autoComplete="new-password"
              disabled={saving}
            />
          </SettingsField>
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <AppButton
          type="submit"
          form={FORM_ID}
          loading={saving}
          disabled={saving || !hasInput}
          sx={{ px: 3 }}
        >
          Save account
        </AppButton>
      </Box>
    </SettingsCard>
  );
}
