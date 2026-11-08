import { TablePagination } from "@mui/material";

/** Lists this short fit on one page, so the bar is hidden. */
const MIN_ROWS_FOR_PAGINATION = 10;

interface AppTablePaginationProps {
  count: number;
  /** Zero-based, as MUI expects. */
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function AppTablePagination({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: AppTablePaginationProps) {
  if (count <= MIN_ROWS_FOR_PAGINATION) return null;

  return (
    <TablePagination
      component="div"
      count={count}
      page={Math.max(0, page)}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) =>
        onPageSizeChange(parseInt(e.target.value, 10))
      }
      sx={{
        width: "100%",
        color: "var(--text-secondary, #C1C7D0)",
        "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
      }}
    />
  );
}
