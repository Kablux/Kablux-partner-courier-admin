import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { WalletSummary } from "../../types/index.types";
import { formatAmount } from "./walletFormat";

interface CardProps {
  label: string;
  value: string;
  hint: string;
  color: string;
  icon: React.ReactNode;
  loading: boolean;
}

function SummaryCard({ label, value, hint, color, icon, loading }: CardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        // alignItems: "center",
        gap: 2,
        p: 2.5,
        borderRadius: "14px",
        backgroundColor: "var(--bg-card, #181818)",
        border: "1px solid var(--border, #222)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          backgroundColor: `${color}1A`,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</Typography>
        {loading ? (
          <Skeleton variant="text" width={140} height={32} />
        ) : (
          <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>{value}</Typography>
        )}
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</Typography>
      </Box>
    </Box>
  );
}

export default function WalletSummaryCards({
  summary,
  loading,
}: {
  summary: WalletSummary | null;
  loading: boolean;
}) {
  const currency = summary?.currency || "NGN";
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
      }}
    >
      <SummaryCard
        label="Available balance"
        value={formatAmount(summary?.balance, currency)}
        hint="Organization's wallet balance available for transactions"
        color="#16A34A"
        icon={<AccountBalanceWalletOutlinedIcon />}
        loading={loading}
      />
      <SummaryCard
        label="Amount spent"
        value={formatAmount(summary?.amount_spent, currency)}
        hint="Total amount spent from Organization's wallet on transactions"
        color="#DC2626"
        icon={<TrendingDownRoundedIcon />}
        loading={loading}
      />
    </Box>
  );
}
