import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import toast from "react-hot-toast";
import AppButton from "../common/AppButton";
import AppModal from "../common/AppModal";

interface Props {
  /** The one-time signing secret. The dialog is open while this is set. */
  secret: string | null;
  onClose: () => void;
}

export default function WebhookSecretDialog({ secret, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  const handleCopy = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Signing secret copied");
    } catch {
      toast.error("Couldn't copy automatically. Select the secret and copy it.");
    }
  };

  return (
    <AppModal
      open={!!secret}
      onClose={handleClose}
      maxWidth={500}
      title="Your webhook signing secret"
      subtitle="Your webhook receiver has been created. Use this secret to verify that incoming requests were sent by Kablux."
      // Closing loses the secret for good, so only the explicit button closes it.
      disableClose
      showCloseButton={false}
      actions={
        <AppButton onClick={handleClose} sx={{ px: 3 }}>
          I've stored this secret
        </AppButton>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          role="alert"
          sx={{
            display: "flex",
            gap: 1,
            p: 1.5,
            borderRadius: "8px",
            backgroundColor: "rgba(245,197,24,0.08)",
            border: "1px solid rgba(245,197,24,0.28)",
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: "#D9A400", fontSize: 20 }} />
          <Typography sx={{ fontSize: 12, color: "#B4830B", lineHeight: 1.5 }}>
            Copy this secret now and store it securely. For security reasons, it
            will not be displayed again. Changing the URL later keeps the same
            secret.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: "10px",
            backgroundColor: "var(--bg-secondary, rgba(120,130,150,0.08))",
            border: "1px solid var(--border-subtle, var(--border))",
          }}
        >
          <Typography
            data-testid="webhook-secret"
            sx={{
              flex: 1,
              fontFamily: "monospace",
              fontSize: 13.5,
              wordBreak: "break-all",
              userSelect: "all",
            }}
          >
            {secret}
          </Typography>
          <Button
            onClick={handleCopy}
            startIcon={copied ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : undefined}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: "8px",
              px: 2,
              flexShrink: 0,
              color: copied ? "#22c55eae" : "var(--text-primary)",
              border: "1px solid var(--border-subtle, var(--border))",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </Box>
      </Box>
    </AppModal>
  );
}
