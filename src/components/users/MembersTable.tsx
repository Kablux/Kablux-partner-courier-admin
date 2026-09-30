import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
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

interface TeamMembersTableProps {
  members: TeamMember[];
  loading: boolean;
  search: string;
  onRemoveMember: (member: TeamMember) => void;
}

export default function TeamMembersTable({
  members,
  loading,
  search,
  onRemoveMember,
}: TeamMembersTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "14px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        overflow: "hidden",
      }}
    >
      <Table>
        {/* Table Header */}
        <TableHead
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.03)
                : alpha(theme.palette.common.black, 0.02),
          }}
        >
          <TableRow sx={{ "& th": { borderBottom: "1px solid", borderColor: "divider" } }}>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                py: 2,
              }}
            >
              Member
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                py: 2,
              }}
            >
              Role
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                py: 2,
              }}
            >
              Email
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                py: 2,
              }}
            >
              Phone
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                py: 2,
                pr: 3,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {loading ? (
            /* Skeleton Loading Rows */
            [...Array(4)].map((_, i) => (
              <TableRow key={i}>
                <TableCell sx={{ py: 1.8 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Skeleton variant="circular" width={38} height={38} />
                    <Skeleton variant="text" width={120} height={24} />
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: "6px" }} />
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  <Skeleton variant="text" width={160} height={24} />
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  <Skeleton variant="text" width={110} height={24} />
                </TableCell>
                <TableCell align="right" sx={{ py: 1.8, pr: 3 }}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ ml: "auto" }} />
                </TableCell>
              </TableRow>
            ))
          ) : members.length === 0 ? (
            /* Empty State */
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 9 }}>
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
                    sx={{
                      fontSize: 32,
                      color: "text.secondary",
                      opacity: 0.7,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  No members found
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    maxWidth: 400,
                    mx: "auto",
                  }}
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
              const firstName = member.first_name || "";
              const lastName = member.last_name || "";
              const initial = firstName[0] || lastName[0] || "M";

              return (
                <TableRow
                  key={member.id}
                  sx={{
                    transition: "background-color 0.15s ease-in-out",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {/* Member Avatar & Name */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          background: isOwner
                            ? "linear-gradient(135deg, #E5B800 0%, #D4A700 100%)"
                            : (theme) =>
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.common.white, 0.12)
                                  : alpha(theme.palette.common.black, 0.08),
                          color: isOwner ? "#000" : "text.primary",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          width: 38,
                          height: 38,
                          textTransform: "uppercase",
                          boxShadow: isOwner
                            ? "0 2px 8px rgba(229, 184, 0, 0.3)"
                            : "none",
                        }}
                      >
                        {initial}
                      </Avatar>

                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "text.primary",
                          textTransform: "capitalize",
                        }}
                      >
                        {firstName} {lastName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Chip
                      label={member.role || "Member"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 24,
                        borderRadius: "6px",
                        backgroundColor: isOwner
                          ? alpha("#E5B800", 0.18)
                          : (theme) =>
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.common.white, 0.08)
                                : alpha(theme.palette.common.black, 0.06),
                        color: isOwner ? "#B38F00" : "text.secondary",
                        border: "1px solid",
                        borderColor: isOwner
                          ? alpha("#E5B800", 0.35)
                          : "transparent",
                      }}
                    />
                  </TableCell>

                  {/* Email */}
                  <TableCell
                    sx={{
                      py: 1.8,
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {member.email}
                  </TableCell>

                  {/* Phone */}
                  <TableCell
                    sx={{
                      py: 1.8,
                      fontSize: "0.875rem",
                      color: member.phone_number ? "text.secondary" : "text.disabled",
                      fontWeight: 500,
                    }}
                  >
                    {member.phone_number || "—"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" sx={{ py: 1.8, pr: 3 }}>
                    {isOwner ? (
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
                            // color: "text.secondary",
                            transition: "all 0.15s ease-in-out",
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                alpha(theme.palette.error.main, 0.08),
                            },
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}