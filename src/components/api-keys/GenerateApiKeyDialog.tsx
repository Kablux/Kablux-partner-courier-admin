import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import toast from "react-hot-toast";
import { createApiKey } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { CreatedApiKey } from "../../types/index.types";
import AppButton from "../common/AppButton";
import AppModal from "../common/AppModal";
import AdminTextField from "../common/TextInput";

const FORM_ID = "generate-api-key-form";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GenerateApiKeyDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const creating = useAppSelector((s) => s.apiKeys.creating);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    if (creating) return;
    setName("");
    setNameError(null);
    setCreated(null);
    setCopied(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Please enter a name for this key.");
      return;
    }

    const result = await dispatch(createApiKey(trimmed));

    if (createApiKey.fulfilled.match(result)) {
      setCreated(result.payload);
      return;
    }

    const err = result.payload;
    if (err?.status === 403) {
      toast.error("Only the organization owner can create API keys.");
      handleClose();
      return;
    }
    const fieldMessage = err?.fieldErrors?.name?.[0];
    if (fieldMessage) setNameError(fieldMessage);
    else toast.error(err?.message || "Couldn't create the API key.");
  };

  const handleCopy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.key);
      setCopied(true);
      toast.success("API key copied");
    } catch {
      toast.error("Couldn't copy automatically. Select the key and copy it.");
    }
  };

  if (created) {
    return (
      <AppModal
        open={open}
        onClose={handleClose}
        maxWidth={500}
        title="Your new API key"
        subtitle={`"${created.name}" has been created and is ready to use.`}
        // Closing loses the key for good, so only the explicit button closes it.
        disableClose
        showCloseButton={false}
        actions={
          <AppButton onClick={handleClose} sx={{ px: 3 }}>
            I've stored this key
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
              Copy this key now and store it securely. For security reasons, it
              will not be displayed again. If it is lost, you will need to
              generate a new key.
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
              data-testid="new-api-key"
              sx={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: 13.5,
                wordBreak: "break-all",
                userSelect: "all",
              }}
            >
              {created.key}
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

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      maxWidth={500}
      title="Generate API key"
      subtitle="Create a new key. The full key is shown only once, immediately after creation. Your existing keys will remain active."
      disableClose={creating}
      actions={
        <>
          <AppButton
            variant="outlined"
            onClick={handleClose}
            disabled={creating}
            sx={{ px: 3, backgroundColor: "transparent", color: "var(--text-primary)" }}
          >
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} loading={creating} sx={{ px: 3 }}>
            Generate key
          </AppButton>
        </>
      }
    >
      <Box component="form" id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <AdminTextField
          label="Key name"
          placeholder="e.g. Production server"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          error={!!nameError}
          helperText={
            nameError ||
            "Use a descriptive name that identifies where this key will be used."
          }
          autoFocus
          fullWidth
          sx={{ my: 2 }}
        />
      </Box>
    </AppModal>
  );
}
