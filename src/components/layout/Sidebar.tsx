import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { navSections } from "../../data/data";
import logoImg from "../../assets/Kablux-logo.svg";
import type { NavItem } from "../../types/common.types";

export const SIDEBAR_WIDTH = 220;

interface SidebarProps {
  activeNav: string;

  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const navigate = useNavigate();

  const handleNav = (item: NavItem) => {
    setActiveNav(item.id);
    navigate(item.path);
  };

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: "100vh",
        backgroundColor: "#031a24",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "background-color 0.25s ease, border-color 0.25s ease",

        // Firefox
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.15) transparent",

        // Webkit (Chrome, Safari, Edge)
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(255, 255, 255, 0.25)",
        },
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          height: 72,
          maxWidth: 286,
          display: "flex",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "#031a24",
        }}
        className="sticky top-0 left-0 backdrop-blur-sm z-10 w-full"
      >
        <Box
          component="img"
          src={logoImg}
          alt="Kablux Logo"
          sx={{
            height: 32,
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* <Divider sx={{ borderColor: "var(--border-subtle)", mx: 2 }} /> */}

      {/* Nav sections */}
      <Box sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        {navSections.map((section, si) => (
          <Box key={si}>
            {section.title && (
              <Typography
                sx={{
                  fontSize: 12,
                  letterSpacing: "0.10em",
                  color: "primary.main",
                  px: 1.5,
                  pt: 1.5,
                  pb: 0.5,
                }}
              >
                {section.title}
              </Typography>
            )}
            <List dense disablePadding>
              {section.items.map((item) => {
                const isActive = activeNav === item.id;
                const Icon = item.icon;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => handleNav(item)}
                    sx={{
                      py: 1,
                      px: 1.5,
                      mb: 1,
                      gap: 0,
                      borderRadius: 1,
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
                        minWidth: 34,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <Icon
                        size={20}
                        color={
                          isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)"
                        }
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: { xs: 14, sm: 16 },
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "#ffffff" : "inherit",
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
