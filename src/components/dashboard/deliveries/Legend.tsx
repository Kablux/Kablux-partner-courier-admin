import { Box, Typography } from "@mui/material";

export interface DeliveryLegendItem {
  status: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface DeliveryLegendProps {
  items: DeliveryLegendItem[];
}

export default function DeliveryLegend({
  items,
}: DeliveryLegendProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.15,
        minWidth: 0,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.status}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          {/* Status indicator */}
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: item.color,
              flexShrink: 0,
            }}
          />

          {/* Label */}
          <Typography
            sx={{
              fontSize: 12.5,
              color:
                "var(--text-secondary, var(--text-muted))",
              flexGrow: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </Typography>

          {/* Count */}
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 700,
              minWidth: 28,
              textAlign: "right",
            }}
          >
            {item.value}
          </Typography>

          {/* Percentage */}
          <Typography
            sx={{
              fontSize: 10.5,
              color: "var(--text-muted)",
              minWidth: 34,
              textAlign: "right",
            }}
          >
            {item.percentage}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
}