import { useMemo } from "react";
import { Box } from "@mui/material";
import { FinancePoint } from "../../../types/index.types";
import FinanceBarChart from "./Barchat";
import FinanceAnalyticsFooter from "./Footer";
import FinanceAnalyticsHeader from "./Header";
import FinanceAnalyticsSkeleton from "./Skeleton";
import FinanceSummary from "./Summary";
import {
  prepareChartData,
  calculateTotalSpending,
  hasFinancialData,
  calculateYAxisMax,
} from "./utils";

interface Props {
  financials?: {
    granularity: string;
    points: FinancePoint[];
  };
}

export default function FinanceAnalyticsCard({ financials }: Props) {
  /*
   * Loading state
   */
  if (!financials) {
    return <FinanceAnalyticsSkeleton />;
  }

  const backendPoints = financials.points || [];

  /*
   * Prepare chart data
   */
  const chartData = useMemo(
    () => prepareChartData(backendPoints),
    [backendPoints],
  );

  /*
   * Calculate summary
   */
  const totalSpending = useMemo(
    () => calculateTotalSpending(backendPoints),
    [backendPoints],
  );

  const hasData = useMemo(
    () => hasFinancialData(backendPoints),
    [backendPoints],
  );

  /*
   * Calculate chart scale
   */
  const yAxisMax = useMemo(() => calculateYAxisMax(chartData), [chartData]);

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        border: "1px solid rgba(120,130,150,0.10)",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        height: "100%",
        minHeight: 390,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FinanceAnalyticsHeader granularity={financials.granularity} />

      <FinanceSummary totalSpending={totalSpending} hasData={hasData} />

      <FinanceBarChart data={chartData} yAxisMax={yAxisMax} />

      <FinanceAnalyticsFooter
        granularity={financials.granularity}
        periodCount={backendPoints.length}
      />
    </Box>
  );
}
