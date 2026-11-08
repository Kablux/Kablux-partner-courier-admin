import { useMemo, useState } from "react";
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
import { OrderListItem } from "../../types/index.types";
import AppTablePagination from "../common/AppTablePagination";
import ErrorState from "../common/ErrorState";
import {
  bodyCellSx as sharedBodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";
import OrderStatusChip from "./OrderStatusChip";
import {
  EMPTY_VALUE,
  formatDateTime,
  formatMoney,
  getOrderGroup,
  OrderGroup,
} from "./utils";

const TABS: { label: string; group: OrderGroup | null }[] = [
  { label: "All", group: null },
  { label: "Pending", group: "pending" },
  { label: "Active", group: "active" },
  { label: "Completed", group: "completed" },
  { label: "Cancelled", group: "cancelled" },
];

const COLUMNS = ["Order", "Recipient", "Route", "Status", "Offer", "Created"];
const SKELETON_ROWS = 5;

const bodyCellSx = {
  ...sharedBodyCellSx,
  fontSize: 12,
};

const truncatedSx = {
  fontSize: 12,
  maxWidth: 240,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

interface Props {
  orders: OrderListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onRowClick: (order: OrderListItem) => void;
}

export default function OrdersTable({
  orders,
  loading,
  error,
  onRetry,
  onRowClick,
}: Props) {
  const [activeTab, setActiveTab] = useState<OrderGroup | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      activeTab
        ? orders.filter((o) => getOrderGroup(o.status) === activeTab)
        : orders,
    [orders, activeTab],
  );

  const lastPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  const currentPage = Math.min(page, lastPage); // list may shrink on refetch
  const visible = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  const handleTabChange = (group: OrderGroup | null) => {
    setActiveTab(group);
    setPage(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(0);
  };

  return (
    <Box
      sx={{
        // backgroundColor: "var(--bg-card)",
        p: 2,
      }}
    >
      {error ? (
        <ErrorState
          title="Couldn't load orders"
          message={error}
          onRetry={onRetry}
        />
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
            {TABS.map(({ label, group }) => {
              const isActive = activeTab === group;
              return (
                <Typography
                  key={label}
                  onClick={() => handleTabChange(group)}
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    color: isActive ? "var(--accent-gold)" : "primary",
                    position: "relative",
                    pb: 0.5,
                    transition: "color 0.2s",
                    "&::after": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "2px",
                          backgroundColor: "var(--accent-gold)",
                        }
                      : {},
                  }}
                >
                  {label}
                </Typography>
              );
            })}
          </Box>

          <TableContainer sx={{mt:4}}>
            <Table sx={{ minWidth: 860 }}>
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
                {loading ? (
                  Array.from({ length: SKELETON_ROWS }).map((_, row) => (
                    <TableRow key={row}>
                      {COLUMNS.map((column) => (
                        <TableCell key={column} sx={bodyCellSx}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      sx={{ ...bodyCellSx, textAlign: "center", py: 4 }}
                    >
                      <Typography
                        sx={{ fontSize: 14, color: "var(--text-secondary)" }}
                      >
                        {activeTab
                          ? "No orders in this category."
                          : "No orders yet."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((order) => (
                    <TableRow
                      key={order.id}
                      tabIndex={0}
                      onClick={() => onRowClick(order)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onRowClick(order);
                      }}
                      sx={{ ...bodyRowSx, cursor: "pointer" }}
                    >
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                          {order.order_code || EMPTY_VALUE}
                        </Typography>
                        {order.reference && (
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {order.reference}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {order.recipient_name && (
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            {order.recipient_name}
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            fontSize: order.recipient_name ? 11.5 : 13,
                            color: order.recipient_name
                              ? "var(--text-secondary)"
                              : "inherit",
                          }}
                        >
                          {order.recipient_contact || EMPTY_VALUE}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={truncatedSx}>
                          {order.vendor_address || EMPTY_VALUE}
                        </Typography>
                        <Typography
                          sx={{
                            ...truncatedSx,
                            color: "var(--text-secondary)",
                          }}
                        >
                          → {order.recipient_address || EMPTY_VALUE}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <OrderStatusChip status={order.status} />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {formatMoney(order.initial_proposed_offer)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>
                        {formatDateTime(order.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && (
            <AppTablePagination
              count={filtered.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </Box>
  );
}
