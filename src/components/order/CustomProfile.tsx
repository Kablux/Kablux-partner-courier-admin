import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MetricBox } from "../ModalMetricsBox";

export interface ProfileDetail {
  name: string;
  email: string;
  rating: number;
  reminder?: string;
  phone: string;
  address: string;
  points: { bonus: number | string; mileage: number | string };
  rideOverview: {
    total: number | string;
    completed: number | string;
    canceled: number | string;
  };
  rideInfo: {
    type: string;
    carModel: string;
    carColor: string;
    registration: string;
  };
  bankInfo: { name: string; accountNumber: string; bank: string };
  totalAmount: number;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ fontSize: 14, color: "secondary.main", mb: 1.5 }}>
    {children}
  </Typography>
);

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

const infoCardSx = {
  p: 2,
  borderRadius: "10px",
  border: "1px solid var(--border, rgba(255,255,255,0.12))",
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const InfoLine = ({ label, value }: { label: string; value: string }) => (
  <Typography sx={{ fontSize: 13 }}>
    <Box component="span" sx={{ color: "var(--text-secondary)" }}>
      {label}:{" "}
    </Box>
    {value}
  </Typography>
);

interface Props {
  profile: ProfileDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerProfileModal({
  profile,
  isOpen,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!profile?.email) return;
    await navigator.clipboard.writeText(profile.email);
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
          maxWidth: 520,
          width: "100%",
          p: 4,
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        },
      }}
    >
      {profile && (
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
              <Avatar sx={{ width: 56, height: 56, fontSize: 18 }}>
                {profile.name.charAt(0)}
              </Avatar>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarRoundedIcon sx={{ color: "#ffb400", fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
                    {profile.rating}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                    {profile.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography
                    sx={{ fontSize: 14, color: "var(--text-secondary)" }}
                  >
                    {profile.email}
                  </Typography>
                  <IconButton
                    onClick={handleCopy}
                    size="small"
                    sx={{ color: "#4d8eff", p: 0.25 }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                  {copied && (
                    <Typography sx={{ fontSize: 12, color: "success.main" }}>
                      Copied
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {profile.reminder && (
              <Box
                sx={{
                  maxWidth: 190,
                  backgroundColor: "var(--accent-gold, #FFD700)",
                  color: "#000",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 1,
                  fontSize: 11.5,
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {profile.reminder}
              </Box>
            )}
          </Box>

          {/* Customer Info */}
          <Box>
            <SectionLabel>Customer Info</SectionLabel>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={goldRowSx}>
                <PhoneIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {profile.phone}
                </Typography>
              </Box>
              <Box sx={goldRowSx}>
                <LocationOnIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {profile.address}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points */}
          <Box>
            <SectionLabel>Points</SectionLabel>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={profile.points.bonus}
                label="Bonus"
                labelColor="#6467F2"
              />
              <MetricBox
                value={profile.points.mileage}
                label="Millage"
                labelColor="#21C45D"
              />
            </Box>
          </Box>

          {/* Ride overview */}
          <Box>
            <SectionLabel>Ride overview</SectionLabel>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <MetricBox
                value={profile.rideOverview.total}
                label="Total Ride"
                labelColor="#7a92f0"
              />
              <MetricBox
                value={profile.rideOverview.completed}
                label="Completed"
                labelColor="#50c878"
              />
              <MetricBox
                value={profile.rideOverview.canceled}
                label="Canceled"
                labelColor="#ff6b6b"
              />
            </Box>
          </Box>

          {/* Ride info + Bank info */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box sx={infoCardSx}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
                ride Info
              </Typography>
              <InfoLine label="ride Type" value={profile.rideInfo.type} />
              <InfoLine label="Car Model" value={profile.rideInfo.carModel} />
              <InfoLine label="Car Color" value={profile.rideInfo.carColor} />
              <InfoLine
                label="Registration"
                value={profile.rideInfo.registration}
              />
            </Box>
            <Box sx={infoCardSx}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
                Bank Info
              </Typography>
              <InfoLine label="Name" value={profile.bankInfo.name} />
              <InfoLine
                label="Acct. Num"
                value={profile.bankInfo.accountNumber}
              />
              <InfoLine label="Bank" value={profile.bankInfo.bank} />
            </Box>
          </Box>

          {/* Total Amount */}
          <Box>
            <SectionLabel>Total Amount</SectionLabel>
            <Box
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid var(--border, rgba(255,255,255,0.12))",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: 34, fontWeight: 800 }}>
                ₦{profile.totalAmount.toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--accent-gold, #FFD700)",
                  mt: 0.5,
                }}
              >
                Total Money
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}