import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function AppButton({
  children,
  loading = false,
  disabled,
  sx,
  ...props
}: AppButtonProps) {
  return (
    <Button
      // Loading also disables the button, so a request can't be sent twice.
      disabled={disabled || loading}
      sx={[
        {
          py: 1.2,
          px: 4,
          borderRadius: "8px",
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontSize: 14,
          fontWeight: 500,
          textTransform: "none",
          transition: "all .2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 25px rgba(245, 197, 24, 0.114)",
          },

          // Loading keeps the gold look with a spinner; truly disabled uses the
          // theme's disabled colours, which are visible in light and dark mode.
          "&.Mui-disabled":
            loading && !disabled
              ? { backgroundColor: "var(--accent-gold)", color: "#000" }
              : { backgroundColor: "action.disabledBackground", color: "action.disabled" },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: "inherit" }} />
      ) : (
        children
      )}
    </Button>
  );
}
