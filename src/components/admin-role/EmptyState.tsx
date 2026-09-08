import React from "react";
import { Box, Typography } from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AppButton from "../common/AppButton";

interface Props {
  onCreate?: () => void;
}

export default function AdminRoleEmptyState({ onCreate }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px dashed var(--border, rgba(255,255,255,0.15))",
        borderRadius: "16px",
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,215,0,0.1)",
          color: "var(--accent-gold, #FFD700)",
          mb: 1,
        }}
      >
        <AdminPanelSettingsRoundedIcon sx={{ fontSize: 30 }} />
      </Box>

      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
        No roles yet
      </Typography>
      <Typography
        sx={{
          fontSize: 13.5,
          color: "var(--text-secondary)",
          maxWidth: 340,
        }}
      >
        Create your first admin role to control what your team members can see
        and do across the dashboard.
      </Typography>

      {onCreate && (
        <AppButton onClick={onCreate} sx={{ mt: 1.5, borderRadius: "8px", px: 3 }}>
          Add New Role
        </AppButton>
      )}
    </Box>
  );
}