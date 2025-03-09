import { createTheme } from '@mui/material/styles';
import "@fontsource/fira-sans"; // Defaults to 400 weight
import "@fontsource/fira-sans/100.css"; // Thin
import "@fontsource/fira-sans/200.css"; // ExtraLight
import "@fontsource/fira-sans/300.css"; // Light
import "@fontsource/fira-sans/500.css"; // Medium
import "@fontsource/fira-sans/600.css"; // SemiBold
import "@fontsource/fira-sans/700.css"; // Bold
import "@fontsource/fira-sans/800.css"; // ExtraBold
import "@fontsource/fira-sans/900.css"; // Black

// Extend the palette type
declare module "@mui/material/styles" {
  interface Palette {
    iconColor: Palette["primary"];
  }
  interface PaletteOptions {
    iconColor?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5733",
    },
    secondary: {
      main: "#212121",
    },
    iconColor: {
      main: "rgba(255, 128, 102, 0.1)"
    }
  },
  typography: {
    fontFamily: '"Fira Sans", sans-serif',
    h1: {
      fontWeight: 900, // Black
      fontSize: "6rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem', // Slightly smaller text
      '@media (min-width:600px)': {
        fontSize: '3rem', // Reduced from 3.5rem
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: "3.5rem",
      color: "#ff5733",
    },
    h4: {
      fontWeight: 400,
      fontSize: "1.25rem",
      color: "#ff5733",
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.95rem', // Slightly smaller text
      '@media (min-width:600px)': {
        fontSize: '1rem', // Reduced from 1.1rem
      },
    },
    body2: {
      fontWeight: 300, // Light
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 500, // Medium
      textTransform: "none",
    },
  },
});
