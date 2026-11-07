import { Box, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AppButton from "./AppButton";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 1.5,
      }}
    >
      <ErrorOutlineRoundedIcon
        sx={{
          fontSize: 40,
          color: "error.main",
          opacity: 0.8,
        }}
      />

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        {message}
      </Typography>

      <AppButton
        variant="outlined"
        onClick={onRetry}
        sx={{ borderRadius: "8px", px: 3, mt: 0.5 }}
      >
        Try again
      </AppButton>
    </Box>
  );
}
