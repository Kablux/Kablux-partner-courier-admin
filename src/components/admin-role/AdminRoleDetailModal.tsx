import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { Dialog } from "@mui/material";
import { AdminRole } from "../../types/common.types";

const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  Active: { fg: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  Inactive: { fg: "#8b8f98", bg: "rgba(139,143,152,0.14)" },
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography sx={{ fontSize: 11.5, color: "var(--text-secondary)", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{value}</Typography>
  </Box>
);

interface Props {
  role: AdminRole | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleDetailsModal({ role, isOpen, onClose }: Props) {
  const c = (role && STATUS_COLORS[role.status]) || STATUS_COLORS.Active;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #111)",
          borderRadius: "18px",
          maxWidth: 520,
          width: "100%",
          p: 4,
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "secondary.main" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {role && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,215,0,0.1)",
                  color: "var(--accent-gold, #FFD700)",
                  flexShrink: 0,
                }}
              >
                <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                  {role.name}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "var(--text-secondary)" }}
                >
                  {role.description}
                </Typography>
              </Box>
            </Box>

            <Box
              component="span"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                fontSize: 12,
                fontWeight: 700,
                color: c.fg,
                backgroundColor: c.bg,
                whiteSpace: "nowrap",
              }}
            >
              {role.status}
            </Box>
          </Box>

          {/* Last login banner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.75,
              borderRadius: "12px",
              border: "1px solid var(--border, rgba(255,255,255,0.1))",
              backgroundColor: "rgba(255,255,255,0.015)",
            }}
          >
            <AccessTimeRoundedIcon
              sx={{ fontSize: 20, color: "var(--accent-gold, #FFD700)" }}
            />
            <Box>
              <Typography
                sx={{ fontSize: 11.5, color: "var(--text-secondary)" }}
              >
                Last login
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {role.lastLogin}
              </Typography>
            </Box>
          </Box>

          {/* Details grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2.5,
            }}
          >
            <Field label="Members" value={role.members} />
            <Field label="Permissions" value={role.permissions} />
            <Field label="Date Created" value={role.createdAt} />
            <Field label="Created By" value={role.createdBy} />
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* Accessible modules */}
          <Box>
            <Typography
              sx={{ fontSize: 11.5, color: "var(--text-secondary)", mb: 1 }}
            >
              Accessible modules
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {role.modules.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                  }}
                >
                  No modules assigned
                </Typography>
              ) : (
                role.modules.map((m) => (
                  <Box
                    key={m}
                    component="span"
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: "8px",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border, rgba(255,255,255,0.1))",
                    }}
                  >
                    {m}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}