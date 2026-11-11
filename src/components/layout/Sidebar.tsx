import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { navSections } from "../../data/data";
import logoImg from "../../assets/Kablux-logo.svg";
import type { NavItem } from "../../types/common.types";
import { useSignOut } from "../../utils/useSignOut";

export const SIDEBAR_WIDTH = 220;
export const COLLAPSED_WIDTH = 72;
/** Sidebar navy. The border uses it too, so no light line shows in light mode. */
export const SIDEBAR_BG = "#031a24";

interface SidebarProps {
  activeNav: string;
  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose = () => {},
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const effectiveCollapsed = isCollapsed && !isMobile;

  const visibleSections = navSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.id !== "analytics"),
  }));

  const isPathActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const { signOut } = useSignOut();

  const handleNav = (item: NavItem) => {
    // "Logout" is an action, not a page.
    if (item.id === "logout") {
      if (isMobile) onMobileClose();
      void signOut();
      return;
    }
    if (isPathActive(item.path)) return;
    setActiveNav(item.id);
    navigate(item.path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? SIDEBAR_WIDTH : effectiveCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        height: "100%",
        backgroundColor: SIDEBAR_BG,
        color: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.15) transparent",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(255, 255, 255, 0.25)",
        },
      }}
    >
      {/* Logo Area */}
      <Box
        sx={{
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "flex-start",
          px: effectiveCollapsed ? 0 : 3,
          py: 2,
          backgroundColor: SIDEBAR_BG,
        }}
        className="sticky top-0 left-0 backdrop-blur-sm z-10 w-full"
      >
        <Box
          component="img"
          src={logoImg}
          alt="Kablux Logo"
          sx={{
            height: 30,
            width: effectiveCollapsed ? 0 : "auto",
            opacity: effectiveCollapsed ? 0 : 1,
            objectFit: "contain",
            transition: "opacity 0.2s ease, width 0.3s ease",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mx: effectiveCollapsed ? 1 : 2 }} />

      {/* Nav Sections */}
      <Box sx={{ flex: 1, px: effectiveCollapsed ? 1 : 1.5, py: 1.5 }}>
        {visibleSections.map((section, si) => (
          <Box key={si}>
            {section.title && (
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  color: "primary.main",
                  px: 1.5,
                  pt: 1.5,
                  pb: 0.5,
                  textTransform: "uppercase",
                  opacity: effectiveCollapsed ? 0 : 1,
                  height: effectiveCollapsed ? 0 : "auto",
                  visibility: effectiveCollapsed ? "hidden" : "visible",
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {section.title}
              </Typography>
            )}
            {section.title && effectiveCollapsed && <Box sx={{ mt: 4 }} />}

            <List dense disablePadding>
              {section.items.map((item) => {
                const isActive = isPathActive(item.path);
                const Icon = item.icon;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => handleNav(item)}
                    title={effectiveCollapsed ? item.label : ""}
                    sx={{
                      py: 1,
                      px: effectiveCollapsed ? 0 : 1.5,
                      mb: 1,
                      borderRadius: 1,
                      justifyContent: effectiveCollapsed ? "center" : "flex-start",
                      transition: "background-color 0.3s ease",
                      color: "rgba(255, 255, 255, 0.8)",
                      "&.Mui-selected": {
                        backgroundColor: "#FEB40EA8",
                        color: "#ffffff",
                        "& .MuiListItemIcon-root": {
                          color: "#ffffff",
                        },
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#FEB40EA8",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: effectiveCollapsed ? "auto" : 34,
                        mr: effectiveCollapsed ? 0 : 1,
                        color: "rgba(255, 255, 255, 0.7)",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        size={20}
                        color={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)"}
                      />
                    </ListItemIcon>
                    {!effectiveCollapsed && (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: { xs: 14, sm: 15 },
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? "#ffffff" : "inherit",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            backgroundColor: SIDEBAR_BG,
            borderRight: `1px solid ${SIDEBAR_BG}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: effectiveCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            backgroundColor: SIDEBAR_BG,
            borderRight: `1px solid ${SIDEBAR_BG}`,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}