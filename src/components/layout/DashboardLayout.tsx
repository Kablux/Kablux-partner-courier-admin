import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import {
  fetchRecentWalletTransactions,
  fetchUnreadNotificationCount,
} from "../../api/xhrHelper";
import { useAppDispatch } from "../../redux/hooks";
import { useTeamRole } from "../../utils/useTeamRole";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar, { COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";
import Header from "./Header";

const PATH_TO_ID: Record<string, string> = {
  "/": "dashboard",
  "/orders": "orders",
  "/users": "users",
  "/wallet": "wallet",
  "/vendor": "vendor",
  "/admin-role": "admin-role",
  "/notification": "notification",
  "/settings": "settings",
};

export default function DashboardLayout() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(
    PATH_TO_ID[location.pathname] || "dashboard",
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const id = PATH_TO_ID[location.pathname];
    if (id) setActiveNav(id);
  }, [location.pathname]);

  // Header refresh: changing the key remounts the current page, which re-runs
  // its own fetches. Unsaved page state (filters, table page) resets too.
  const dispatch = useAppDispatch();
  const role = useTeamRole().role;
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshPage = useCallback(() => {
    // These are cached, so a remount alone wouldn't ask the server again.
    dispatch(fetchUnreadNotificationCount({ force: true }));
    if (location.pathname === "/" && role !== "MEMBER") {
      dispatch(fetchRecentWalletTransactions({ force: true }));
    }
    setRefreshKey((k) => k + 1);
  }, [dispatch, location.pathname, role]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "inherit",
        transition: "background-color 0.25s ease",
      }}
    >
      <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

      <Box
        component="main"
        sx={{
            ml: {
            xs: 0,
            md: `${isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH}px`
          },
          width: {
            xs: "100%",
            md: `calc(100% - ${isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH}px)`
          },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
          backgroundColor: "var(--bg-primary)",
          transition: "background-color 0.25s ease",
        }}
      >
        <Header
          onToggleMobile={() => setIsMobileOpen(true)}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onRefresh={refreshPage}/>
        <Box
          sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 5 }, overflow: "auto" }}
          component="main"
        >
          <Outlet key={refreshKey} />
        </Box>
      </Box>
    </Box>
  );
}
