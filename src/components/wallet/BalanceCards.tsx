import React from "react";
import { Box, Typography } from "@mui/material";
import { naira } from "../../data/data";

const MiniDonut = ({
  percent,
  color,
  children,
}: {
  percent: number;
  color: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      width: 46,
      height: 46,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: `conic-gradient(${color} ${percent * 3.6}deg, rgba(120,130,150,0.18) 0deg)`,
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        backgroundColor: "var(--bg-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontSize: 15,
        fontWeight: 700,
      }}
    >
      {children}
    </Box>
  </Box>
);

interface Props {
  total: number;
  spent: number;
  bonus: number;
}

export default function BalanceCards({ total, spent, bonus }: Props) {
  const cards = [
    {
      label: "Total Balance",
      value: naira(total),
      color: "#F5C518",
      percent: 75,
      glyph: "₦",
    },
    {
      label: "Amount Spent",
      value: naira(spent),
      color: "#EF4444",
      percent: 40,
      glyph: "$",
    },
    {
      label: "Kablux Bonus",
      value: `+${bonus.toLocaleString()}`,
      color: "#3B82F6",
      percent: 25,
      glyph: "$",
    },
  ];

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Balance
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {cards.map((c) => (
          <Box
            key={c.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.75,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle, var(--border))",
              borderRadius: "14px",
              p: 2.25,
            }}
          >
            <MiniDonut percent={c.percent} color={c.color}>
              {c.glyph}
            </MiniDonut>
            <Box>
              <Typography
                sx={{ fontSize: 12.5, color: "var(--text-muted, var(--text-secondary))" }}
              >
                {c.label}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                {c.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}