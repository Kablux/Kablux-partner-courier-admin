import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FinanceAnalyticsCard from "../components/dashboard/FinanceAnalyticsCard";
import PartnerStatCards from "../components/dashboard/PartnerStatCards";
import RidesHistoryTable from "../components/dashboard/RidesHistoryTable";

import { useAppDispatch, useAppSelector } from "../redux/hooks"; // adjust path
import { fetchDashboardData } from "../api/xhrHelper";
import DeliveriesCard from "../components/dashboard/deliveries/DeliveriesCards";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress sx={{ color: "var(--accent-gold)" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">Error loading dashboard: {error}</Typography>
    );
  }

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
    >
      {/* Row 1 — KPI cards */}
      <PartnerStatCards summary={data?.summary} />

      {/* Row 2 — finance analytics + deliveries */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.5fr 1fr",
          },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        <FinanceAnalyticsCard financials={data?.financials} />

        <DeliveriesCard slices={data?.deliveries?.slices || []} />
      </Box>

      {/* Row 3 — rides history (Keep dummy if backend doesn't provide this yet) */}
      <RidesHistoryTable rides={[]} />
    </Box>
  );
}
