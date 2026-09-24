import { Box, Typography } from "@mui/material";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { NotificationReadFilter } from "../../types/index.types";

interface NotificationsEmptyStateProps {
  filter: NotificationReadFilter;
}

export default function NotificationsEmptyState({
  filter,
}: NotificationsEmptyStateProps) {
  const isUnread = filter === "unread";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 1.5,
      }}
    >
      <InboxRoundedIcon
        sx={{
          fontSize: 40,
          color: "var(--text-muted)",
          opacity: 0.5,
        }}
      />

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          textTransform: "capitalize",
          color: "var(--text-primary)",
        }}
      >
        {isUnread
          ? "You're all caught up"
          : "No notifications yet"}
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        {isUnread
          ? "New activity for your organization will show up here."
          : "Organization activity will show up here as it happens."}
      </Typography>
    </Box>
  );
}