import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { DashboardSummary } from "../../types/index.types";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: string;
}

interface Props {
  summary?: DashboardSummary;
}

export default function PartnerStatCards({ summary }: Props) {
  if (!summary) {
    return (
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
    );
  }

  const cards: StatCard[] = [
    {
      label: "Total Rides",
      value: summary.total_rides.toLocaleString(),
      icon: <TwoWheelerRoundedIcon sx={{ fontSize: 24 }} />,
      tint: "#F5C518",
    },
    {
      label: "Total Spendings",
      value: `₦ ${summary.total_spendings.toLocaleString()}`,
      icon: <PaymentsRoundedIcon sx={{ fontSize: 24 }} />,
      tint: "#22C55E",
    },
    {
      label: "Total Users",
      value: summary.total_users.toLocaleString(),
      icon: <GroupsRoundedIcon sx={{ fontSize: 24 }} />,
      tint: "#8B5CF6",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(3, 1fr)",
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
            border: "1px solid rgba(120,130,150,0.10)",
            gap: 2,
            backgroundColor: "var(--bg-card)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
            borderRadius: 1,
            p: 2.25,
            // maxWidth: "350px",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: c.tint,
              backgroundColor: `${c.tint}1F`,
            }}
          >
            {c.icon}
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: 14, color: "var(--text-secondary)", mb: 0.25 }}
            >
              {c.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 18,
                fontWeight: 500,
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
