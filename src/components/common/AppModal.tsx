import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;

  title?: string;
  subtitle?: string;

  children: React.ReactNode;
  actions?: React.ReactNode;

  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;

  showCloseButton?: boolean;
  disableClose?: boolean;

  contentPadding?: number;
}

export default function AppModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  showCloseButton = true,
  disableClose = false,
  contentPadding = 2.5,
}: CommonModalProps) {
  const handleClose = () => {
    if (!disableClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 1,
          border: "1px solid rgba(120,130,150,0.10)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
          color: "var(--text-primary)",
        },
      }}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            px: contentPadding,
            pt: contentPadding,
            pb: subtitle ? 1 : 2,
            position: "relative",
          }}
        >
          {title && (
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              sx={{
                fontSize: 13,
                color: "var(--text-muted)",
                mt: 0.5,
                pr: 4,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {showCloseButton && (
            <IconButton
              onClick={handleClose}
              disabled={disableClose}
              size="small"
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "var(--text-muted)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: "var(--text-primary)",
                },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent
        dividers
        sx={{
          px: contentPadding,
          py: contentPadding,
          borderColor: "var(--border-color, rgba(0,0,0,0.08))",
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: contentPadding,
            mb: 1,
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
