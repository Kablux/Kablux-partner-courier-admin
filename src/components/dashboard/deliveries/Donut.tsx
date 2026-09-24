import { Box, Typography } from "@mui/material";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import { DeliverySlice } from "../../../types/index.types";
import { formatStatus, getStatusColor, EMPTY_RING_COLOR } from "./config";

interface DeliveryDonutProps {
  slices: DeliverySlice[];
  total: number;
}

export default function DeliveryDonut({ slices, total }: DeliveryDonutProps) {
  const hasDeliveries = total > 0;

  const chartData = slices.map((slice) => ({
    status: slice.status,
    name: formatStatus(slice.status),
    value: Number(slice.count || 0),
    color: getStatusColor(slice.status),
  }));

  const ringData = hasDeliveries
    ? chartData
    : [
        {
          status: "EMPTY",
          name: "No deliveries",
          value: 1,
          color: EMPTY_RING_COLOR,
        },
      ];

  return (
    <Box
      sx={{
        position: "relative",
        width: {
          xs: 145,
          sm: 165,
        },
        height: {
          xs: 145,
          sm: 165,
        },
        flexShrink: 0,
        mx: {
          xs: "auto",
          sm: 0,
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={ringData}
            dataKey="value"
            nameKey="name"
            startAngle={90}
            endAngle={-270}
            innerRadius="62%"
            outerRadius="84%"
            paddingAngle={hasDeliveries ? 2 : 0}
            stroke="none"
            cornerRadius={hasDeliveries ? 6 : 0}
          >
            {ringData.map((entry, index) => (
              <Cell key={`${entry.status}-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {hasDeliveries && (
            <Tooltip
              formatter={(value: any, _name: any, props: any) => {
                const safeValue = Array.isArray(value)
                  ? (value[0] ?? 0)
                  : (value ?? 0);

                return [
                  `${safeValue} deliveries`,
                  props?.payload?.name || "Status",
                ];
              }}
              contentStyle={{
                borderRadius: 10,
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                fontSize: 12,
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DirectionsBikeRoundedIcon
          sx={{
            fontSize: 21,
            color: "var(--text-muted)",
            mb: 0.3,
          }}
        />

        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {total.toLocaleString()}
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            color: "var(--text-muted)",
            mt: 0.4,
          }}
        >
          Total
        </Typography>
      </Box>
    </Box>
  );
}
