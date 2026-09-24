import { Box, Typography } from "@mui/material";

export default function DeliveryEmptyState() {
  return (
    <Box
      sx={{
        mt: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: "9px",
        backgroundColor: "rgba(120,130,150,0.06)",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        No deliveries have been recorded yet.
      </Typography>
    </Box>
  );
}