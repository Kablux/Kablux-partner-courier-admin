import React from "react";
import { Box, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { WalletActionType } from "../../types/common.types";

const ACTIONS: {
  key: WalletActionType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "deposit", label: "Deposit", icon: <AddCircleOutlineRoundedIcon /> },
  { key: "send", label: "Send Money", icon: <SendRoundedIcon /> },
  { key: "invoice", label: "Invoicing", icon: <DescriptionRoundedIcon /> },
  { key: "withdraw", label: "Withdraw", icon: <AccountBalanceWalletRoundedIcon /> },
];

export default function QuickActions({
  onAction,
}: {
  onAction: (action: WalletActionType) => void;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Quick Actions
      </Typography>
      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 2.5,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {ACTIONS.map((a) => (
          <Box
            key={a.key}
            onClick={() => onAction(a.key)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              py: 2,
              borderRadius: "12px",
              border: "1px solid var(--border-subtle, var(--border))",
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "var(--accent-gold, #F5C518)",
                backgroundColor: "rgba(245,197,24,0.05)",
              },
            }}
          >
            <Box sx={{ color: "var(--text-primary)", "& svg": { fontSize: 22 } }}>
              {a.icon}
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>
              {a.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}