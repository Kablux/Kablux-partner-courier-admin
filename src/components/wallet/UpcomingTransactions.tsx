import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { naira } from "../../data/data";
import { UpcomingTxn } from "../../types/common.types";

interface Props {
  items: UpcomingTxn[];
  onPay: (txn: UpcomingTxn) => void;
}

export default function UpcomingTransactions({ items, onPay }: Props) {
  // Group by dateLabel, preserving order.
  const groups: { label: string; rows: UpcomingTxn[] }[] = [];
  items.forEach((t) => {
    const g = groups.find((x) => x.label === t.dateLabel);
    if (g) g.rows.push(t);
    else groups.push({ label: t.dateLabel, rows: [t] });
  });

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Upcoming Transaction
      </Typography>

      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {groups.length === 0 && (
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            No upcoming transactions.
          </Typography>
        )}

        {groups.map((g) => (
          <Box key={g.label}>
            <Typography
              sx={{
                fontSize: 12,
                color: "var(--text-muted, var(--text-secondary))",
                mb: 1,
              }}
            >
              {g.label}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {g.rows.map((t) => (
                <Box
                  key={t.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Typography
                    sx={{ fontSize: 12.5, minWidth: 64, color: "var(--text-secondary)" }}
                  >
                    {t.time}
                  </Typography>
                  <Box
                    sx={{
                      width: "2px",
                      height: 28,
                      backgroundColor: "var(--accent-gold, #F5C518)",
                      borderRadius: 2,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                      {t.route}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: "var(--text-muted, var(--text-secondary))" }}
                    >
                      {naira(t.amount)}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => onPay(t)}
                    sx={{
                      textTransform: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: "20px",
                      px: 2,
                      height: 30,
                      color: "var(--accent-gold, #F5C518)",
                      border: "1px solid var(--accent-gold, #F5C518)",
                      "&:hover": { backgroundColor: "rgba(245,197,24,0.08)" },
                    }}
                  >
                    Pay Now
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}