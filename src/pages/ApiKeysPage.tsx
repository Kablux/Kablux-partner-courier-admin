import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { fetchApiKeys } from "../api/xhrHelper";
import ApiKeysTable from "../components/api-keys/ApiKeysTable";
import GenerateApiKeyDialog from "../components/api-keys/GenerateApiKeyDialog";
import AppButton from "../components/common/AppButton";
import ErrorState from "../components/common/ErrorState";
import { SECURITY_TIPS } from "../data/data";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const cardSx = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border-subtle, var(--border))",
  borderRadius: "14px",
};

function CenteredState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        ...cardSx,
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        textAlign: "center",
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
      <Typography
        sx={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420 }}
      >
        {body}
      </Typography>
      {action}
    </Box>
  );
}

export default function ApiKeysPage() {
  const dispatch = useAppDispatch();
  const { keys, access, loading, error } = useAppSelector((s) => s.apiKeys);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchApiKeys());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner = access === "allowed";
  const iconSx = { fontSize: 40, color: "var(--text-muted)", opacity: 0.6 };

  let content: React.ReactNode;
  if (access === "denied") {
    content = (
      <CenteredState
        icon={<LockOutlinedIcon sx={iconSx} />}
        title="Only the organization owner can manage API keys"
        body="Ask your organization's owner if you need a key for an integration."
      />
    );
  } else if (error) {
    content = (
      <Box sx={cardSx}>
        <ErrorState
          title="Couldn't load API keys"
          message={error}
          onRetry={load}
        />
      </Box>
    );
  } else if (!isOwner || (loading && keys.length === 0)) {
    content = <ApiKeysTable keys={[]} loading />;
  } else if (keys.length === 0) {
    content = (
      <CenteredState
        icon={<VpnKeyOutlinedIcon sx={iconSx} />}
        title="No API keys yet"
        body="Generate a key to connect your systems to Kablux."
        action={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ mt: 1, px: 3 }}
          >
            Generate key
          </AppButton>
        }
      />
    );
  } else {
    content = <ApiKeysTable keys={keys} loading={false} />;
  }

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700 }}>API Keys</Typography>
            <Typography
              sx={{ fontSize: 14, color: "var(--text-muted, var(--text-secondary))" }}
            >
              Create and review the keys your systems use to call Kablux
            </Typography>
          </Box>
          {isOwner && keys.length > 0 && (
            <AppButton
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ px: 3 }}
            >
              Generate key
            </AppButton>
          )}
        </Box>

        {content}

        {access !== "denied" && (
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, }}>
              💡
            </Typography>
            <Box component="ul">
              {SECURITY_TIPS.map((tip) => (
                <Typography
                  key={tip}
                  component="li"
                  sx={{ fontSize: 12, color: "#B4830B", lineHeight: 1.6, mb: 0.75 }}
                >
                  {tip}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <GenerateApiKeyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
