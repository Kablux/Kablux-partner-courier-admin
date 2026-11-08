import { Box } from "@mui/material";
import {
  NotificationItem,
  NotificationReadFilter,
} from "../../types/index.types";
import NotificationsEmptyState from "./EmptyState";
import ErrorState from "../common/ErrorState";
import NotificationRow from "./Row";
import NotificationsSkeleton from "./Loader";
import NotificationsLoader from "./Loader";



interface NotificationListProps {
  results: NotificationItem[];
  loading: boolean;
  error: string | null;
  filter: NotificationReadFilter;
  onRetry: () => void;
}

export default function NotificationList({
  results,
  loading,
  error,
  filter,
  onRetry,
}: NotificationListProps) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(120,130,150,0.10)",
        borderRadius: 1,
        p: 2,
      }}
    >
      {loading ? (
        <NotificationsLoader />
      ) : error ? (
        <ErrorState
          title="Couldn't load notifications"
          message={error}
          onRetry={onRetry}
        />
      ) : results.length === 0 ? (
        <NotificationsEmptyState filter={filter} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {results.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}