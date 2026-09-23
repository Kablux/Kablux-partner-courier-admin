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
import { Ride } from "../../types/common.types";

const STATUS_COLORS: Record<Ride["status"], string> = {
  Successful: "#22C55E",
  Cancelled: "#EF4444",
  Pending: "#F5C518",
};

const headCellSx = {
  color: "var(--text-muted)",
  fontSize: 12.5,
  fontWeight: 600,
  borderBottom: "1px solid var(--border-subtle, var(--border))",
  py: 1.5,
};

const bodyCellSx = {
  color: "var(--text-primary)",
  fontSize: 13,
  borderBottom: "1px solid var(--border-subtle, var(--border))",
  py: 1.75,
};

export default function RidesHistoryTable({ rides }: { rides: Ride[] }) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(120,130,150,0.10)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        p: 3,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
        Rides History
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>Staff Name</TableCell>
              <TableCell sx={headCellSx}>Date Added</TableCell>
              <TableCell sx={headCellSx}>Unique Code</TableCell>
              <TableCell sx={headCellSx}>Location</TableCell>
              <TableCell sx={headCellSx}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rides.map((r) => (
              <TableRow key={r.id}>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={r.avatar}
                      sx={{ width: 30, height: 30, fontSize: 13 }}
                    >
                      {r.staff.charAt(0)}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                      {r.staff}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>{r.date}</TableCell>
                <TableCell sx={bodyCellSx}>{r.code}</TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12.5 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Pickup:{" "}
                    </Box>
                    {r.pickup}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Drop Off:{" "}
                    </Box>
                    {r.dropoff}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: STATUS_COLORS[r.status],
                    }}
                  >
                    {r.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
