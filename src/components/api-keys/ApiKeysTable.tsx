import { useState } from "react";
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ApiKey } from "../../types/index.types";
import { formatDateTime } from "../../utils/format";
import AppTablePagination from "../common/AppTablePagination";
import {
  bodyCellSx as sharedBodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";

type KeyStatus = "Active" | "Revoked" | "Expired";

const STATUS_COLORS: Record<KeyStatus, string> = {
  Active: "#22C55E",
  Revoked: "#EF4444",
  Expired: "#788296",
};

const getKeyStatus = (apiKey: ApiKey): KeyStatus => {
  if (apiKey.revoked) return "Revoked";
  if (apiKey.expiry_date && new Date(apiKey.expiry_date).getTime() < Date.now())
    return "Expired";
  return "Active";
};

const formatOrNever = (value: string | null) =>
  value ? formatDateTime(value) : "Never";

const COLUMNS = ["Name / Prefix", "Status", "Created Date", "Last used", "Expires"];
const SKELETON_ROWS = 3;

// Text sizes match the Orders table.
const bodyCellSx = {
  ...sharedBodyCellSx,
  fontSize: 12,
  whiteSpace: "nowrap",
};

interface Props {
  keys: ApiKey[];
  loading: boolean;
}

export default function ApiKeysTable({ keys, loading }: Props) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const lastPage = Math.max(0, Math.ceil(keys.length / pageSize) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = keys.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <Box
      sx={{
       mt:4
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 760 }}>
          <TableHead sx={tableHeadSx}>
            <TableRow sx={headRowSx}>
              {COLUMNS.map((column) => (
                <TableCell key={column} sx={headCellSx}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, row) => (
                  <TableRow key={row}>
                    {COLUMNS.map((column) => (
                      <TableCell key={column} sx={bodyCellSx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : visible.map((apiKey) => {
                  const status = getKeyStatus(apiKey);
                  const color = STATUS_COLORS[status];
                  return (
                    <TableRow key={apiKey.id} sx={bodyRowSx}>
                      <TableCell sx={{ ...bodyCellSx, whiteSpace: "normal" }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                          {apiKey.name}
                        </Typography>
                        {/* Only the prefix exists after creation. */}
                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: "var(--text-secondary)",
                            wordBreak: "break-all",
                          }}
                        >
                          {apiKey.prefix}••••••••••••
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            fontSize: 12,
                            fontWeight: 500,
                            color,
                            // backgroundColor: `${color}1F`,
                          }}
                        >
                          {status}
                        </Box>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {formatDateTime(apiKey.created)}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {formatOrNever(apiKey.last_used_at)}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {formatOrNever(apiKey.expiry_date)}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <AppTablePagination
          count={keys.length}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
        />
      )}
    </Box>
  );
}
