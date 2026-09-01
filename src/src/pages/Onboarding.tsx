import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Button } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeMode } from "../theme/ThemeContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import CompanyInfo from "../components/auth/onboarding/CompanyInfo";
import EmailOTP from "../components/auth/onboarding/EmailOtp";
import { nextStep } from "../redux/slices/Onboarding";
import MoreInfo from "../components/auth/onboarding/MoreInfo";
import Payment from "../components/auth/onboarding/Payment";
import SuccessStep from "../components/auth/onboarding/Success";

// Import your step components (we'll build these next)

export default function OnboardingFlow() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";
const dispatch = useAppDispatch();
const currentStep = useAppSelector((state) => state.onboarding.currentStep);

const handleNext = () => {
    dispatch(nextStep());
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        alignItems: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* --- Top Navigation Bar --- */}
      
      <Box className="maxContainer w-full flex flex-col items-center text-white">
      <Box
        component="header"
        sx={{
          height: 64,
          backgroundColor: "#0A1929",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          m:4,
          borderRadius: 2,
          width: "85%",
        }}
      >
        <h4 className="poppins text-lg font-semibold ">
          Kablux <Box component="span" sx={{ fontWeight: 400 }}>For Business</Box>
        </h4>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3, ml: 8 }}>
          <p className="poppins cursor-pointer text-sm hidden sm:block">
            Terms and Conditions
          </p>
          <p className="poppins cursor-pointer text-sm hidden sm:block">
            Help & Support
          </p>
        </Box>
        <Box>
          <IconButton onClick={toggleMode} sx={{ color: "#FFF" }}>
            {isDark ? <LightModeOutlinedIcon sx={{ fontSize: 20 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* --- Main Content Area --- */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        
        {/* Background Sunburst Decorators (Optional placeholders) */}
        <Box sx={{ position: "absolute", left: "10%", top: "45%", opacity: 0.1 }}>
          <LightModeOutlinedIcon sx={{ fontSize: 100, color: "var(--accent-gold)" }} />
        </Box>
        <Box sx={{ position: "absolute", right: "10%", bottom: "20%", opacity: 0.1 }}>
          <LightModeOutlinedIcon sx={{ fontSize: 100, color: "var(--accent-gold)" }} />
        </Box>

        {/* Central Form Card */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 3,
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
            p: { xs: 4, md: 5 },
            zIndex: 10,
            boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
          }}
        >{/* Render steps based on Redux state */}
          {currentStep === 1 && <CompanyInfo />}
          {currentStep === 2 && <EmailOTP onNext={handleNext}/>}
          {currentStep === 3 && <MoreInfo onNext={handleNext}/>}
          {currentStep === 4 && <Payment />}
          {currentStep === 5 && <SuccessStep />}
        </Paper>
      </Box>
    </Box>
      </Box>
    
  );
}