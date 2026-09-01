import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type ThemeMode = "dark" | "light";
type ThemeVars = Record<string, string>;

const DARK_VARS: ThemeVars = {
  "--bg-primary": "#010e14",
  "--bg-secondary": "#031A24",
  "--bg-card": "#031A24",
  "--bg-card-hover": "#052938",
  "--border": "#112e3d",
  "--border-subtle": "#a4a4a4",
  "--text-primary": "#f4f5f7",
  "--text-secondary": "#8ba3b0",
  "--text-muted": "#666",
  "--accent-primary": "#FFC450", // Corporate Primary
  "--accent-secondary": "#031A24", // Corporate Secondary
  "--accent-dim": "#FEB91499", // Corporate dimPrimary
  "--success": "#4CAF50",
  "--danger": "#D32F2F",
  "--danger-hover": "#FF0000",
  "--info": "#42A5F5",
};

const LIGHT_VARS: ThemeVars = {
  "--bg-primary": "#FFFDFA",
  "--bg-secondary": "#ffffff",
  "--bg-card": "#ffffff",
  "--bg-card-hover": "#f9f9fb",
  "--border": "#e4e4e7",
  "--border-subtle": "#efefef",
  "--text-primary": "#031A24",
  "--text-secondary": "#555555",
  "--text-muted": "#aaaaaa",
  "--accent-primary": "#FFC450",
  "--accent-secondary": "#031A24",
  "--accent-dim": "#FEB91499",
  "--success": "#388E3C",
  "--danger": "#FF0000",
  "--danger-hover": "#D32F2F",
  "--info": "#1976D2",
};

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeCtx = createContext<ThemeContextType>({
  mode: "light",
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeCtx);

interface ThemeModeProviderProps {
  children: ReactNode;
}

function applyVars(vars: ThemeVars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const stored = () => {
    try {
      // Changed key to kablux-corp-theme to avoid collision with main supa-admin
      return localStorage.getItem("kablux-corp-theme") || "light";
    } catch {
      return "light";
    }
  };

  const [mode, setMode] = useState<ThemeMode>(stored() as ThemeMode);

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("kablux-corp-theme", next);
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    applyVars(mode === "dark" ? DARK_VARS : LIGHT_VARS);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // Apply on first paint (before any render)
  useEffect(() => {
    applyVars(mode === "dark" ? DARK_VARS : LIGHT_VARS);
  }, []); // eslint-disable-line

  return (
    <ThemeCtx.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeCtx.Provider>
  );
}
