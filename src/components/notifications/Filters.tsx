import {
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { NotificationReadFilter } from "../../types/index.types";
import { FILTERS, GOLD } from "./utils";


interface NotificationFiltersProps {
  filter: NotificationReadFilter;
  onFilterChange: (filter: NotificationReadFilter) => void;
  onRefresh: () => void;
}

export default function NotificationFilters({
  filter,
  onFilterChange,
  onRefresh,
}: NotificationFiltersProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          p: 0.5,
          borderRadius: "10px",
          backgroundColor: "rgba(120,130,150,0.1)",
        }}
      >
        {FILTERS.map((item) => {
          const active = filter === item.key;

          return (
            <Box
              key={item.key}
              onClick={() => onFilterChange(item.key)}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                userSelect: "none",
                color: active
                  ? "#000"
                  : "var(--text-muted)",
                backgroundColor: active
                  ? GOLD
                  : "transparent",
                transition:
                  "background-color 0.15s ease",
              }}
            >
              {item.label}
            </Box>
          );
        })}
      </Box>

      {/* Refresh */}
      <Tooltip title="Refresh">
        <IconButton
          size="small"
          onClick={onRefresh}
          sx={{
            color: "var(--text-muted)",
          }}
        >
          <RefreshRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}