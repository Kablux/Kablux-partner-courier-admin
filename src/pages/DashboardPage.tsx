import React from "react";
import { Box } from "@mui/material";
import DeliveriesCard from "../components/dashboard/DeliveriesCard";
import FinanceAnalyticsCard from "../components/dashboard/FinanceAnalyticsCard";
import PartnerStatCards from "../components/dashboard/PartnerStatCards";
import RidesHistoryTable from "../components/dashboard/RidesHistoryTable";
import { PARTNER_STATS, DELIVERIES, RIDES_HISTORY } from "../data/data";
export default function SOSPage() {
  return (
      <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
    >
      {/* Row 1 — KPI cards */}
      <PartnerStatCards stats={PARTNER_STATS} />
 
      {/* Row 2 — finance analytics + deliveries */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        <FinanceAnalyticsCard />
        <DeliveriesCard
          overall={DELIVERIES.overall}
          breakdown={DELIVERIES.breakdown}
        />
      </Box>
 
      {/* Row 3 — rides history */}
      <RidesHistoryTable rides={RIDES_HISTORY} />
    </Box>
  );
}
