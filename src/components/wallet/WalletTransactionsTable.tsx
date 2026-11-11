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
import CallReceivedRoundedIcon from "@mui/icons-material/CallReceivedRounded";
import CallMadeRoundedIcon from "@mui/icons-material/CallMadeRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { WalletTransaction } from "../../types/index.types";
import { formatDateTime } from "../../utils/format";
import AppTablePagination from "../common/AppTablePagination";
import {
  bodyCellSx as sharedBodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";
import {
  directionOf,
  formatAmount,
  humanizeCode,
  statusTone,
  TONE_COLORS,
} from "./walletFormat";

const COLUMNS = ["Transaction", "Direction", "Amount", "Status", "Date"];
const SKELETON_ROWS = 5;

// Text sizes match the Orders table.
const bodyCellSx = { ...sharedBodyCellSx, fontSize: 12 };
const mainTextSx = { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" };
const subTextSx = { fontSize: 11.5, color: "var(--text-secondary)" };

export function StatusChip({ status }: { status: string }) {
  const color = TONE_COLORS[statusTone(status)];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.25,
        py: 0.4,
        borderRadius: "4px",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        color,
        backgroundColor: `${color}1F`,
      }}
    >
      {humanizeCode(status)}
    </Box>
  );
}

function DirectionCell({ direction }: { direction: string }) {
  const dir = directionOf(direction);
  const [Icon, color, label] =
    dir === "in"
      ? [CallReceivedRoundedIcon, "#16A34A", "Money in"]
      : dir === "out"
        ? [CallMadeRoundedIcon, "#DC2626", "Money out"]
        : [SwapHorizRoundedIcon, "#64748B", humanizeCode(direction)];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Icon sx={{ fontSize: 16, color }} />
      <Typography sx={{ fontSize: 12 }}>{label}</Typography>
    </Box>
  );
}

interface Props {
  transactions: WalletTransaction[];
  currency: string;
  count: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (transaction: WalletTransaction) => void;
  /** Hide the pagination bar (e.g. for a short, fixed list). */
  hidePagination?: boolean;
  /** Text for the empty state. */
  emptyTitle?: string;
}

export default function WalletTransactionsTable({
  transactions,
  currency,
  count,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  hidePagination = false,
  emptyTitle = "No transactions yet",
}: Props) {
  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 760 }}>
          <TableHead sx={tableHeadSx}>
            <TableRow sx={headRowSx}>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column}
                  align={column === "Amount" ? "right" : undefined}
                  sx={headCellSx}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && transactions.length === 0 ? (
              Array.from({ length: SKELETON_ROWS }).map((_, row) => (
                <TableRow key={row}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column} sx={bodyCellSx}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  sx={{ ...bodyCellSx, textAlign: "center", py: 6 }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{emptyTitle}</Typography>
                  <Typography sx={{ ...subTextSx, mt: 0.5 }}>
                    Top-ups and delivery charges will appear here.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((txn) => {
                const dir = directionOf(txn.direction);
                const sign = dir === "in" ? "+" : dir === "out" ? "−" : "";
                const amountColor =
                  dir === "in" ? "#16A34A" : dir === "out" ? "var(--text-primary)" : "inherit";
                return (
                  <TableRow
                    key={txn.id}
                    tabIndex={0}
                    onClick={() => onRowClick(txn)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onRowClick(txn);
                    }}
                    sx={{ ...bodyRowSx, cursor: "pointer" }}
                  >
                    <TableCell sx={bodyCellSx}>
                      <Typography sx={mainTextSx}>{humanizeCode(txn.type)}</Typography>
                      <Typography sx={{ ...subTextSx, fontFamily: "monospace", wordBreak: "break-all" }}>
                        {txn.reference}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <DirectionCell direction={txn.direction} />
                    </TableCell>
                    <TableCell align="right" sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: amountColor }}>
                        {sign}
                        {formatAmount(txn.amount, currency)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <StatusChip status={txn.status} />
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>
                      {formatDateTime(txn.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && !hidePagination && (
        <AppTablePagination
          count={count}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
}
