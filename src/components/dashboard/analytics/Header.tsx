import { Box, Typography } from "@mui/material";

interface FinanceAnalyticsHeaderProps {
  granularity?: string;
}

export default function FinanceAnalyticsHeader({
  granularity,
}: FinanceAnalyticsHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          Finance Analytics
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: "var(--text-secondary)",
            mt: 0.5,
          }}
        >
          Spending over time
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 2,
          py: 0.5,
          borderRadius: "4px",
          fontSize: 12,
          textTransform: "capitalize",
          fontWeight: 500,
          color: "#000",
          backgroundColor: "var(--accent-gold)",
          whiteSpace: "nowrap",
        }}
      >
        {granularity || "Overview"}
      </Box>
    </Box>
  );
}