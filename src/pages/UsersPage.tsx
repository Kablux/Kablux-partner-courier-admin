import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import { USER_SUMMARY, USERS } from "../data/data";
import { User } from "../types/common.types";
import UserDetailsModal from "../components/users/UserDetailModal";
import UsersTable from "../components/users/UsersTable";


export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userStats: OverviewItem[] = [
    {
      title: "Total User",
      value: USER_SUMMARY.total,
      icon: <GroupsRoundedIcon />,
    },
    {
      title: "Active User",
      value: USER_SUMMARY.active,
      icon: <HowToRegRoundedIcon color="success"/>,
    },
    {
      title: "Suspended User",
      value: USER_SUMMARY.suspended,
      icon: <BlockRoundedIcon color="error"/>,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
    >
      {/* Overview cards + Add New */}
      <Box>
          <OverviewCards items={userStats} maxWidth={768}/>
        </Box>
        

      {/* Users table */}
      <UsersTable
        users={USERS}
        onRowClick={(user) => setSelectedUser(user)}
      />

      {/* User information modal (opens on row click) */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </Box>
  );
}