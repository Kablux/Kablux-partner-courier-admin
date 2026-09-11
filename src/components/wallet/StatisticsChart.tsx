import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { StatTab, naira, STAT_SERIES } from "../../data/data";

const GOLD = "#F5C518";

const TABS: { key: StatTab; label: string }[] = [
  { key: "wallet", label: "Wallet" },
  { key: "card", label: "Card Transaction" },
  { key: "investment", label: "Investment" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: "#0A1F44",
        color: "#fff",
        borderRadius: "8px",
        px: 1.25,
        py: 0.75,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      <Typography sx={{ fontSize: 11, opacity: 0.7 }}>Point {label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
        {naira(payload[0].value)}
      </Typography>
    </Box>
  );
}

export default function StatisticsChart() {
  const [tab, setTab] = useState<StatTab>("wallet");
  const [period, setPeriod] = useState("monthly");
  const data = STAT_SERIES[tab];

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Statistics
      </Typography>

      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 3,
        }}
      >
        {/* Tabs + period */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            {TABS.map((t) => (
              <Typography
                key={t.key}
                onClick={() => setTab(t.key)}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  color:
                    tab === t.key
                      ? "var(--accent-gold, #F5C518)"
                      : "var(--text-muted, var(--text-secondary))",
                  position: "relative",
                  pb: 0.75,
                  "&::after":
                    tab === t.key
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "2px",
                          backgroundColor: "var(--accent-gold, #F5C518)",
                        }
                      : {},
                }}
              >
                {t.label}
              </Typography>
            ))}
          </Box>

          <FormControl size="small">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{
                height: 34,
                fontSize: 12.5,
                borderRadius: "8px",
                color: "var(--text-primary)",
                backgroundColor: "rgba(120,130,150,0.06)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border, rgba(255,255,255,0.12))",
                },
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      backgroundColor: "var(--bg-card, #1E1E1E)",
                      backgroundImage: "none",
                      border: "1px solid var(--border, rgba(255,255,255,0.1))",
                      "& .MuiMenuItem-root": { fontSize: 12.5 },
                    },
                  },
                },
              }}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Chart */}
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(120,130,150,0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="x"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={GOLD}
                strokeWidth={2.5}
                fill="url(#walletGrad)"
                dot={false}
                activeDot={{ r: 5, fill: GOLD, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
