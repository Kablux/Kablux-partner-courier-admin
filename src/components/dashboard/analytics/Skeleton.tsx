import { Box, Skeleton } from "@mui/material";

export default function FinanceAnalyticsSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        borderRadius: 1,
        p: 3,
      }}
    >
      <Skeleton width="35%" height={28} />

      <Skeleton
        width="20%"
        height={25}
        sx={{
          ml: "auto",
          mt: -3,
        }}
      />

      <Skeleton
        variant="rectangular"
        height={240}
        sx={{
          borderRadius: 2,
          mt: 3,
        }}
      />
    </Box>
  );
}