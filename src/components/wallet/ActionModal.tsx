import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { WalletActionType } from "../../types/common.types";

export interface WalletActionPayload {
  amount: number;
  recipient?: string;
  note?: string;
}

const CONFIG: Record<
  WalletActionType,
  { title: string; cta: string; recipientLabel?: string; noteLabel: string }
> = {
  deposit: { title: "Deposit", cta: "Deposit", noteLabel: "Note (optional)" },
  withdraw: { title: "Withdraw", cta: "Withdraw", noteLabel: "Note (optional)" },
  send: {
    title: "Send Money",
    cta: "Send",
    recipientLabel: "Recipient",
    noteLabel: "Note (optional)",
  },
  request: {
    title: "Request Money",
    cta: "Send Request",
    recipientLabel: "Request from",
    noteLabel: "Reason (optional)",
  },
  invoice: {
    title: "Create Invoice",
    cta: "Create Invoice",
    recipientLabel: "Client",
    noteLabel: "Description",
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 14,
    color: "var(--text-primary)",
    backgroundColor: "rgba(120,130,150,0.05)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #F5C518)" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-muted, var(--text-secondary))" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-gold, #F5C518)" },
};

interface Props {
  action: WalletActionType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: WalletActionType, payload: WalletActionPayload) => void;
}

export default function WalletActionModal({
  action,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setRecipient("");
      setNote("");
      setSubmitting(false);
    }
  }, [isOpen, action]);

  if (!action) return null;
  const cfg = CONFIG[action];

  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    if (cfg.recipientLabel && !recipient.trim()) return;

    // No backend yet — simulate the request, then hand back to the parent.
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(action, {
        amount: value,
        recipient: recipient.trim() || undefined,
        note: note.trim() || undefined,
      });
      setSubmitting(false);
      onClose();
    }, 700);
  };

  const disabled =
    submitting ||
    !Number(amount) ||
    Number(amount) <= 0 ||
    (!!cfg.recipientLabel && !recipient.trim());

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #111)",
          borderRadius: "18px",
          maxWidth: 440,
          width: "100%",
          p: 4,
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{cfg.title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "secondary.main" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Amount (₦)"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder="0.00"
          inputMode="decimal"
          fullWidth
          autoFocus
          sx={fieldSx}
        />

        {cfg.recipientLabel && (
          <TextField
            label={cfg.recipientLabel}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={
              action === "invoice" ? "Client name" : "Name, email or phone"
            }
            fullWidth
            sx={fieldSx}
          />
        )}

        <TextField
          label={cfg.noteLabel}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={fieldSx}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            height: 42,
            px: 2,
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 600,
            borderRadius: "10px",
            color: "var(--text-primary)",
            border: "1px solid var(--border, rgba(255,255,255,0.15))",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          sx={{
            height: 42,
            px: 3,
            minWidth: 130,
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 700,
            borderRadius: "10px",
            backgroundColor: "var(--accent-gold, #F5C518)",
            color: "#000",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "var(--accent-gold, #F5C518)",
              boxShadow: "0 4px 12px rgba(245,197,24,0.3)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(120,130,150,0.2)",
              color: "rgba(120,130,150,0.7)",
            },
          }}
        >
          {submitting ? (
            <CircularProgress size={18} sx={{ color: "#000" }} />
          ) : (
            cfg.cta
          )}
        </Button>
      </Box>
    </Dialog>
  );
}