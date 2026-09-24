import { Box, Pagination } from "@mui/material";
import { GOLD } from "./utils";


interface NotificationsPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function NotificationsPagination({
  page,
  totalPages,
  onChange,
}: NotificationsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onChange(value)}
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "var(--text-muted)",
          },

          "& .Mui-selected": {
            backgroundColor: `${GOLD} !important`,
            color: "#000 !important",
            fontWeight: 700,
          },
        }}
      />
    </Box>
  );
}