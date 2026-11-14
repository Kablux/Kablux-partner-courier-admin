import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import { revokeApiKey } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ApiKey } from "../../types/index.types";
import AppButton from "../common/AppButton";
import AppModal from "../common/AppModal";

interface Props {
  apiKey: ApiKey | null;
  onClose: () => void;
}

export default function RevokeApiKeyDialog({ apiKey, onClose }: Props) {
  const dispatch = useAppDispatch();
  const revokingId = useAppSelector((s) => s.apiKeys.revokingId);
  const revoking = Boolean(apiKey && revokingId === apiKey.id);

  const handleClose = () => {
    if (revoking) return;
    onClose();
  };

  const handleRevoke = async () => {
    if (!apiKey) return;
    const result = await dispatch(revokeApiKey(apiKey.id));

    if (revokeApiKey.fulfilled.match(result)) {
      toast.success(`"${apiKey.name}" has been revoked.`);
      onClose();
      return;
    }

    const err = result.payload;
    if (err?.status === 403) {
      toast.error("Only the organization owner can revoke API keys.");
      onClose();
      return;
    }
    if (err?.status === 404) {
      toast.error("This key no longer exists.");
      onClose();
      return;
    }
    toast.error(err?.message || "Couldn't revoke the API key.");
  };

  return (
    <AppModal
      open={Boolean(apiKey)}
      onClose={handleClose}
      maxWidth={460}
      title="Revoke this API key?"
      disableClose={revoking}
      actions={
        <>
          <AppButton
            variant="outlined"
            onClick={handleClose}
            disabled={revoking}
            sx={{ px: 3, backgroundColor: "transparent", color: "var(--text-primary)",border: "2px solid var(--border)", "&:hover": { border: "1px solid var(--accent-gold)" } }}
          >
            Cancel
          </AppButton>
          <AppButton
            variant="outlined"
            onClick={handleRevoke}
            loading={revoking}
            sx={{
              px: 3,
              backgroundColor: "transparent",
              border: "2px solid var(--border)",
              color: "#c75245",
              "&:hover": {
                borderColor: "1px solid var(--accent-gold)",
              },
            }}
          >
            Revoke key
          </AppButton>
        </>
      }
    >
      <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
        Requests using <strong>{apiKey?.name}</strong> will no longer be
        authorized. Create a replacement key first if your application needs it.
      </Typography>
    </AppModal>
  );
}
