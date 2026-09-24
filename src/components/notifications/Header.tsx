import { Box, Typography } from "@mui/material";
import { NotificationReadFilter } from "../../types/index.types";
import NotificationFilters from "./Filters";

interface NotificationsHeaderProps {
  count: number;
  loading: boolean;
  filter: NotificationReadFilter;
  onFilterChange: (
    filter: NotificationReadFilter
  ) => void;
  onRefresh: () => void;
}

export default function NotificationsHeader({
  count,
  loading,
  filter,
  onFilterChange,
  onRefresh,
}: NotificationsHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Notifications
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: "var(--text-muted)",
            mt: 0.25,
          }}
        >
          {loading
            ? "Loading…"
            : `${count.toLocaleString()} ${
                count === 1
                  ? "notification"
                  : "notifications"
              }`}
        </Typography>
      </Box>

      <NotificationFilters
        filter={filter}
        onFilterChange={onFilterChange}
        onRefresh={onRefresh}
      />
    </Box>
  );
}