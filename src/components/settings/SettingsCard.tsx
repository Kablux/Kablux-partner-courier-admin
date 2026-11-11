import React from "react";
import { Box, Typography } from "@mui/material";

export const settingsCardSx = {
  maxWidth: 600,
};

interface Props {
  title: string;
  description?: string;
  aside?: React.ReactNode;
  maxWidth?: number;
  children: React.ReactNode;
}

export default function SettingsCard({
  title,
  description,
  aside,
  maxWidth,
  children,
}: Props) {
  return (
    <Box component="section" sx={{ ...settingsCardSx, ...(maxWidth && { maxWidth }) }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
          {title}
        </Typography>
        {aside}
      </Box>
      {description && (
        <Typography sx={{ fontSize: 14, maxWidth:579, color: "var(--text-secondary)", mt: 0.75 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ mt: 3 }}>{children}</Box>
    </Box>
  );
}

export function SettingsField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
      <Typography
        component="label"
        htmlFor={htmlFor}
        sx={{ display: "block", fontSize: 14, fontWeight: 600}}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}
