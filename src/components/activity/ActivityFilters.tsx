import React, { useState } from "react";
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AppButton from "../common/AppButton";
import { actionLabel, KNOWN_ACTIONS } from "./activityFormat";

export type ActivityPeriod = "" | "today" | "yesterday" | "this_week" | "this_month";

export interface ActivityFilterState {
  action: string;
  actor_type: string;
  period: ActivityPeriod;
  created_after: string;
  created_before: string;
}

export const initialActivityFilters: ActivityFilterState = {
  action: "",
  actor_type: "",
  period: "",
  created_after: "",
  created_before: "",
};

const KNOWN_ACTOR_TYPES = ["USER"];

export const toCode = (value: string) =>
  value.trim().replace(/[\s.-]+/g, "_").toUpperCase();

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);


export const toDateRange = (
  filters: ActivityFilterState,
  now: Date = new Date(),
): { created_after?: string; created_before?: string } => {
  const today = startOfDay(now);
  switch (filters.period) {
    case "today":
      return { created_after: today.toISOString(), created_before: endOfDay(now).toISOString() };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { created_after: y.toISOString(), created_before: endOfDay(y).toISOString() };
    }
    case "this_week": {
      const monday = new Date(today);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      return { created_after: monday.toISOString(), created_before: endOfDay(now).toISOString() };
    }
    case "this_month":
      return {
        created_after: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        created_before: endOfDay(now).toISOString(),
      };
    default:
      return {
        created_after: filters.created_after
          ? new Date(`${filters.created_after}T00:00:00`).toISOString()
          : undefined,
        created_before: filters.created_before
          ? new Date(`${filters.created_before}T23:59:59.999`).toISOString()
          : undefined,
      };
  }
};

export const countActiveFilters = (f: ActivityFilterState) =>
  [f.action, f.actor_type, f.period || f.created_after || f.created_before].filter(Boolean).length;

const menuProps = {
  slotProps: {
    paper: {
      sx: {
        backgroundColor: "var(--bg-card, #1E1E1E)",
        backgroundImage: "none",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
      },
    },
  },
};

const dateFieldSx = {
  flex: 1,
  "& input::-webkit-calendar-picker-indicator": {
    filter: "invert(0.75)",
    cursor: "pointer",
  },
};

interface ActivityFiltersProps {
  filters: ActivityFilterState;
  onChange: (filters: ActivityFilterState) => void;
}

export default function ActivityFilters({ filters, onChange }: ActivityFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ActivityFilterState>(filters);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const activeCount = countActiveFilters(filters);

  const handleOpen = () => {
    setTempFilters(filters);
    setRangeError(null);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const setText = (field: "action" | "actor_type") => (value: string) =>
    setTempFilters((prev) => ({ ...prev, [field]: value }));

  const handlePeriodChange = (e: SelectChangeEvent<string>) => {
    setRangeError(null);
    setTempFilters((prev) => ({
      ...prev,
      period: e.target.value as ActivityPeriod,
      created_after: "",
      created_before: "",
    }));
  };

  const handleCreatedChange =
    (key: "created_after" | "created_before") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRangeError(null);
      setTempFilters((prev) => ({ ...prev, [key]: e.target.value, period: "" }));
    };

  const handleApply = () => {
    const { created_after, created_before } = tempFilters;
    if (created_after && created_before && created_after > created_before) {
      setRangeError("The start date must be on or before the end date.");
      return;
    }
    onChange({
      ...tempFilters,
      action: tempFilters.action ? toCode(tempFilters.action) : "",
      actor_type: tempFilters.actor_type ? toCode(tempFilters.actor_type) : "",
    });
    handleClose();
  };

  const handleReset = () => {
    setTempFilters(initialActivityFilters);
    setRangeError(null);
    onChange(initialActivityFilters);
    handleClose();
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outlined"
        color="inherit"
        startIcon={
          <Badge badgeContent={activeCount} color="error">
            <FilterListIcon />
          </Badge>
        }
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderColor: "divider",
          borderWidth: 2,
          color: "text.primary",
          "&:hover": { borderColor: "var(--accent-gold-dim)", color: "var(--accent-gold)" },
        }}
      >
        Filters
      </Button>

      {/* Right-side drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 380 },
              backgroundColor: "var(--bg-card)",
              backgroundImage: "none",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Filter activity</Typography>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Narrow the log by action, actor or date.
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small" aria-label="Close filters">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* Body (scrolls) */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
            <Stack spacing={3}>
              <Autocomplete
                freeSolo
                options={KNOWN_ACTIONS}
                inputValue={tempFilters.action}
                onInputChange={(_, value) => setText("action")(value)}
                renderOption={(props, option) => {
                  const { key, ...rest } = props as typeof props & { key: React.Key };
                  return (
                    <Box component="li" key={key} {...rest}>
                      <Box>
                        <Typography sx={{ fontSize: 13 }}>{actionLabel(option)}</Typography>
                        <Typography
                          sx={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace" }}
                        >
                          {option}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
                slotProps={{ paper: menuProps.slotProps.paper }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Action"
                    placeholder="e.g. API_KEY_CREATED"
                    helperText="Pick an action or type any action code."
                  />
                )}
              />

              <Autocomplete
                freeSolo
                options={KNOWN_ACTOR_TYPES}
                inputValue={tempFilters.actor_type}
                onInputChange={(_, value) => setText("actor_type")(value)}
                slotProps={{ paper: menuProps.slotProps.paper }}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Actor type" placeholder="e.g. USER" />
                )}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="activity-period-label">Date</InputLabel>
                <Select
                  labelId="activity-period-label"
                  value={tempFilters.period}
                  label="Date"
                  onChange={handlePeriodChange}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>All time</em>
                  </MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="this_week">This week</MenuItem>
                  <MenuItem value="this_month">This month</MenuItem>
                </Select>
              </FormControl>

              {/* Custom date range (replaces the period above) */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", mb: 1, display: "block" }}
                >
                  Or a custom date range
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    size="small"
                    label="From"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.created_after}
                    onChange={handleCreatedChange("created_after")}
                    error={!!rangeError}
                    sx={dateFieldSx}
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="To"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.created_before}
                    onChange={handleCreatedChange("created_before")}
                    error={!!rangeError}
                    sx={dateFieldSx}
                  />
                </Stack>
                {rangeError && (
                  <Typography role="alert" sx={{ fontSize: 11.5, color: "error.main", mt: 0.75 }}>
                    {rangeError}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Footer (sticky actions) */}
          <Box
            sx={{
              p: 2.5,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ textTransform: "none", borderColor: "divider" }}
            >
              Reset
            </Button>
            <AppButton fullWidth onClick={handleApply} sx={{ px: 2 }}>
              Apply filters
            </AppButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
