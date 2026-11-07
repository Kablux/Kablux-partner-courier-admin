import { Box } from "@mui/material";
import { formatEnum, getOrderGroup, GROUP_COLORS } from "./utils";

const NEUTRAL = "#788296";

export default function OrderStatusChip({
  status,
}: {
  status?: string | null;
}) {
  const group = getOrderGroup(status);
  const color = group ? GROUP_COLORS[group] : NEUTRAL;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        // px: 1.25,
        // py: 0.4,
        // borderRadius: "4px",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        color,
        // backgroundColor: `${color}1F`,
      }}
    >
      {formatEnum(status)}
    </Box>
  );
}
