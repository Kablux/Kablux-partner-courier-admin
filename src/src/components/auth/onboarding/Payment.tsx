// src/components/auth/onboarding/Payment.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Ideal for Paystack/Card payments
import { useAppDispatch } from "../../../redux/hooks";
import { nextStep } from "../../../redux/slices/Onboarding";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "paystack">(
    "bank",
  );

 const dispatch = useAppDispatch();
 const handleNext = () => {
     dispatch(nextStep());
   };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <h1 className="montserrat text-3xl"> Add a Payment Method</h1>

      <Typography
        sx={{
          color: "var(--text-secondary)",
          fontSize: 14,
          fontWeight: 500,
          my: 3,
          lineHeight: 1.5,
        }}
      >
        This payment will be charged for activity on your Kablux business
        account. you will not be charged until your account is approved
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          startIcon={<AccountBalanceIcon />}
          onClick={() => setPaymentMethod("bank")}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            backgroundColor:
              paymentMethod === "bank" ? "var(--accent-gold)" : "transparent",
            color: paymentMethod === "bank" ? "#000" : "var(--text-primary)",
            border: "1px solid",
            borderColor:
              paymentMethod === "bank"
                ? "var(--accent-gold)"
                : "var(--border-subtle)",
            "&:hover": {
              backgroundColor:
                paymentMethod === "bank" ? "#e5b616" : "rgba(0,0,0,0.02)",
            },
          }}
        >
          Bank Transfer
        </Button>

        <Button
          startIcon={<CreditCardIcon />}
          onClick={() => setPaymentMethod("paystack")}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            backgroundColor:
              paymentMethod === "paystack"
                ? "var(--accent-gold)"
                : "transparent",
            color:
              paymentMethod === "paystack" ? "#000" : "var(--text-primary)",
            border: "1px solid",
            borderColor:
              paymentMethod === "paystack"
                ? "var(--accent-gold)"
                : "var(--border-subtle)",
            "&:hover": {
              backgroundColor:
                paymentMethod === "paystack" ? "#e5b616" : "rgba(0,0,0,0.02)",
            },
          }}
        >
          Paystack
        </Button>
      </Box>

      {/* Form Fields */}
      {paymentMethod === "bank" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Account Number"
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon
                      sx={{ color: "var(--text-muted)", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                sx: { borderRadius: 1 },
              },
            }}
          />
          <TextField
            select
            fullWidth
            label="Bank"
            variant="outlined"
            size="small"
            defaultValue=""
            slotProps={{
              input: { sx: { borderRadius: 1 } },
            }}
          >
            <MenuItem value="gtb">Guaranty Trust Bank</MenuItem>
            <MenuItem value="fbn">First Bank of Nigeria</MenuItem>
            <MenuItem value="zenith">Zenith Bank</MenuItem>
          </TextField>
          <TextField
            fullWidth
            placeholder="Amount"
            variant="outlined"
            size="small"
            slotProps={{
              input: { sx: { borderRadius: 1 } },
            }}
          />
        </Box>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleNext}
        sx={{
          py: 1.2,
          mb: 4,
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontWeight: 700,
          "&:hover": { backgroundColor: "var(--accent-gold-dim)" },
        }}
      >
        Proceed
      </Button>

      {/* Bottom Payment Type Dropdown */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            mb: 1,
          }}
        >
          Payment Type
        </Typography>
        <TextField
          select
          fullWidth
          variant="outlined"
          size="small"
          defaultValue="Transfer"
          placeholder="Payment Type"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletOutlinedIcon
                    sx={{ color: "var(--text-secondary)", fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            },
          }}
        >
          <MenuItem value="transfer">Transfer</MenuItem>
          <MenuItem value="card">Card</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}
