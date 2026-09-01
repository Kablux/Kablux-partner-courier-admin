import React, { useState } from "react";
import { Box, Typography, Button, Radio } from "@mui/material";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import LocalTaxiOutlinedIcon from "@mui/icons-material/LocalTaxiOutlined";
import MinorCrashOutlinedIcon from "@mui/icons-material/MinorCrashOutlined";
import { useAppSelector } from "../../../redux/hooks";

const services = [
  {
    id: "luxury",
    label: "Luxury Ride",
    icon: <LocalTaxiOutlinedIcon sx={{ color: "var(--text-muted)" }} />,
  },
  {
    id: "standard",
    label: "Standard Ride",
    icon: (
      <DirectionsCarFilledOutlinedIcon sx={{ color: "var(--text-muted)" }} />
    ),
  },
  {
    id: "both",
    label: "Both",
    icon: <MinorCrashOutlinedIcon sx={{ color: "var(--text-muted)" }} />,
  },
];

export default function MoreInfo({ onNext }: { onNext: () => void }) {
  const [selectedService, setSelectedService] = useState<string>("");
  const companyName = useAppSelector(
    (state) => state.onboarding.companyInfo.companyName,
  );
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <h1 className="montserrat text-3xl">Welcome {companyName}</h1>
      
      <Typography
        sx={{
          color: "var(--text-secondary)",
          fontSize: 14,
          fontWeight: 500,
          my: 1,
          lineHeight: 1.5,
        }}
      >
        Answer a few quick questions to help us personalize your experience. you
        can always change your reply later.
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 14,
          mb: 1.5,
          color: "var(--text-primary)",
        }}
      >
        Which Service would your Organization use the most
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
        {services.map((service) => (
          <Box
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              border: "1px solid",
              borderColor:
                selectedService === service.id
                  ? "var(--accent-gold)"
                  : "var(--border-subtle)",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "var(--accent-gold)",
                backgroundColor: "rgba(245,197,24,0.02)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {service.icon}
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {service.label}
              </Typography>
            </Box>
            <Radio
              checked={selectedService === service.id}
              sx={{
                p: 0,
                color: "var(--border-subtle)",
                "&.Mui-checked": { color: "var(--accent-gold)" },
              }}
            />
          </Box>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        disabled={!selectedService}
        onClick={onNext}
        sx={{
          py: 1.2,
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontWeight: 700,
          "&:hover": { backgroundColor: "#e5b616" },
          "&.Mui-disabled": {
            backgroundColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          },
        }}
      >
        Next
      </Button>
    </Box>
  );
}
