import React from "react";
import { Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

/** Shared icon style for centered page states. */
export const centeredStateIconSx = {
  fontSize: 40,
  color: "var(--text-muted)",
  opacity: 0.6,
};

interface CenteredStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}

/** A centered icon, title, message and optional action (empty / restricted states). */
export default function CenteredState({ icon, title, body, action }: CenteredStateProps) {
  return (
    <Box
      sx={{
        mt: 6,
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        textAlign: "center",
      }}
    >
      {icon}
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", maxWidth: 420 }}>
        {body}
      </Typography>
      {action}
    </Box>
  );
}

/** Shown on owner-only pages when the API answers 403 for the signed-in user. */
export function OwnerOnlyState({ title, body }: { title: string; body: string }) {
  return (
    <CenteredState
      icon={<LockOutlinedIcon sx={centeredStateIconSx} />}
      title={title}
      body={body}
    />
  );
}
