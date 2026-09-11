import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { Activity } from "../../types/common.types";
import { naira } from "../../data/data";

interface Props {
  activities: Activity[];
}

export default function RecentActivity({ activities }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? activities : activities.slice(0, 4);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
          Recent Activity
        </Typography>
        <Button
          onClick={() => setShowAll((s) => !s)}
          sx={{
            textTransform: "none",
            fontSize: 12.5,
            fontWeight: 600,
            borderRadius: "20px",
            px: 2,
            height: 32,
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle, var(--border))",
            "&:hover": { borderColor: "var(--accent-gold, #F5C518)" },
          }}
        >
          {showAll ? "Show Less" : "View All Activities"}
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 3,
        }}
      >
        <Typography
          sx={{ fontSize: 12, color: "var(--text-muted, var(--text-secondary))", mb: 1.5 }}
        >
          Today, Sep 19
        </Typography>

        {visible.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            No activity yet.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            {visible.map((a) => {
              const isIn = a.direction === "in";
              return (
                <Box
                  key={a.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isIn ? "#22C55E" : "#EF4444",
                      backgroundColor: isIn
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(239,68,68,0.12)",
                    }}
                  >
                    {isIn ? (
                      <ArrowDownwardRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
                      {a.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: "var(--text-muted, var(--text-secondary))" }}
                    >
                      {a.time}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: isIn ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {isIn ? "+" : "-"}
                    {naira(a.amount)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}