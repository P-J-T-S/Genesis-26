// theme provider component that applies the selected theme to the application
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getMuiTheme } from "../../styles/muiTheme";

export default function ThemeProvider({ children }) {
  // Always use light theme
  const muiTheme = getMuiTheme();

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="text-text">{children}</div>
    </MuiThemeProvider>
  );
}
