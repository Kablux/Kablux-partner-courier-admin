import { Box, CircularProgress } from "@mui/material";

export default function NotificationsLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 320,
      }}
    >
      <CircularProgress
        size={32}
        thickness={4}
        sx={{
          color: "var(--accent-gold)",
        }}
      />
    </Box>
  );
}