import React, { useState } from "react";
import { Box, InputAdornment, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import toast from "react-hot-toast";
import { createWalletTopUp } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import AppButton from "../common/AppButton";
import AppModal from "../common/AppModal";
import AdminTextField from "../common/TextInput";
import { formatAmount } from "./walletFormat";

const FORM_ID = "fund-wallet-form";
const QUICK_AMOUNTS = [5000, 10000, 50000, 100000];

/** A positive amount with at most 2 decimal places. */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Only follow a real HTTPS checkout link. */
const isSafeCheckoutUrl = (url: string) => {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
};

interface Props {
  open: boolean;
  currency: string;
  onClose: () => void;
}

export default function FundWalletDialog({ open, currency, onClose }: Props) {
  const dispatch = useAppDispatch();
  const toppingUp = useAppSelector((s) => s.wallet.toppingUp);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (toppingUp) return;
    setAmount("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = amount.replace(/,/g, "").trim();
    if (!AMOUNT_PATTERN.test(clean) || Number(clean) <= 0) {
      setError("Enter an amount greater than 0, with up to 2 decimal places.");
      return;
    }

    const result = await dispatch(createWalletTopUp(Number(clean).toFixed(2)));

    if (createWalletTopUp.fulfilled.match(result)) {
      const url = result.payload.authorization_url;
      if (!isSafeCheckoutUrl(url)) {
        toast.error("The payment link looks invalid. Please try again.");
        return;
      }
      // Leave the panel for Paystack's checkout page.
      window.location.assign(url);
      return;
    }

    const err = result.payload;
    if (err?.status === 403) {
      toast.error("Only the organization owner can fund the wallet.");
      onClose();
      return;
    }
    const fieldMessage = err?.fieldErrors?.amount?.[0];
    if (fieldMessage) setError(fieldMessage);
    else toast.error(err?.message || "Couldn't start the payment. Please try again.");
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      maxWidth={500}
      title="Fund wallet"
      subtitle="You'll complete the payment securely on Paystack. Your balance updates once Paystack confirms the payment."
      disableClose={toppingUp}
      actions={
        <>
          <AppButton
            variant="outlined"
            onClick={handleClose}
            disabled={toppingUp}
            sx={{ px: 3, backgroundColor: "transparent", color: "var(--text-primary)" }}
          >
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} loading={toppingUp} sx={{ px: 3 }}>
            Continue to Paystack
          </AppButton>
        </>
      }
    >
      <Box component="form" id={FORM_ID} onSubmit={handleSubmit} noValidate sx={{ pt: 1 }}>
        <AdminTextField
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (error) setError(null);
          }}
          error={!!error}
          helperText={error || `Amount in ${currency}.`}
          inputMode="decimal"
          autoFocus
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">{currency === "NGN" ? "₦" : currency}</InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {QUICK_AMOUNTS.map((value) => (
            <AppButton
              key={value}
              variant="outlined"
              size="small"
              onClick={() => {
                setAmount(String(value));
                setError(null);
              }}
              disabled={toppingUp}
              sx={{
                px: 1.5,
                py: 0.5,
                fontSize: 12,
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle, var(--border))",
              }}
            >
              {formatAmount(value, currency).replace(/\.00$/, "")}
            </AppButton>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 2.5, color: "var(--text-muted)" }}>
          <LockOutlinedIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11.5 }}>
            Card details are entered on Paystack and never stored in Kablux.
          </Typography>
        </Box>
      </Box>
    </AppModal>
  );
}
