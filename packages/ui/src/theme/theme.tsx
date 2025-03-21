import { createTheme } from "@mui/material/styles";
import "@fontsource/fira-sans";

declare module "@mui/material/styles" {
  interface Palette {
    iconColor: Palette["primary"];
  }
  interface PaletteOptions {
    iconColor?: PaletteOptions["primary"];
  }
}

export const createDynamicTheme = (data: any) => {
  let colors;
  let mode = "light";
  
  if (data.themes?.theme?.palette) {
    colors = data.themes.theme.palette;
    mode = data.themes.mode || "light";
  } else if (data.theme?.palette) {
    colors = data.theme.palette;
    mode = data.mode || "light";
  } else {
    colors = data;
    mode = data.mode || "light";
  }
  
  if (!colors.primary) {
    console.warn("⚠️ Warning: `colors.primary` is missing! Using fallback color.");
  }
  
  console.log("colors.primary", colors);
  console.log("data", data);
  
  return createTheme({
    palette: {
      primary: colors.primary || { main: "#d6cdcd" },
      secondary: colors.secondary || { main: "#b49393" },
      error: colors.error || { main: "#6e5959" },
      warning: colors.warning || { main: "#988181" },
      info: colors.info || { main: "#d4abab" },
      success: colors.success || { main: "#4d3d3d" },
      text: colors.text || { primary: "#c89898", secondary: "#ff0000", disabled: "#c29999" },
      background: colors.background || { default: "#c89797", paper: "#ff0000" },
      action: colors.action || {
        active: "#c99797",
        hover: "#bb9b9b",
        selected: "#d53939",
        disabled: "#e3c4c4",
        disabledBackground: "#350303",
        focus: "#714b4b",
      },
      divider: colors.divider || "#634545",
      iconColor: { main: colors.primary?.light || "#d6cdcd" },
    },
    typography: {
      fontFamily: '"Fira Sans", sans-serif',
      h1: { fontWeight: 900, fontSize: "6rem" },
      h2: { fontWeight: 700, fontSize: "2.2rem", "@media (min-width:600px)": { fontSize: "3rem" } },
      h3: { fontWeight: 700, fontSize: "3.5rem", color: colors.primary?.main || "#d6cdcd" },
      h4: { fontWeight: 400, fontSize: "1.25rem", color: colors.primary?.main || "#d6cdcd" },
      body1: { fontWeight: 400, fontSize: "0.95rem", "@media (min-width:600px)": { fontSize: "1rem" } },
      body2: { fontWeight: 300, fontSize: "0.875rem" },
      button: { fontWeight: 500, textTransform: "none" },
    },
  });
};