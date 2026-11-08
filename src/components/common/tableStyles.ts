import { alpha, Theme } from "@mui/material";

/**
 * Shared table styles, taken from the Members table, so every table in the
 * panel has the same header, row hover and spacing.
 */

export const tableHeadSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.03)
      : alpha(theme.palette.common.black, 0.02),
};

export const headRowSx = {
  "& th": { borderBottom: "1px solid", borderColor: "divider" },
};

export const headCellSx = {
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "capitalize",
  color: "text.secondary",
  py: 2,
};

export const bodyRowSx = {
  transition: "background-color 0.15s ease-in-out",
  "&:hover": { backgroundColor: "action.hover" },
  "&:last-child td": { borderBottom: 0 },
};

export const bodyCellSx = {
  py: 1.8,
};
