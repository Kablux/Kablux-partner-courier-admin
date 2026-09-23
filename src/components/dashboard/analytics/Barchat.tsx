import { Box, Typography } from "@mui/material";
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
import { ChartPoint, formatFullCurrency, formatCompactCurrency, GOLD, MUTED_BAR } from "./utils";



interface FinanceBarChartProps {
  data: ChartPoint[];
  yAxisMax: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload as ChartPoint;

  if (!point) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#0A1F44",
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

export default function FinanceBarChart({
  data,
  yAxisMax,
}: FinanceBarChartProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 230,
        width: "100%",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 4,
            left: 0,
            bottom: 0,
          }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(120,130,150,0.10)"
          />

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

          <Bar
            dataKey="amount"
            radius={[7, 7, 3, 3]}
            maxBarSize={34}
          >
            {data.map((point, index) => (
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
  );
}