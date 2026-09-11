import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { WalletTxn } from "../../types/common.types";

const headCellSx = {
  color: "var(--text-secondary)",
  fontSize: 12.5,
  fontWeight: 600,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
  py: 1.5,
};

const bodyCellSx = {
  color: "var(--text-primary)",
  fontSize: 13,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
  py: 1.75,
};

export default function RecentTransactionsTable({
  transactions,
}: {
  transactions: WalletTxn[];
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Recent Transactions
      </Typography>
      <Box
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle, var(--border))",
          borderRadius: "16px",
          p: 3,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>Reciever</TableCell>
                <TableCell sx={headCellSx}>Type</TableCell>
                <TableCell sx={headCellSx}>Pickup</TableCell>
                <TableCell sx={headCellSx}>Destination</TableCell>
                <TableCell sx={headCellSx}>Date &amp; Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={t.avatar}
                        sx={{ width: 28, height: 28, fontSize: 12 }}
                      >
                        {t.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        {t.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{t.type}</TableCell>
                  <TableCell sx={{ ...bodyCellSx, maxWidth: 160 }}>
                    {t.pickup}
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, maxWidth: 160 }}>
                    {t.destination}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{t.datetime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}