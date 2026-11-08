import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

import { TeamMember } from "../../types/index.types";
import AppTablePagination from "../common/AppTablePagination";
import {
  bodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";
import { formatDate } from "../../utils/format";

interface TeamMembersTableProps {
  members: TeamMember[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading: boolean;
  search: string;
  onRemoveMember: (member: TeamMember) => void;
}

/** Plain sx object, so it can be spread together with the shared styles. */
type CellStyle = Record<string, string | number>;

interface Column {
  id: string;
  label: string;
  align?: "left" | "right";
  /** Extra body-cell styles, on top of the shared padding. */
  sx?: (member: TeamMember) => CellStyle;
  skeleton: React.ReactNode;
  render: (
    member: TeamMember,
    isOwner: boolean,
    onRemoveMember: (member: TeamMember) => void,
  ) => React.ReactNode;
}

const SKELETON_ROWS = 4;

/** Right-aligned columns get extra end padding in every row. */
const edgeSx = (column: Column): CellStyle =>
  column.align === "right" ? { pr: 3 } : {};

// Text sizes match the Orders table.
const textCellSx = {
  fontSize: 12,
  color: "text.primary",
};

const COLUMNS: Column[] = [
  {
    id: "member",
    label: "Member",
    skeleton: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Skeleton variant="circular" width={38} height={38} />
        <Skeleton variant="text" width={120} height={24} />
      </Box>
    ),
    render: (member, isOwner) => {
      const firstName = member.first_name || "";
      const lastName = member.last_name || "";
      const initial = firstName[0] || lastName[0] || "M";

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              background: isOwner
                ? "linear-gradient(135deg, #E5B800 0%, #D4A700 100%)"
                : (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha(theme.palette.common.black, 0.08),
              color: isOwner ? "#000" : "text.primary",
              fontWeight: 600,
              fontSize: "0.875rem",
              width: 38,
              height: 38,
              textTransform: "capitalize",
              // boxShadow: isOwner ? "0 2px 8px rgba(229, 184, 0, 0.3)" : "none",
            }}
          >
            {initial}
          </Avatar>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.primary",
              textTransform: "capitalize",
            }}
          >
            {firstName} {lastName}
          </Typography>
        </Box>
      );
    },
  },
  {
    id: "role",
    label: "Role",
    skeleton: (
      <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: "6px" }} />
    ),
    render: (member, isOwner) => (
      <Chip
        label={member.role || "Member"}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: "10px",
          backgroundColor: isOwner
            ? alpha("#E5B800", 0.18)
            : (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.06),
          color: isOwner ? "#B38F00" : "text.secondary",
          border: "1px solid",
          borderColor: isOwner ? alpha("#E5B800", 0.35) : "transparent",
        }}
      />
    ),
  },
  {
    id: "email",
    label: "Email",
    sx: () => textCellSx,
    skeleton: <Skeleton variant="text" width={160} height={24} />,
    render: (member) => member.email,
  },
  {
    id: "phone",
    label: "Phone",
    sx: (member) => ({
      ...textCellSx,
      color: member.phone_number ? "text.primary" : "text.disabled",
    }),
    skeleton: <Skeleton variant="text" width={110} height={24} />,
    render: (member) => member.phone_number || "—",
  },
  {
    id: "created_at",
    label: "Created",
    sx: (member) => ({
      ...textCellSx,
      whiteSpace: "nowrap",
      color: member.created_at ? "text.primary" : "text.disabled",
    }),
    skeleton: <Skeleton variant="text" width={130} height={24} />,
    render: (member) => formatDate(member.created_at),
  },
  {
    id: "actions",
    label: "Actions",
    align: "right",
    skeleton: (
      <Skeleton variant="circular" width={32} height={32} sx={{ ml: "auto" }} />
    ),
    render: (member, isOwner, onRemoveMember) =>
      isOwner ? (
        <Tooltip title="Organization owner cannot be removed" arrow placement="top">
          <span>
            <IconButton size="small" disabled sx={{ opacity: 0.4 }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Tooltip title="Remove Member" arrow placement="top">
          <IconButton
            size="small"
            onClick={() => onRemoveMember(member)}
            sx={{
              transition: "all 0.15s ease-in-out",
              color: "error.main",
              "&:hover": {
                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
  },
];

export default function TeamMembersTable({
  members,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  search,
  onRemoveMember,
}: TeamMembersTableProps) {
  return (
    <Box
      // elevation={0}
      sx={{
        // borderRadius: "8px",
        // border: "1px solid",
        // borderColor: "divider",
        // backgroundColor: "background.paper",
        // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          overflowX: "auto",
          width: "100%",
          maxWidth: "100%",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            height: 5,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Table>
          {/* Table Header */}
          <TableHead sx={tableHeadSx}>
            <TableRow sx={headRowSx}>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ ...headCellSx, ...edgeSx(column) }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              /* Skeleton Loading Rows */
              Array.from({ length: SKELETON_ROWS }).map((_, row) => (
                <TableRow key={row}>
                  {COLUMNS.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ ...bodyCellSx, ...edgeSx(column) }}
                    >
                      {column.skeleton}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : members.length === 0 ? (
              /* Empty State */
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 9 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "action.hover",
                      mb: 2,
                    }}
                  >
                    <GroupOutlinedIcon
                      sx={{ fontSize: 32, color: "text.secondary", opacity: 0.7 }}
                    />
                  </Box>

                  <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                    No members found
                  </Typography>

                  <Typography
                    sx={{ color: "text.secondary", mt: 0.5, maxWidth: 400, mx: "auto" }}
                  >
                    {search
                      ? "No organization members match your search criteria. Try adjusting your search term."
                      : "Your team has no added members yet. Click 'Add Member' to invite someone."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              /* Member Rows */
              members.map((member) => {
                const isOwner = member.role?.toUpperCase() === "OWNER";

                return (
                  <TableRow key={member.id} sx={bodyRowSx}>
                    {COLUMNS.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ ...bodyCellSx, ...column.sx?.(member) }}
                      >
                        {column.render(member, isOwner, onRemoveMember)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <AppTablePagination
          count={totalCount}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
}
