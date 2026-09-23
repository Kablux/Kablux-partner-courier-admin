import { Box, Typography } from "@mui/material";

interface FinanceAnalyticsFooterProps {
  granularity?: string;
  periodCount: number;
}

export default function FinanceAnalyticsFooter({
  granularity,
  periodCount,
}: FinanceAnalyticsFooterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 1,
        pt: 1.5,
        borderTop:
          "1px solid rgba(120,130,150,0.10)",
      }}
    >
      <Typography
        sx={{
          fontSize: 10.5,
          color: "var(--text-muted)",
        }}
      >
        {granularity || "Overview"} breakdown
      </Typography>

      <Typography
        sx={{
          fontSize: 10.5,
          color: "var(--text-muted)",
        }}
      >
        {periodCount > 0
          ? `${periodCount} period${
              periodCount === 1 ? "" : "s"
            }`
          : "Awaiting transactions"}
      </Typography>
    </Box>
  );
}