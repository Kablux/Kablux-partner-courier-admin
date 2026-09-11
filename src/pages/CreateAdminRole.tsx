import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppButton from "../components/common/AppButton";
import AdminTextField from "../components/common/TextInput";
import PermissionMatrix from "../components/admin-role/PermissionMatrix";
import { emptyPermissions, PermissionState } from "../data/data";

export default function CreateAdminRolePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<PermissionState>(() =>
    emptyPermissions(),
  );
  const [saving, setSaving] = useState(false);

  const selectedCount = Object.values(permissions).reduce(
    (sum, mod) => sum + Object.values(mod).filter(Boolean).length,
    0,
  );

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (selectedCount === 0) {
      toast.error("Select at least one permission");
      return;
    }
    // No backend yet — simulate the request.
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`Role "${name.trim()}" created`);
      navigate("/admin-role");
    }, 1000);
  };

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => navigate("/admin-role")}
            sx={{ color: "var(--text-primary)" }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              Create Role
            </Typography>
            <Typography
              sx={{
                fontSize: 13.5,
                color: "var(--text-muted, var(--text-secondary))",
              }}
            >
              Define a role and the permissions its members will have
            </Typography>
          </Box>
        </Box>

        {/* Form card */}
        <Box
          sx={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle, var(--border))",
            borderRadius: "16px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <AdminTextField
            label="Role name"
            placeholder="e.g. Operations Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <AdminTextField
            label="Description"
            placeholder="What can this role do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <PermissionMatrix value={permissions} onChange={setPermissions} />
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <AppButton
            variant="outlined"
            onClick={() => navigate("/admin-role")}
            disabled={saving}
            sx={{ borderRadius: "8px", px: 3 }}
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={handleCreate}
            loading={saving}
            sx={{ borderRadius: "8px", px: 3 }}
          >
            Create Role
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}