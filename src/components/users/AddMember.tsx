import React from "react";
import { Box, IconButton, InputAdornment, MenuItem } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { AddMemberPayload } from "../../types/index.types";
import AppButton from "../common/AppButton";
import AppModal from "../common/AppModal";
import AdminTextField from "../common/TextInput";

const FORM_ID = "add-member-form";

interface AddMemberDialogProps {
  open: boolean;
  formData: AddMemberPayload;
  formErrors: Record<string, string> | Record<string, string[]> | null;
  submitting: boolean;
  showPassword: boolean;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
}

const getErrorMessage = (err?: string | string[]) =>
  Array.isArray(err) ? err[0] : err;

export default function AddMemberDialog({
  open,
  formData,
  formErrors,
  submitting,
  showPassword,
  onClose,
  onSubmit,
  onChange,
  onTogglePassword,
}: AddMemberDialogProps) {
  const fieldError = (name: keyof AddMemberPayload) =>
    getErrorMessage(formErrors?.[name]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      maxWidth={500}
      title="Add Team Member"
      subtitle="Give a team access to your organization's partner dashboard."
      disableClose={submitting}
      actions={
        <>
          <AppButton
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
            sx={{ px: 3, backgroundColor: "transparent", color: "var(--text-primary)" }}
          >
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} loading={submitting} sx={{ px: 3 }}>
            Add member
          </AppButton>
        </>
      }
    >
      <Box
        component="form"
        id={FORM_ID}
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
      >
        {/* Name */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <AdminTextField
            label="First name"
            name="first_name"
            placeholder="e.g. Ada"
            value={formData.first_name}
            onChange={onChange}
            required
            fullWidth
            autoFocus
            error={Boolean(fieldError("first_name"))}
            helperText={fieldError("first_name")}
          />
          <AdminTextField
            label="Last name"
            name="last_name"
            placeholder="e.g. Obi"
            value={formData.last_name}
            onChange={onChange}
            required
            fullWidth
            error={Boolean(fieldError("last_name"))}
            helperText={fieldError("last_name")}
          />
        </Box>

        {/* Email */}
        <AdminTextField
          label="Email address"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={onChange}
          required
          fullWidth
          error={Boolean(fieldError("email"))}
          helperText={
            fieldError("email")
          }
        />

        {/* Phone */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <AdminTextField
            label="Country"
            select
            name="country_code"
            value={formData.country_code}
            onChange={onChange}
            sx={{ width: 140, flexShrink: 0 }}
          >
            <MenuItem value="NG">NG (+234)</MenuItem>
            <MenuItem value="GH">GH (+233)</MenuItem>
            <MenuItem value="KE">KE (+254)</MenuItem>
            <MenuItem value="US">US (+1)</MenuItem>
          </AdminTextField>
          <AdminTextField
            label="Phone number"
            name="phone_number"
            type="tel"
            placeholder="e.g. 8012345678"
            value={formData.phone_number}
            onChange={onChange}
            required
            fullWidth
            error={Boolean(fieldError("phone_number"))}
            helperText={fieldError("phone_number")}
          />
        </Box>

        {/* Password */}
        <AdminTextField
          label="Temporary password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={onChange}
          required
          fullWidth
          autoComplete="new-password"
          error={Boolean(fieldError("password"))}
          helperText={
            fieldError("password")
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={onTogglePassword}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    sx={{ color: "text.secondary" }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </AppModal>
  );
}
