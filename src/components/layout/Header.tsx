import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "../../theme/ThemeContext";
import { ROUTE_LABELS } from "../../data/data";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/Auth";

function formatDisplayName(
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const parts = [firstName, lastName]
    .filter(Boolean)
    .map((p) => capitalize(p as string));
  if (parts.length) return parts.join(" ");
  if (email) return email.split("@")[0];
  return "Partner User";
}

function getInitials(
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "P";
  }
  if (email) return email[0].toUpperCase();
  return "P";
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pageLabel = ROUTE_LABELS[location.pathname] || "Dashboard";
  const isDark = mode === "dark";

  const user = useAppSelector((state) => state.auth.user);

  const displayName = useMemo(
    () =>
      formatDisplayName(
        user?.first_name as string,
        user?.last_name as string,
        user?.email as string,
      ),
    [user],
  );
  const initials = useMemo(
    () =>
      getInitials(
        user?.first_name as string,
        user?.last_name as string,
        user?.email as string,
      ),
    [user],
  );
  const profilePhoto = (user?.profile_photo as string | null) || undefined;
  const roleLabel = (user?.user_type as string) || "Partner";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = async (action: string) => {
    handleMenuClose();

    if (action === "Sign out") {
      dispatch(logout());
      navigate("/login", { replace: true });
      return;
    }

    if (action === "Profile") {
      navigate("/settings");
      return;
    }

    if (action === "Account Settings") {
      navigate("/settings");
      return;
    }
  };

  return (
    <Box
      component="header"
      sx={{
        height: 60,
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        px: 3,
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 90,
        flexShrink: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}
      >
        <TabletMacOutlinedIcon
          sx={{ fontSize: 15, color: "var(--text-muted)" }}
        />
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
          Dashboards
        </Typography>
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
          /
        </Typography>
        <Typography
          sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}
        >
          {pageLabel}
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Action icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Refresh">
          <IconButton size="small" sx={{ color: "var(--text-muted)" }}>
            <RefreshOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>


        {/* ─── Theme toggle ─── */}
        <Tooltip
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <IconButton
            size="small"
            onClick={toggleMode}
            sx={{
              color: "var(--accent-gold)",
              backgroundColor: "var(--accent-gold-glow)",
              border: "1px solid rgba(245,197,24,0.2)",
              width: 30,
              height: 30,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(245,197,24,0.18)",
                transform: "rotate(20deg)",
              },
            }}
          >
            {isDark ? (
              <LightModeOutlinedIcon sx={{ fontSize: 15 }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ fontSize: 15 }} />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: "var(--text-muted)", mx: 0.5 }}>
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "var(--accent-gold)",
                  color: "#000",
                  fontSize: 9,
                  minWidth: 14,
                  height: 14,
                },
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 17 }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          userSelect: "none",
          ml: 1,
          "&:hover": { opacity: 0.82 },
          transition: "opacity 0.15s",
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          src={profilePhoto}
          sx={{
            width: 32,
            height: 32,
            border: "2px solid var(--accent-gold)",
            bgcolor: "var(--accent-gold)",
            color: "#000",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {!profilePhoto && initials}
        </Avatar>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: "var(--text-muted)",
              lineHeight: 1.4,
              textTransform: "capitalize",
            }}
          >
            {roleLabel.toLowerCase()}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 14, color: "var(--text-muted)" }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: "12px",
              bgcolor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid var(--border)" }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}
          >
            {displayName}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {(user?.email as string) || ""}
          </Typography>
        </Box>

        {["Profile", "Account Settings", "Sign out"].map((item) => (
          <MenuItem
            key={item}
            onClick={() => handleActionClick(item)}
            sx={{
              fontSize: 13,
              py: 1,
              color: item === "Sign out" ? "error.main" : "text.secondary",
              fontWeight: item === "Sign out" ? 600 : 400,
              "&:hover": {
                backgroundColor:
                  item === "Sign out"
                    ? "rgba(211, 47, 47, 0.04)"
                    : "rgba(0,0,0,0.02)",
              },
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
