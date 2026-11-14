import { useState } from "react";
import {
  Box,
  // Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useAppSelector } from "../../redux/hooks";
import { ApiKey } from "../../types/index.types";
import RevokeApiKeyDialog from "./RevokeApiKeyDialog";
import { formatDateTime } from "../../utils/format";
import AppTablePagination from "../common/AppTablePagination";
import {
  bodyCellSx as sharedBodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";
import AppButton from "../common/AppButton";

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

const COLUMNS = ["Name / Prefix", "Status", "Created Date", "Last used", "Expires", "Actions"];
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
  const revokingId = useAppSelector((s) => s.apiKeys.revokingId);
  const [toRevoke, setToRevoke] = useState<ApiKey | null>(null);
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
                  const isRevoked = apiKey.revoked;
                  // Revoked keys stay listed for reference but read as inactive.
                  const cellSx = isRevoked
                    ? { ...bodyCellSx, color: "var(--text-muted)" }
                    : bodyCellSx;
                  return (
                    <TableRow key={apiKey.id} sx={bodyRowSx}>
                      <TableCell sx={{ ...cellSx, whiteSpace: "normal" }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isRevoked ? "var(--text-secondary)" : undefined,
                          }}
                        >
                          {apiKey.name}
                        </Typography>
                        {/* Only the prefix exists after creation. */}
                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: isRevoked ? "var(--text-muted)" : "var(--text-secondary)",
                            textDecoration: isRevoked ? "line-through" : "none",
                            wordBreak: "break-all",
                          }}
                        >
                          {apiKey.prefix}••••••••••••
                        </Typography>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 1.25,
                            py: 0.4,
                            borderRadius: "999px",
                            fontSize: 12,
                            fontWeight: 500,
                            color,
                            backgroundColor: `${color}14`,
                            border: `1px solid ${color}33`,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: color,
                            }}
                          />
                          {status}
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {formatDateTime(apiKey.created)}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {formatOrNever(apiKey.last_used_at)}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {isRevoked ? "—" : formatOrNever(apiKey.expiry_date)}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {isRevoked ? (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontSize: 12,
                              color: "var(--text-muted)",
                            }}
                          >
                            <BlockRoundedIcon sx={{ fontSize: 14 }} />
                            Disabled
                          </Box>
                        ) : (
                          <AppButton
                            size="small"
                            onClick={() => setToRevoke(apiKey)}
                            disabled={revokingId === apiKey.id}
                            sx={{
                              px: 3,
                              fontSize: 12,
                              border: "2px solid var(--border)",
                              backgroundColor: "transparent",
                              color: "#c75245",
                              "&:hover": {
                                border: "1px solid var(--accent-gold)",
                              },
                            }}
                          >
                            Revoke
                          </AppButton>
                        )}
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

      <RevokeApiKeyDialog apiKey={toRevoke} onClose={() => setToRevoke(null)} />
    </Box>
  );
}
