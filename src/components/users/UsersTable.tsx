import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { User } from "../../types/common.types";

const STATUS_COLORS: Record<User["status"], string> = {
  Approved: "#22C55E",
  Canceled: "#EF4444",
  Pending: "#F5C518",
};

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

interface Props {
  users: User[];
  onRowClick: (user: User) => void;
  onSuspend?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UsersTable({
  users,
  onRowClick,
  onSuspend,
  onDelete,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<User | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, user: User) => {
    e.stopPropagation(); // don't trigger the row click
    setAnchorEl(e.currentTarget);
    setMenuUser(user);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

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
              <TableCell sx={headCellSx}>User Name</TableCell>
              <TableCell sx={headCellSx}>Date Added</TableCell>
              <TableCell sx={headCellSx}>Unique Code</TableCell>
              <TableCell sx={headCellSx}>Contact</TableCell>
              <TableCell sx={headCellSx}>Status</TableCell>
              <TableCell sx={headCellSx} align="right" >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                hover
                onClick={() => onRowClick(u)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                }}
              >
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={u.avatar}
                      sx={{ width: 30, height: 30, fontSize: 13 }}
                    >
                      {u.name.charAt(0)}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                      {u.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>{u.date}</TableCell>
                <TableCell sx={bodyCellSx}>{u.code}</TableCell>
                <TableCell sx={bodyCellSx}>{u.contact}</TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: STATUS_COLORS[u.status],
                    }}
                  >
                    {u.status}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx} align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => openMenu(e, u)}
                    sx={{ color: "var(--text-secondary)" }}
                  >
                    <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-card, #1E1E1E)",
              backgroundImage: "none",
              border: "1px solid var(--border, rgba(255,255,255,0.1))",
              "& .MuiMenuItem-root": { fontSize: 13.5 },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (menuUser) onRowClick(menuUser);
            closeMenu();
          }}
        >
          View details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuUser) onSuspend?.(menuUser);
            closeMenu();
          }}
        >
          Suspend user
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuUser) onDelete?.(menuUser);
            closeMenu();
          }}
          sx={{ color: "#EF4444" }}
        >
          Delete user
        </MenuItem>
      </Menu>
    </Box>
  );
}