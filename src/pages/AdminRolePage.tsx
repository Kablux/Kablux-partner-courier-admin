import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { useNavigate } from "react-router-dom";
import AppButton from "../components/common/AppButton";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import AdminRolesTable from "../components/admin-role/AdminRoleTable";
import AdminRoleEmptyState from "../components/admin-role/EmptyState";
import { ADMIN_ROLES, ROLE_STATS } from "../data/data";
import RoleDetailsModal from "../components/admin-role/AdminRoleDetailModal";

export default function AdminRolePage() {
  const navigate = useNavigate();

  // Dummy state (swap for redux/query + API later)
  const [isLoading] = useState(false);
  const roles = ADMIN_ROLES;

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;

  const roleStats: OverviewItem[] = [
    {
      title: "Total Roles",
      value: ROLE_STATS.totalRoles,
      icon: <AdminPanelSettingsRoundedIcon />,
    },
    {
      title: "Total Admins",
      value: ROLE_STATS.totalAdmins,
      icon: <GroupsRoundedIcon />,
    },
    {
      title: "Active Roles",
      value: ROLE_STATS.activeRoles,
      icon: <VerifiedUserRoundedIcon />,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
      {/* Top Action Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <AppButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin-role/create")}
          sx={{ borderRadius: "8px", px: 3 }}
        >
          Add New Role
        </AppButton>
      </Box>

      {/* Overview Cards */}
      <OverviewCards items={roleStats} maxWidth="100%" loading={isLoading} />

      {/* Header */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: 16, sm: 20 },
            color: "var(--text-primary)",
          }}
        >
          Admin
        </Typography>
      </Box>

      {/* Table / Empty State */}
      {!isLoading && roles.length === 0 ? (
        <AdminRoleEmptyState onCreate={() => navigate("/admin-role/create")} />
      ) : (
        <AdminRolesTable
          roles={roles}
          isLoading={isLoading}
          onViewRole={(roleId) => setSelectedRoleId(roleId)}
        />
      )}

      {/* Role details modal (opens on row click) */}
      <RoleDetailsModal
        role={selectedRole}
        isOpen={!!selectedRoleId}
        onClose={() => setSelectedRoleId(null)}
      />
    </Box>
  );
}
