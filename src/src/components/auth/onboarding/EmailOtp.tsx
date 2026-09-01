import React, { useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

export default function EmailOTP({ onNext }: { onNext: () => void }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.slice(-1);

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otpValues.every((val) => val !== "");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <h1 className="montserrat text-3xl">Verify Email</h1>

      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "rgba(245,197,24,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <MailIcon sx={{ fontSize: 30, color: "var(--accent-gold)" }} />
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
        OTP Authentication
      </Typography>
      <Typography sx={{ color: "var(--text-secondary)", fontSize: 13 }}>
        Enter the code sent to your email
      </Typography>

      {/* OTP Inputs */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <input
            key={idx}
            type="number"
            required
            maxLength={1}
            value={otpValues[idx]}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              width: 45,
              height: 45,
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: 600,
              borderRadius: "50%",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onNext}
        disabled={!isOtpComplete}
        sx={{
          py: 1.2,
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontWeight: 700,
          "&:hover": { backgroundColor: "var(--accent-gold-dim)" },
          "&.Mui-disabled": {
            backgroundColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          },
        }}
      >
        Proceed
      </Button>

      <Typography
        sx={{
          mt: 3,
          fontSize: 13,
          color: "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        Didn’t Receive code?{" "}
        <Box component="span" sx={{ color: "var(--accent-gold)" }}>
          Resend
        </Box>
      </Typography>
    </Box>
  );
}
