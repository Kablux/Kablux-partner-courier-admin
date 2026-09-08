import React from "react";
import {
  Box,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AdminRole } from "../../types/common.types";

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
  roles: AdminRole[];
  isLoading?: boolean;
  onViewRole: (roleId: string) => void;
}

export default function AdminRolesTable({
  roles,
  isLoading = false,
  onViewRole,
}: Props) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "16px",
        p: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>Role Name</TableCell>
              <TableCell sx={headCellSx}>Description</TableCell>
              <TableCell sx={headCellSx}>Members</TableCell>
              <TableCell sx={headCellSx}>Permissions</TableCell>
              <TableCell sx={headCellSx}>Date Created</TableCell>
              <TableCell sx={headCellSx}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j} sx={bodyCellSx}>
                        <Skeleton
                          variant="text"
                          width="70%"
                          sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : roles.map((r) => (
                  <TableRow
                    key={r.id}
                    hover
                    onClick={() => onViewRole(r.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                    }}
                  >
                    <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                      {r.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...bodyCellSx,
                        color: "var(--text-secondary)",
                        maxWidth: 260,
                      }}
                    >
                      {r.description}
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{r.members}</TableCell>
                    <TableCell sx={bodyCellSx}>{r.permissions}</TableCell>
                    <TableCell sx={bodyCellSx}>{r.createdAt}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: r.status === "Active" ? "#22C55E" : "#8b8f98",
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
