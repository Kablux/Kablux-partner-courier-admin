import React from "react";
import { Box, Typography } from "@mui/material";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: string;
}

interface Props {
  stats: {
    totalRiders: number;
    todaysRevenue: number;
    activeRiders: number;
    totalUsers: number;
  };
}

export default function PartnerStatCards({ stats }: Props) {
  const cards: StatCard[] = [
    {
      label: "Total Riders",
      value: stats.totalRiders.toLocaleString(),
      icon: <TwoWheelerRoundedIcon sx={{ fontSize: 20 }} />,
      tint: "#F5C518",
    },
    {
      label: "Today's Revenue",
      value: `₦ ${stats.todaysRevenue.toLocaleString()}`,
      icon: <PaymentsRoundedIcon sx={{ fontSize: 20 }} />,
      tint: "#22C55E",
    },
    {
      label: "Active Rider",
      value: stats.activeRiders.toLocaleString(),
      icon: <DirectionsBikeRoundedIcon sx={{ fontSize: 20 }} />,
      tint: "#3B82F6",
    },
    {
      label: "Total User",
      value: stats.totalUsers.toLocaleString(),
      icon: <GroupsRoundedIcon sx={{ fontSize: 20 }} />,
      tint: "#8B5CF6",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {cards.map((c) => (
        <Box
          key={c.label}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "var(--bg-card)",
             boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
            borderRadius: 1,
            p: 2.25,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: c.tint,
              backgroundColor: `${c.tint}1F`, // ~12% alpha
            }}
          >
            {c.icon}
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: 12, color: "var(--text-muted)", mb: 0.25 }}
            >
              {c.label}
            </Typography>
            <Typography
              sx={{
                mt:1,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {c.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
