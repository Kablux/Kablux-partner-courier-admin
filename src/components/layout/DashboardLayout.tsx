import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar, { COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";
import Header from "./Header";

const PATH_TO_ID: Record<string, string> = {
  "/": "dashboard",
  "/orders": "orders",
  "/users": "users",
  "/wallet": "wallet",
  "/analytics": "analytics",
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
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}/>
        <Box
          sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 5 }, overflow: "auto" }}
          component="main"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
