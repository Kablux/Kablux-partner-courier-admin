import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import AppButton from "../common/AppButton";
import AdminTextField from "../common/TextInput";
import SettingsCard, { SettingsField } from "./SettingsCard";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function AccountSection() {
  const user = useAppSelector((s) => s.auth.user);

  const name = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((part) => capitalize(String(part)))
    .join(" ");
  const email = (user?.email as string | undefined) || "";

  return (
    <SettingsCard title="Account" maxWidth={500}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <SettingsField label="Name" htmlFor="settings-name">
          <AdminTextField
            id="settings-name"
            value={name}
            placeholder="Not provided"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </SettingsField>

        <SettingsField label="Email" htmlFor="settings-email">
          <AdminTextField
            id="settings-email"
            value={email}
            placeholder="Not provided"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </SettingsField>
      </Box>

      <Box sx={{  mt: 2 }}>
        <AppButton disabled sx={{ px: 3 }}>
          Save account
        </AppButton>

      </Box>
    </SettingsCard>
  );
}
