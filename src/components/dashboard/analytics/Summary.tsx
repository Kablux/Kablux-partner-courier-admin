import { Box, Typography } from "@mui/material";
import { formatFullCurrency } from "./utils";

interface FinanceSummaryProps {
  totalSpending: number;
  hasData: boolean;
}

export default function FinanceSummary({
  totalSpending,
  hasData,
}: FinanceSummaryProps) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mb: 1,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.2,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              color: "var(--text-secondary)",
              mb: 0.5,
            }}
          >
            Total spending
          </Typography>

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {formatFullCurrency(totalSpending)}
          </Typography>
        </Box>
      </Box>

      {!hasData && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 1,
            px: 1,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "var(--text-muted)",
              opacity: 0.5,
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            No spending data recorded for this period
          </Typography>
        </Box>
      )}
    </>
  );
}