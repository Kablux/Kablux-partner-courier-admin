import React, { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  fetchMembers,
  addMember,
  removeMember,
} from "../api/xhrHelper";

import { clearFormErrors } from "../redux/slices/Member";

import {
  AddMemberPayload,
  TeamMember,
} from "../types/index.types";
import AddMemberDialog from "../components/users/AddMember";
import TeamMembersHeader from "../components/users/MembersHeader";
import TeamMembersTable from "../components/users/MembersTable";
import TeamMembersToolbar from "../components/users/MembersToolbar";
import RemoveMemberDialog from "../components/users/RemoveMember";
import toast from "react-hot-toast";

const INITIAL_FORM_STATE: AddMemberPayload = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  country_code: "NG",
  password: "",
};

export default function TeamMembersPage() {
  const dispatch = useAppDispatch();

  const {
    members,
    loading,
    submitting,
    formErrors,
  } = useAppSelector((state) => state.members);

  const [search, setSearch] = useState("");

  const [openAddModal, setOpenAddModal] =
    useState(false);

  const [formData, setFormData] =
    useState<AddMemberPayload>(INITIAL_FORM_STATE);

  const [showPassword, setShowPassword] =
    useState(false);

  const [memberToDelete, setMemberToDelete] =
    useState<TeamMember | null>(null);

  // Fetch members
 useEffect(() => {
    dispatch(fetchMembers())
      .unwrap()
      .catch((err: any) => {
        toast.error(typeof err === "string" ? err : "Failed to load team members");
      });
  }, [dispatch]);

  // Open add modal
  const handleOpenAdd = () => {
    dispatch(clearFormErrors());
    setFormData(INITIAL_FORM_STATE);
    setShowPassword(false);
    setOpenAddModal(true);
  };

  // Close add modal
  const handleCloseAdd = () => {
    setOpenAddModal(false);
    dispatch(clearFormErrors());
  };

  // Form input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add member
  const handleAddSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const result = await dispatch(
      addMember(formData)
    );

    if (addMember.fulfilled.match(result)) {
      toast.success("Team member added successfully!");
      handleCloseAdd();
      dispatch(fetchMembers());
    } else if (addMember.rejected.match(result)) {
      const errPayload = result.payload as any;
      const errorMessage =
        typeof errPayload === "string"
          ? errPayload
          : errPayload?.error || "Failed to add member. Please check inputs.";
      toast.error(errorMessage);
    }
  };

  // Delete member
 const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    const result = await dispatch(removeMember(memberToDelete.id));

    if (removeMember.fulfilled.match(result)) {
      toast.success(
        `${memberToDelete.first_name} ${memberToDelete.last_name} removed successfully!`
      );
    } else if (removeMember.rejected.match(result)) {
      const errPayload = result.payload as any;
      toast.error(
        typeof errPayload === "string"
          ? errPayload
          : errPayload?.error || "Failed to remove member"
      );
    }

    setMemberToDelete(null);
  };

  // Search
  const filteredMembers = members.filter((member) => {
    const fullName =
      `${member.first_name || ""} ${
        member.last_name || ""
      }`.toLowerCase();

    const email =
      (member.email || "").toLowerCase();

    const query = search.toLowerCase();

    return (
      fullName.includes(query) ||
      email.includes(query)
    );
  });

  return (
    <Box
         className="fade-in"
         sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
       >
      {/* Header */}
      <TeamMembersHeader/>

      {/* Search */}
      <TeamMembersToolbar
        search={search}
        onSearchChange={setSearch}
        totalMembers={members.length}
        onAddMember={handleOpenAdd}
      />


      {/* Members */}
      <TeamMembersTable
        members={filteredMembers}
        loading={loading}
        search={search}
        onRemoveMember={setMemberToDelete}
      />

      {/* Add Member */}
      <AddMemberDialog
        open={openAddModal}
        formData={formData}
        formErrors={formErrors}
        submitting={submitting}
        showPassword={showPassword}
        onClose={handleCloseAdd}
        onSubmit={handleAddSubmit}
        onChange={handleInputChange}
        onTogglePassword={() =>
          setShowPassword((prev) => !prev)
        }
      />

      {/* Remove Member */}
      <RemoveMemberDialog
        member={memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}