import { useMemo } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { FinancePoint } from "../../types/index.types";

const GOLD = "#F5C518";
const NAVY = "#0A1F44";
const MUTED_BAR = "rgba(120,130,150,0.18)";

interface Props {
  financials?: {
    granularity: string;
    points: FinancePoint[];
  };
}

interface ChartPoint extends FinancePoint {
  isPeak?: boolean;
  isPlaceholder?: boolean;
}

/**
 * Format large monetary values for the Y-axis.
 *
 * ₦0
 * ₦500
 * ₦10k
 * ₦250k
 * ₦1.2m
 */
const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}m`;
  }

  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}k`;
  }

  return `₦${value.toLocaleString()}`;
};

/**
 * Format the tooltip value with the full amount.
 */
const formatFullCurrency = (value: number) => {
  return `₦${value.toLocaleString()}`;
};

/**
 * When the backend doesn't return data, keep the chart visually useful.
 *
 * We don't invent financial values.
 * Every placeholder amount remains 0.
 */
const EMPTY_PERIODS: FinancePoint[] = [
  { period: "Jan", amount: 0 },
  { period: "Feb", amount: 0 },
  { period: "Mar", amount: 0 },
  { period: "Apr", amount: 0 },
  { period: "May", amount: 0 },
  { period: "Jun", amount: 0 },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as ChartPoint;

  if (!point) return null;

  return (
    <Box
      sx={{
        backgroundColor: NAVY,
        color: "#fff",
        borderRadius: "10px",
        px: 1.5,
        py: 1.1,
        minWidth: 130,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          color: "rgba(255,255,255,0.65)",
          mb: 0.35,
        }}
      >
        {point.period}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {formatFullCurrency(point.amount)}
      </Typography>

      {point.isPlaceholder && (
        <Typography
          sx={{
            fontSize: 10.5,
            color: "rgba(255,255,255,0.55)",
            mt: 0.3,
          }}
        >
          No spending recorded
        </Typography>
      )}
    </Box>
  );
}

export default function FinanceAnalyticsCard({ financials }: Props) {
  /*
   * Loading state.
   */
  if (!financials) {
    return (
      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          borderRadius: 1,
          p: 3,
        }}
      >
        <Skeleton width="35%" height={28} />
        <Skeleton width="20%" height={25} sx={{ ml: "auto", mt: -3 }} />
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

  const backendPoints = financials.points || [];

  /*
   * Prepare chart data.
   *
   * If backend has no points, use zero-value periods.
   * We are NOT creating fake financial numbers.
   */
  const chartData = useMemo<ChartPoint[]>(() => {
    if (backendPoints.length === 0) {
      return EMPTY_PERIODS.map((item) => ({
        ...item,
        isPlaceholder: true,
      }));
    }

    const peak = Math.max(...backendPoints.map((point) => point.amount || 0));

    return backendPoints.map((point) => ({
      ...point,
      amount: point.amount || 0,
      isPeak: point.amount === peak && peak > 0,
    }));
  }, [backendPoints]);

  /*
   * Financial summary.
   */
  const totalSpending = backendPoints.reduce(
    (total, point) => total + (point.amount || 0),
    0,
  );

  const peakPoint =
    backendPoints.length > 0
      ? backendPoints.reduce((highest, current) =>
          current.amount > highest.amount ? current : highest,
        )
      : null;

  const hasData = backendPoints.some((point) => Number(point.amount) > 0);

  /*
   * Dynamic Y-axis maximum.
   *
   * This prevents a tiny value from looking almost invisible.
   */
  const maxAmount = Math.max(...chartData.map((point) => point.amount), 0);

  const yAxisMax = maxAmount > 0 ? Math.ceil(maxAmount * 1.2) : 100;

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        border: "1px solid rgba(120,130,150,0.10)",
        p: { xs: 2, sm: 2.5, md: 3 },
        height: "100%",
        minHeight: 390,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ================= HEADER ================= */}
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

        {/* Granularity */}
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
            backgroundColor: GOLD,
            whiteSpace: "nowrap",
          }}
        >
          {financials.granularity || "Overview"}
        </Box>
      </Box>

      {/* ================= SUMMARY ================= */}
      <Box className="flex justify-end w-full" sx={{ mb: 1 }}>
        {/* Total */}
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

      {/* ================= EMPTY STATE MESSAGE ================= */}
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

      {/* ================= CHART ================= */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 230,
          width: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 8,
              right: 4,
              left: 0,
              bottom: 0,
            }}
            barCategoryGap="28%"
          >
            <CartesianGrid vertical={false} stroke="rgba(120,130,150,0.10)" />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 11,
              }}
              dy={8}
            />

            <YAxis
              domain={[0, yAxisMax]}
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 10.5,
              }}
              tickFormatter={formatCompactCurrency}
            />

            <Tooltip
              cursor={{
                fill: "rgba(245,197,24,0.05)",
              }}
              content={<CustomTooltip />}
            />

            <Bar dataKey="amount" radius={[7, 7, 3, 3]} maxBarSize={34}>
              {chartData.map((point, index) => (
                <Cell
                  key={`${point.period}-${index}`}
                  fill={
                    point.isPeak
                      ? GOLD
                      : point.isPlaceholder
                        ? MUTED_BAR
                        : "rgba(245,197,24,0.35)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          pt: 1.5,
          borderTop: "1px solid rgba(120,130,150,0.10)",
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            color: "var(--text-muted)",
          }}
        >
          {financials.granularity || "Overview"} breakdown
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            color: "var(--text-muted)",
          }}
        >
          {backendPoints.length > 0
            ? `${backendPoints.length} period${
                backendPoints.length === 1 ? "" : "s"
              }`
            : "Awaiting transactions"}
        </Typography>
      </Box>
    </Box>
  );
}
