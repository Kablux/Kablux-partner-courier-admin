import { useCallback, useEffect } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { fetchWebhookEndpoint } from "../api/xhrHelper";
import ErrorState from "../components/common/ErrorState";
import AccountSection from "../components/settings/AccountSection";
import { settingsCardSx } from "../components/settings/SettingsCard";
import WebhookSection from "../components/settings/WebhookSection";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { endpoint, access, error } = useAppSelector((s) => s.webhook);

  // The webhook endpoint is OWNER only, so its answer also decides access to this page.
  const load = useCallback(() => {
    dispatch(fetchWebhookEndpoint());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  let content: React.ReactNode;
  if (access === "denied") {
    content = (
      <Box
        sx={{
          ...settingsCardSx,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 40, color: "var(--text-muted)", opacity: 0.6 }} />
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          Only the organization owner can manage settings
        </Typography>
        <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420 }}>
          Ask your organization's owner if you need changes to the account or webhook
          configuration.
        </Typography>
      </Box>
    );
  } else if (error) {
    content = (
      <Box sx={settingsCardSx}>
        <ErrorState title="Couldn't load settings" message={error} onRetry={load} />
      </Box>
    );
  } else if (access !== "allowed") {

    content = [260, 220].map((height) => (
      <Skeleton
        key={height}
        variant="rectangular"
        height={height}
        sx={{ borderRadius: "8px", maxWidth: 600 }}
      />
    ));
  } else {
    content = (
      <>
        <AccountSection />
       
        <WebhookSection endpoint={endpoint} />
      </>
    );
  }

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 5 }}>
      <Box>
        <Typography component="h1" sx={{ fontSize: 24, fontWeight: 700 }}>Settings</Typography>
        <Typography sx={{ fontSize: 14, color: "var(--text-secondary)", mt: 0.75 }}>
          Manage your account details and webhook configuration.
        </Typography>
      </Box>

      {content}
    </Box>
  );
}
