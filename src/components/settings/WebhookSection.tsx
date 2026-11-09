import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { saveWebhookEndpoint } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { WebhookEndpoint } from "../../types/index.types";
import AppButton from "../common/AppButton";
import AdminTextField from "../common/TextInput";
import SettingsCard, { SettingsField } from "./SettingsCard";
import WebhookSecretDialog from "./WebhookSecretDialog";

const FORM_ID = "webhook-endpoint-form";

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

function StatusBadge({ endpoint }: { endpoint: WebhookEndpoint | null }) {
  const [label, color] = !endpoint
    ? ["Not configured", "#788296"]
    : endpoint.enabled
      ? ["Enabled", "#22C55E"]
      : ["Disabled", "#EF4444"];

  return (
    <Box
      component="span"
      sx={{
        px: 1.25,
        py: 0.4,
        borderRadius: "4px",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        color,
        backgroundColor: `${color}1F`,
      }}
    >
      {label}
    </Box>
  );
}

export default function WebhookSection({
  endpoint,
}: {
  endpoint: WebhookEndpoint | null;
}) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.webhook.saving);

  const [url, setUrl] = useState(endpoint?.url ?? "");
  const [urlError, setUrlError] = useState<string | null>(null);
  // Held only here, in memory, and dropped on close. The backend won't return it again.
  const [secret, setSecret] = useState<string | null>(null);

  const trimmed = url.trim();
  const unchanged = trimmed === (endpoint?.url ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHttpsUrl(trimmed)) {
      setUrlError("Enter a valid URL that starts with https://");
      return;
    }

    const result = await dispatch(saveWebhookEndpoint(trimmed));

    if (saveWebhookEndpoint.fulfilled.match(result)) {
      setUrl(result.payload.endpoint.url);
      if (result.payload.secret) {
        setSecret(result.payload.secret);
      } else {
        toast.success("Webhook URL updated.");
      }
      return;
    }

    const err = result.payload;
    if (err?.status === 403) {
      toast.error("Only the organization owner can manage webhooks.");
      return;
    }
    const fieldMessage = err?.fieldErrors?.url?.[0];
    if (fieldMessage) setUrlError(fieldMessage);
    else toast.error(err?.message || "Couldn't save the webhook URL.");
  };

  return (
    <SettingsCard
      title="Webhooks"
      maxWidth={779}
      description="Kablux sends event notifications for your organization to this HTTPS endpoint. Each request is signed with your webhook secret so you can verify it came from Kablux."
      aside={<StatusBadge endpoint={endpoint} />}
    >
      <Box component="form" id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <SettingsField label="Endpoint URL" htmlFor="settings-webhook-url">
        <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "monospace",
              wordBreak: "break-all",
              my:0.5
            }}
          >
            {endpoint ? `ID: ${endpoint.endpoint_id}` : "No endpoint configured yet."}
          </Typography>
        <AdminTextField
          id="settings-webhook-url"
          placeholder="https://example.com/webhooks/kablux"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (urlError) setUrlError(null);
          }}
          error={!!urlError}
          helperText={
            urlError ||
            (endpoint
              ? "Updating the URL keeps the same endpoint and signing secret."
              : "Your signing secret will be shown once, right after the endpoint is created.")
          }
          type="url"
          fullWidth
        />
        </SettingsField>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3, flexWrap: "wrap" }}>
          <AppButton
            type="submit"
            form={FORM_ID}
            loading={saving}
            disabled={saving || !trimmed || unchanged}
            sx={{ px: 3 }}
          >
            {endpoint ? "Update webhook" : "Save webhook"}
          </AppButton>

        </Box>
      </Box>

      <WebhookSecretDialog secret={secret} onClose={() => setSecret(null)} />
    </SettingsCard>
  );
}
