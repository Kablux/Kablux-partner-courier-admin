import React from "react";
import { Box, Typography, Switch, LinearProgress } from "@mui/material";
import { CARD_INFO, naira } from "../../data/data";

interface Props {
  balance: number;
  cardActive: boolean;
  onToggleCard: () => void;
  onAddMoney: () => void;
}

export default function CardPanel({
  balance,
  cardActive,
  onToggleCard,
  onAddMoney,
}: Props) {
  const usedPct = Math.min(
    100,
    Math.round((CARD_INFO.weeklyUsed / CARD_INFO.weeklyLimit) * 100),
  );

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Cards
      </Typography>

      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 3,
        }}
      >
        {/* Current + Add money */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "var(--text-muted, var(--text-secondary))" }}>
            Current
          </Typography>
          <Typography
            role="button"
            tabIndex={0}
            onClick={onAddMoney}
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--accent-gold, #F5C518)",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Add Money
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 26, fontWeight: 800, mb: 2 }}>
          {naira(balance)}
        </Typography>

        {/* Card visual + toggle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.75,
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(245,197,24,0.04))",
            border: "1px solid rgba(245,197,24,0.25)",
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 13, fontFamily: "monospace" }}>
              {CARD_INFO.masked}
            </Typography>
            <Typography
              sx={{ fontSize: 11.5, color: "var(--text-muted, var(--text-secondary))" }}
            >
              {cardActive ? "Active" : "Deactivated"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Switch
              checked={cardActive}
              onChange={onToggleCard}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#F5C518",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#F5C518",
                },
              }}
            />
            <Typography
              sx={{ fontSize: 10.5, color: "var(--text-muted, var(--text-secondary))" }}
            >
              Deactivate Card
            </Typography>
          </Box>
        </Box>

        {/* Weekly payment limit */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.75,
          }}
        >
          <Typography
            sx={{ fontSize: 12.5, color: "var(--text-muted, var(--text-secondary))" }}
          >
            Weekly payment limit
          </Typography>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
            {naira(CARD_INFO.weeklyLimit)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={usedPct}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(120,130,150,0.18)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#F5C518",
              borderRadius: 3,
            },
          }}
        />
      </Box>
    </Box>
  );
}