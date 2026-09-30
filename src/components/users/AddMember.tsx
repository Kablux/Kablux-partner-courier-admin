import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { AddMemberPayload } from "../../types/index.types";
import AppModal from "../common/AppModal";

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

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: 44,
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
    "&:hover": {
      backgroundColor: "background.paper",
    },
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "divider",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(224, 179, 22, 0.18)",
      backgroundColor: "background.paper",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0.5,
    marginTop: 0.5,
    fontWeight: 500,
    fontSize: "0.75rem",
  },
};

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
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Organization Member"
      subtitle="Add a new member to your organization and assign their credentials."
      maxWidth="sm"
      disableClose={submitting}
      actions={
        <Box
          sx={{
            display: "flex",
            justify: "flex-end",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            pt: 1,
          }}
        >
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              borderRadius: "10px",
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="add-member-form"
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: "var(--accent-gold, #E5B800)",
              color: "#0D0D0D",
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "none",
              px: 3.5,
              py: 1,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(229, 184, 0, 0.3)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#D4A700",
                boxShadow: "0 6px 18px rgba(229, 184, 0, 0.45)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "text.disabled",
                boxShadow: "none",
              },
            }}
          >
            {submitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
              </Box>
            ) : (
              "Add Member"
            )}
          </Button>
        </Box>
      }
    >
      <Box
        component="form"
        id="add-member-form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          py: 1,
        }}
      >
        {/* Name Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={onChange}
            required
            fullWidth
            size="small"
            error={Boolean(formErrors?.first_name)}
            helperText={getErrorMessage(formErrors?.first_name)}
            sx={inputStyles}
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={onChange}
            required
            fullWidth
            size="small"
            error={Boolean(formErrors?.last_name)}
            helperText={getErrorMessage(formErrors?.last_name)}
            sx={inputStyles}
          />
        </Box>

        {/* Email */}
        <TextField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          fullWidth
          size="small"
          error={Boolean(formErrors?.email)}
          helperText={getErrorMessage(formErrors?.email)}
          sx={inputStyles}
        />

        {/* Phone Number Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Country"
            select
            name="country_code"
            value={formData.country_code}
            onChange={onChange}
            size="small"
            sx={{
              width: 140,
              flexShrink: 0,
              ...inputStyles,
            }}
          >
            <MenuItem value="NG">NG (+234)</MenuItem>
            <MenuItem value="GH">GH (+233)</MenuItem>
            <MenuItem value="KE">KE (+254)</MenuItem>
            <MenuItem value="US">US (+1)</MenuItem>
          </TextField>

          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={onChange}
            required
            fullWidth
            size="small"
            error={Boolean(formErrors?.phone_number)}
            helperText={getErrorMessage(formErrors?.phone_number)}
            sx={inputStyles}
          />
        </Box>

        {/* Password */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={onChange}
          required
          fullWidth
          size="small"
          error={Boolean(formErrors?.password)}
          helperText={getErrorMessage(formErrors?.password)}
          sx={inputStyles}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={onTogglePassword}
                    edge="end"
                    size="small"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
