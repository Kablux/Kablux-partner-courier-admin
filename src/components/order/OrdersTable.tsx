import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { Order, OrderStatus } from "../../data/data";

const TABS = ["All", "Approved", "Pending", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const Stars = ({ rating }: { rating: number }) => (
  <Box sx={{ display: "flex", gap: 0.25 }}>
    {Array.from({ length: 5 }).map((_, i) =>
      i < Math.round(rating) ? (
        <StarRoundedIcon key={i} sx={{ fontSize: 16, color: "#F5C518" }} />
      ) : (
        <StarBorderRoundedIcon
          key={i}
          sx={{ fontSize: 16, color: "rgba(255,255,255,0.25)" }}
        />
      ),
    )}
  </Box>
);

const headCellSx = {
  color: "var(--text-secondary)",
  fontSize: 12.5,
  fontWeight: 600,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
  py: 1.5,
};

const bodyCellSx = {
  color: "var(--text-primary)",
  fontSize: 14,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
  py: 1.5,
};

interface Props {
  orders: Order[];
  onRowClick: (order: Order) => void;
  onAddNew?: () => void;
}

export default function OrdersTable({ orders, onRowClick, onAddNew }: Props) {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = useMemo(
    () =>
      tab === "All"
        ? orders
        : orders.filter((o) => o.status === (tab as OrderStatus)),
    [orders, tab],
  );

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "16px",
        p: 3,
      }}
    >
      {/* Tabs + Add New */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          {TABS.map((t) => (
            <Typography
              key={t}
              onClick={() => setTab(t)}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                color: tab === t ? "var(--accent-gold)" : "secondary.main",
                position: "relative",
                pb: 0.5,
                transition: "color 0.2s",
                "&::after":
                  tab === t
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
              {t}
            </Typography>
          ))}
        </Box>

      
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>Name</TableCell>
              <TableCell sx={headCellSx}>Phone number</TableCell>
              <TableCell sx={headCellSx}>Address</TableCell>
              <TableCell sx={headCellSx}>Gender</TableCell>
              <TableCell sx={headCellSx}>Ratings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ ...bodyCellSx, textAlign: "center", py: 4 }}
                >
                  <Typography
                    sx={{ fontSize: 14, color: "var(--text-secondary)" }}
                  >
                    No orders in this category.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow
                  key={o.id}
                  hover
                  onClick={() => onRowClick(o)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar sx={{ width: 30, height: 30, fontSize: 13 }}>
                        {o.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        {o.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{o.phone}</TableCell>
                  <TableCell sx={bodyCellSx}>{o.address}</TableCell>
                  <TableCell sx={bodyCellSx}>{o.gender}</TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Stars rating={o.rating} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}