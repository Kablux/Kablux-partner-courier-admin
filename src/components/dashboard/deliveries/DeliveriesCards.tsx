import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { DeliverySlice } from "../../../types/index.types";
import { formatStatus, getStatusColor } from "./config";
import DeliveryDonut from "./Donut";
import DeliveryEmptyState from "./EmptyState";
import DeliveryLegend, { DeliveryLegendItem } from "./Legend";



interface Props {
  slices: DeliverySlice[];
}

export default function DeliveriesCard({
  slices,
}: Props) {
  const safeSlices = slices || [];

  /*
   * Total deliveries
   */
  const totalDeliveries = useMemo(() => {
    return safeSlices.reduce(
      (total, slice) =>
        total + Number(slice.count || 0),
      0
    );
  }, [safeSlices]);


  const breakdown = useMemo<DeliveryLegendItem[]>(() => {
    return safeSlices.map((slice) => {
      const count = Number(slice.count || 0);

      const percentage =
        totalDeliveries > 0
          ? Math.round(
              (count / totalDeliveries) * 100
            )
          : 0;

      return {
        status: slice.status,
        label: formatStatus(slice.status),
        value: count,
        percentage,
        color: getStatusColor(slice.status),
      };
    });
  }, [safeSlices, totalDeliveries]);

  const hasDeliveries = totalDeliveries > 0;

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(120,130,150,0.10)",
        boxShadow:
          "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        p: {
          xs: 2,
          sm: 3,
        },
        height: "100%",
        minHeight: 390,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Deliveries
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-secondary)",
              mt: 0.4,
            }}
          >
            Delivery status overview
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.5,
            py: 0.55,
            borderRadius: "4px",
            backgroundColor:
              "rgba(120,130,150,0.10)",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {safeSlices.length} status
        </Box>
      </Box>

      {/* Chart + Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: 1.5,
            sm: 2.5,
          },
          flexGrow: 1,
          flexWrap: {
            xs: "wrap",
            sm: "nowrap",
          },
        }}
      >
        <DeliveryDonut
          slices={safeSlices}
          total={totalDeliveries}
        />

        <DeliveryLegend
          items={breakdown}
        />
      </Box>

      {/* Empty state */}
      {!hasDeliveries && (
        <DeliveryEmptyState />
      )}
    </Box>
  );
}