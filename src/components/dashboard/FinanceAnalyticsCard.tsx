import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { FINANCE_DATA, FINANCE_MILES } from "../../data/data";
import { FinancePeriod } from "../../types/common.types";

const GOLD = "#F5C518";
const MUTED = "rgba(120,130,150,0.18)";

const PERIODS: { key: FinancePeriod; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

function DeltaTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <Box
      sx={{
        backgroundColor: "#0A1F44",
        color: "#fff",
        borderRadius: "8px",
        px: 1.25,
        py: 0.75,
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <Typography sx={{ fontSize: 11, opacity: 0.7 }}>{p.time}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
        {p.delta >= 0 ? "+" : ""}
        {p.delta}%
      </Typography>
    </Box>
  );
}

export default function FinanceAnalyticsCard() {
  const [period, setPeriod] = useState<FinancePeriod>("day");
  const data = FINANCE_DATA[period];
  const peak = Math.max(...data.map((d) => d.value));

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2.5,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
          Finance{" "}
          <Box
            component="span"
            sx={{ color: "var(--text-muted)", fontWeight: 500 }}
          >
            Analytics
          </Box>
        </Typography>

        {/* Period pills */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            p: 0.5,
            borderRadius: "10px",
            backgroundColor: "rgba(120,130,150,0.1)",
          }}
        >
          {PERIODS.map((p) => {
            const active = period === p.key;
            return (
              <Box
                key={p.key}
                onClick={() => setPeriod(p.key)}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  userSelect: "none",
                  color: active ? "#000" : "var(--text-muted)",
                  backgroundColor: active ? GOLD : "transparent",
                }}
              >
                {p.label}
              </Box>
            );
          })}
        </Box>

        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          {FINANCE_MILES} Miles
        </Typography>
      </Box>

      {/* Chart */}
      <Box sx={{ flexGrow: 1, minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<DeltaTooltip />}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} maxBarSize={26}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.value === peak ? GOLD : MUTED} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
