import React, { useEffect, useMemo, useState } from "react";
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
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "../../theme/ThemeContext";
import { ROUTE_LABELS } from "../../data/data";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useSignOut } from "../../utils/useSignOut";
import { useTeamRole } from "../../utils/useTeamRole";
import { fetchUnreadNotificationCount } from "../../api/xhrHelper";

import MenuIcon from "@mui/icons-material/Menu";


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

interface HeaderProps {
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
  /** Reloads the current page's data. */
  onRefresh: () => void;
}

/** How long the refresh button spins and stays disabled after a click. */
const REFRESH_COOLDOWN_MS = 1000;

export default function Header({
  onToggleMobile,
  onToggleCollapse,
  onRefresh,
}: HeaderProps) {
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (!refreshing) return;
    const timer = window.setTimeout(() => setRefreshing(false), REFRESH_COOLDOWN_MS);
    return () => window.clearTimeout(timer);
  }, [refreshing]);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    onRefresh();
  };
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signOut } = useSignOut();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount) ?? 0;

  useEffect(() => {
    dispatch(fetchUnreadNotificationCount());
    const onReturn = () => {
      if (document.visibilityState === "visible") dispatch(fetchUnreadNotificationCount());
    };
    document.addEventListener("visibilitychange", onReturn);
    return () => document.removeEventListener("visibilitychange", onReturn);
  }, [dispatch]);
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

  const { role, resolving } = useTeamRole();
  const roleLabel = role ?? (resolving ? "" : "Partner");

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = async (action: string) => {
    handleMenuClose();

    if (action === "Sign out") {
      await signOut();
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
        px: { xs: 1.5, md: 3 },
        gap: { xs: 1, sm: 2 },
        maxWidth: "100%",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 90,
        flexShrink: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
    {/* Sidebar Toggle Buttons */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Mobile Toggle */}
        <IconButton
          onClick={onToggleMobile}
          size="small"
          sx={{
            display: { xs: "flex", md: "none" },
            color: "var(--text-muted)",
            mr: { xs: 0, sm: 1 },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Collapse Toggle */}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{
            display: { xs: "none", md: "flex" },
            color: "var(--text-muted)",
            mr: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Breadcrumb */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}
      >
        {/* Phones show only the page name. */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
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
        </Box>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: 14, sm: 12 },
            fontWeight: 600,
            color: "var(--text-primary)",
            minWidth: 0,
          }}
        >
          {pageLabel}
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Action icons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          flexShrink: 0,
        }}
      >
        {/* Hidden on phones to save space. */}
        <Tooltip title="Refresh data">
          {/* The span keeps the tooltip working while the button is disabled. */}
          <Box component="span" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
              sx={{
                color: "var(--text-muted)",
                "&.Mui-disabled": { color: "var(--text-muted)" },
              }}
            >
              <RefreshOutlinedIcon
                sx={{
                  fontSize: 17,
                  animation: refreshing ? "header-refresh-spin 0.8s linear infinite" : "none",
                  "@keyframes header-refresh-spin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Box>
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

        <Tooltip
          title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        >
          <IconButton
            size="small"
            onClick={() => navigate("/notifications")}
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            sx={{ color: "var(--text-muted)", mx: { xs: 0, sm: 0.5 } }}
          >
            <Badge
              badgeContent={unreadCount}
              max={99}
              invisible={unreadCount === 0}
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
          ml: { xs: 0.5, sm: 1 },
          flexShrink: 0,
          "&:hover": { opacity: 0.82 },
          transition: "opacity 0.15s",
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          src={profilePhoto}
          sx={{
            width: 30,
            height: 30,
            border: "2px solid var(--accent-gold)",
            bgcolor: "var(--accent-gold)",
            color: "#000",
            fontSize: 12,
            fontWeight: 600,
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
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-muted)",
              lineHeight: 1.4,
              mt: 0.4,
              textTransform: "capitalize",
            }}
          >
            {roleLabel.toLowerCase()}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: 14,
            color: "var(--text-muted)",
          }}
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
              color: item.startsWith("Sign out") ? "error.main" : "text.secondary",
              fontWeight: item.startsWith("Sign out") ? 600 : 400,
              "&:hover": {
                backgroundColor:
                  item.startsWith("Sign out")
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
