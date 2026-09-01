import React from "react";
import { Box, Typography, Button } from "@mui/material";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DeliveryStat } from "../../types/common.types";

const GOLD = "#F5C518";
const TRACK = "#0A1F44";

interface Props {
  overall: number;
  breakdown: DeliveryStat[];
  onDownload?: () => void;
}

export default function DeliveriesCard({
  overall,
  breakdown,
  onDownload,
}: Props) {
  const ring = [
    { name: "done", value: overall },
    { name: "rest", value: 100 - overall },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "16px",
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1 }}>
        Deliveries
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        {/* Donut */}
        <Box
          sx={{
            position: "relative",
            width: 160,
            height: 160,
            flexShrink: 0,
            mx: { xs: "auto", sm: 0 },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ring}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={58}
                outerRadius={78}
                paddingAngle={0}
                stroke="none"
                cornerRadius={10}
              >
                <Cell fill={GOLD} />
                <Cell fill={TRACK} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
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
              sx={{ fontSize: 20, color: TRACK, mb: 0.25 }}
            />
            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
              {overall}%
            </Typography>
          </Box>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {breakdown.map((b) => (
            <Box
              key={b.label}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  backgroundColor: b.color,
                }}
              />
              <Typography
                sx={{
                  fontSize: 13,
                  color: "var(--text-secondary, var(--text-muted))",
                  flexGrow: 1,
                }}
              >
                {b.label}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {b.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Download */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
        <Button
          onClick={onDownload}
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
            height: 40,
            color: "var(--text-primary)",
            backgroundColor: "rgba(120,130,150,0.12)",
            "&:hover": { backgroundColor: "rgba(120,130,150,0.2)" },
          }}
        >
          Download Statistics
        </Button>
      </Box>
    </Box>
  );
}
