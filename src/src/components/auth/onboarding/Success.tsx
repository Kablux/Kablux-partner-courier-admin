// src/components/auth/onboarding/SuccessStep.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import { motion } from "framer-motion";
import { resetOnboarding } from "../../../redux/slices/Onboarding";

export default function SuccessStep() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleProceed = () => {
    dispatch(resetOnboarding());

    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 4,
      }}
    >
      {/* Animated Celebration Emoji */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Typography sx={{ fontSize: 54, mb: 2 }}>🎉</Typography>
      </motion.div>

      <h1 className="montserrat text-3xl">
        You have Successfully Created an Account
      </h1>

      <Typography
        sx={{
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 500,
          my: 3,
          lineHeight: 1.5,
        }}
      >
        You can now login and proceed to the dashboard to manage your account and explore
        the features available to you.
      </Typography>
      

      <Button
        variant="contained"
        onClick={handleProceed}
        sx={{
          px: 5,
          py: 1,
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontWeight: 700,
          "&:hover": { backgroundColor: "var(--accent-gold-dim)" },
        }}
      >
        Login
      </Button>
    </Box>
  );
}
