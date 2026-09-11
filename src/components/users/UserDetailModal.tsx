import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { User } from "../../types/common.types";

const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  Approved: { fg: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  Canceled: { fg: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  Pending: { fg: "#F5C518", bg: "rgba(245,197,24,0.12)" },
};

const goldRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  backgroundColor: "var(--accent-gold, #FFD700)",
  color: "#000",
  borderRadius: "10px",
  px: 2,
  py: 1.5,
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
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({ user, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const c = (user && STATUS_COLORS[user.status]) || STATUS_COLORS.Approved;

  const handleCopy = async () => {
    if (!user?.email) return;
    await navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #111)",
          borderRadius: "18px",
          maxWidth: 500,
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

      {user && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={user.avatar}
                sx={{ width: 54, height: 54, fontSize: 18 }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                  {user.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography
                    sx={{ fontSize: 13.5, color: "var(--text-secondary)" }}
                  >
                    {user.email}
                  </Typography>
                  <IconButton
                    onClick={handleCopy}
                    size="small"
                    sx={{ color: "#4d8eff", p: 0.25 }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  {copied && (
                    <Typography sx={{ fontSize: 12, color: "success.main" }}>
                      Copied
                    </Typography>
                  )}
                </Box>
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
              }}
            >
              {user.status}
            </Box>
          </Box>

          {/* Contact + address */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={goldRowSx}>
              <PhoneIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {user.contact}
              </Typography>
            </Box>
            <Box sx={goldRowSx}>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {user.address}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

          {/* Details grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2.5,
            }}
          >
            <Field label="Unique Code" value={user.code} />
            <Field label="Date Added" value={user.date} />
            <Field label="Role" value={user.role} />
            <Field label="Gender" value={user.gender} />
          </Box>
        </Box>
      )}
    </Dialog>
  );
}