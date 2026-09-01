import { createTheme } from "@mui/material/styles";

const sharedTypography = {
  fontFamily: "'Roboto', sans-serif",
  h1: { fontFamily: "'Roboto', sans-serif", fontWeight: 700 },
  h2: { fontFamily: "'Roboto', sans-serif", fontWeight: 700 },
  h3: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h4: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h5: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h6: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
};

const sharedShape = { borderRadius: 12 };

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 600,
        borderRadius: 8,
      },
      containedPrimary: {
        backgroundColor: "#FFC450",
        color: "#031A24", 
        "&:hover": { backgroundColor: "#e6b048" },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        marginBottom: 2,
        "&.Mui-selected": {
          backgroundColor: "#FFC450",
          color: "#031A24",
          "& .MuiListItemIcon-root": { color: "#031A24" },
          "& .MuiListItemText-primary": { color: "#031A24", fontWeight: 600 },
          "&:hover": { backgroundColor: "#e6b048" },
        },
        "&:hover": { backgroundColor: "#FEB91499" }, // Using dimPrimary
      },
    },
  },
  MuiChip: {
    styleOverrides: { root: { fontFamily: "'Roboto', sans-serif" } },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "&:hover": { backgroundColor: "#FEB91499" }, // Using dimPrimary
      },
    },
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FFC450", contrastText: "#031A24" },
    secondary: { main: "#031A24", contrastText: "#ffffff" },
    // Using darker variations of the #031A24 secondary color for dark mode backgrounds
    background: { default: "#010e14", paper: "#031A24" }, 
    text: { primary: "#f4f5f7", secondary: "#8ba3b0" },
    divider: "#112e3d",
    success: { main: "#4CAF50" },
    error: { main: "#EF5350" },
    info: { main: "#42A5F5" },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#010e14" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#031A24",
          backgroundImage: "none",
          border: "1px solid #112e3d",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: "#8ba3b0" } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#112e3d" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#112e3d",
          border: "1px solid #1c4257",
          fontFamily: "'Roboto', sans-serif",
          fontSize: 12,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FFC450", contrastText: "#031A24" },
    secondary: { main: "#031A24", contrastText: "#ffffff" },
    background: { default: "#f4f5f7", paper: "#ffffff" },
    text: { primary: "#031A24", secondary: "#555555" }, // Secondary acts as primary text in light mode
    divider: "#e4e4e7",
    success: { main: "#388E3C" },
    error: { main: "#D32F2F" },
    info: { main: "#1976D2" },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f4f5f7" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          border: "1px solid #e4e4e7",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: "#031A24" } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#e4e4e7" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#031A24",
          border: "1px solid #010e14",
          color: "#ffffff",
          fontFamily: "'Roboto', sans-serif",
          fontSize: 12,
        },
      },
    },
  },
});