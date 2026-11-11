import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { fetchActivityLog } from "../api/xhrHelper";
import ActivityFilters, {
  ActivityFilterState,
  countActiveFilters,
  initialActivityFilters,
  toDateRange,
} from "../components/activity/ActivityFilters";
import ActivityLogTable from "../components/activity/ActivityLogTable";
import { OwnerOnlyState } from "../components/common/CenteredState";
import ErrorState from "../components/common/ErrorState";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function ActivityLogPage() {
  const dispatch = useAppDispatch();
  const { entries, count, access, loading, error } = useAppSelector((s) => s.activityLog);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ActivityFilterState>(initialActivityFilters);

  const load = useCallback(() => {
    dispatch(
      fetchActivityLog({
        page: page + 1,
        page_size: pageSize,
        action: filters.action || undefined,
        actor_type: filters.actor_type || undefined,
        ...toDateRange(filters),
      }),
    );
  }, [dispatch, page, pageSize, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const isFiltered = countActiveFilters(filters) > 0;

  const handleFiltersChange = (next: ActivityFilterState) => {
    setFilters(next);
    setPage(0);
  };

  let content: React.ReactNode;
  if (access === "denied") {
    content = (
      <OwnerOnlyState
        title="Only the organization owner can view the activity log"
        body="Ask your organization's owner if you need details about past account activity."
      />
    );
  } else if (error) {
    content = <ErrorState title="Couldn't load the activity log" message={error} onRetry={load} />;
  } else {
    content = (
      <ActivityLogTable
        entries={entries}
        count={count}
        loading={loading || access === "unknown"}
        filtered={isFiltered}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0);
        }}
      />
    );
  }

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3 }}>
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
          <Typography component="h1" sx={{ fontSize: 24, fontWeight: 700 }}>
            Activity Log
          </Typography>
          <Typography sx={{ fontSize: 14, color: "var(--text-muted, var(--text-secondary))" }}>
            A record of actions taken in your organization.
          </Typography>
        </Box>
        {access !== "denied" && (
          <ActivityFilters filters={filters} onChange={handleFiltersChange} />
        )}
      </Box>
      {content}
    </Box>
  );
}
