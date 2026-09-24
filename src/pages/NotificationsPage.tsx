import { useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import { fetchNotifications } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setNotificationsFilter,
  setNotificationsPage,
} from "../redux/slices/Notifications";
import { NotificationReadFilter } from "../types/index.types";
import NotificationsHeader from "../components/notifications/Header";
import NotificationList from "../components/notifications/List";
import NotificationsPagination from "../components/notifications/Pagination";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();

  const { results, count, page, pageSize, filter, loading, error } =
    useAppSelector((state) => state.notifications);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const load = useCallback(() => {
    dispatch(
      fetchNotifications({
        is_read: filter === "all" ? undefined : filter === "read",

        page,
        page_size: pageSize,
      }),
    );
  }, [dispatch, filter, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilterChange = (nextFilter: NotificationReadFilter) => {
    if (nextFilter === filter) return;

    dispatch(setNotificationsFilter(nextFilter));
  };

  const handlePageChange = (nextPage: number) => {
    dispatch(setNotificationsPage(nextPage));
  };

  return (
    <Box
      className="fade-in"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 1,
      }}
    >
      <NotificationsHeader
        count={count}
        loading={loading}
        filter={filter}
        onFilterChange={handleFilterChange}
        onRefresh={load}
      />

      <NotificationList results={results} loading={loading} filter={filter} />

      {!loading && results.length > 0 && (
        <NotificationsPagination
          page={page}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}
    </Box>
  );
}
