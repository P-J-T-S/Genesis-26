// theme configuration for MUI components
import { createTheme } from "@mui/material/styles";

// Tailwind-inspired colors (Green/Emerald Primary)
const colors = {
  primary: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  success: {
    500: "#22c55e",
  },
  warning: {
    500: "#f59e0b",
  },
  danger: {
    500: "#ef4444",
  },
};

export function getMuiTheme() {
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: colors.primary[500],
        light: colors.primary[300],
      },
      secondary: {
        main: colors.secondary[500],
        light: colors.secondary[300],
      },
      success: {
        main: colors.success[500],
      },
      warning: {
        main: colors.warning[500],
      },
      error: {
        main: colors.danger[500],
      },
      background: {
        default: colors.secondary[50],
        paper: "#ffffff",
      },
      text: {
        primary: colors.secondary[900],
        secondary: colors.secondary[500],
      },
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h1: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h2: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h3: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h4: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h5: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: false,
        },
      },
    },
  });
}
