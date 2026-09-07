import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { toast } from "react-toastify";
import { ApiKey } from "../../types/common.types";

// Mask the middle of the key, keeping a readable prefix + last 4 chars.
const maskKey = (key: string) => {
  const head = key.length > 16 ? key.slice(0, 12) : key.slice(0, 6);
  return `${head}••••••••${key.slice(-4)}`;
};

export default function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  const [revealed, setRevealed] = useState(false); // secure-by-default: masked
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key); // always copies the real key
      setCopied(true);
      toast.success(`${apiKey.name} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the key");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle, var(--border))",
        borderRadius: "14px",
        p: 3,
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1.5 }}>
        {apiKey.name}
      </Typography>

      {/* Key field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderRadius: "10px",
          backgroundColor: "var(--bg-secondary, rgba(120,130,150,0.08))",
          border: "1px solid var(--border-subtle, var(--border))",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 13.5,
            color: "var(--text-primary)",
            wordBreak: "break-all",
            mr: 1,
          }}
        >
          {revealed ? apiKey.key : maskKey(apiKey.key)}
        </Typography>
        <IconButton
          onClick={() => setRevealed((r) => !r)}
          size="small"
          aria-label={revealed ? "Hide API key" : "Reveal API key"}
          sx={{ color: "var(--text-muted, var(--text-secondary))", flexShrink: 0 }}
        >
          {revealed ? (
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 12.5, color: "var(--text-muted, var(--text-secondary))" }}>
          Last used: {apiKey.lastUsed}
        </Typography>
        <Button
          onClick={handleCopy}
          startIcon={
            copied ? (
              <CheckRoundedIcon sx={{ fontSize: 16 }} />
            ) : undefined
          }
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "8px",
            px: 2,
            height: 34,
            color: copied ? "#22C55E" : "var(--text-primary)",
            border: "1px solid var(--border-subtle, var(--border))",
            "&:hover": {
              borderColor: "var(--accent-gold, #FFD700)",
              backgroundColor: "rgba(255,255,255,0.03)",
            },
          }}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </Box>
    </Box>
  );
}