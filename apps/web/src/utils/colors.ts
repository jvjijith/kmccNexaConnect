// colors.ts
// A centralized collection of all colors used throughout the website
// Muslim-inspired color palette

// Main color palette
export const colors = {
  // Primary colors - Green is often associated with Islam
  primary: {
    main: '#056c32', // Deep Islamic green
    light: '#378a5a',
    dark: '#00471e',
    contrastText: '#ffffff',
  },

  // Secondary colors - Blue often seen in mosques and Islamic art
  secondary: {
    main: '#1d5b94', // Royal blue from Islamic architecture
    light: '#4c7eb8',
    dark: '#0c3966',
    contrastText: '#ffffff',
  },

  // Accent colors - Gold tones often used in Islamic art and calligraphy
  accent: {
    main: '#c1a568', // Gold/brass
    light: '#f1d490',
    dark: '#a18344',
    contrastText: '#000000',
  },

  // Earth tones - Common in traditional Islamic architecture
  earth: {
    main: '#91623b', // Terracotta
    light: '#b48c66',
    dark: '#6e4019',
    contrastText: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#333333',
    secondary: '#5a5a5a',
    disabled: '#999999',
    hint: '#bbbbbb',
    light: '#ffffff',
    dark: '#000000',
  },

  // Background colors
  background: {
    default: '#f7f3e9', // Light parchment color
    paper: '#ffffff',
    dark: '#2e373d',
    pattern: '#f0e8da', // For geometric patterns
  },

  // Status colors
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },

  // Border colors
  border: {
    light: '#efe5cf',
    main: '#d5c7a9',
    dark: '#b2a485',
  },

  // Special colors for Islamic-themed elements
  islamic: {
    crescentMoon: '#f2c642', // Crescent moon gold
    starSymbol: '#f2c642', // Star gold
    mihrab: '#8d5e2a', // Prayer niche
    minaret: '#e8d9bc', // Minaret stone
    calligraphy: '#0f564a', // Dark teal for calligraphy
    geometric: '#963a8f', // Purple for geometric patterns
  },

  // Miscellaneous colors
  misc: {
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.12)',
    highlight: '#fffde1',
  },
};

// Theme variants
export const themes = {
  light: {
    background: colors.background.default,
    foreground: colors.text.primary,
    primary: colors.primary.main,
    secondary: colors.secondary.main,
    accent: colors.accent.main,
  },
  dark: {
    background: colors.background.dark,
    foreground: colors.text.light,
    primary: colors.primary.light,
    secondary: colors.secondary.light,
    accent: colors.accent.light,
  },
  ramadan: {
    background: '#1e2c37',
    foreground: '#f7f3e9',
    primary: colors.islamic.crescentMoon,
    secondary: colors.primary.light,
    accent: colors.accent.light, 
  },
};

// Helper function to apply opacity to a hex color
export const withOpacity = (color: string | undefined, opacity: number): string => {
  if (!color) {
    console.warn("Invalid color input:", color);
    return "rgba(0, 0, 0, 1)"; // Default to black if undefined or empty
  }

  // Ensure opacity is between 0 and 1
  const safeOpacity = Math.max(0, Math.min(1, opacity));

  // Convert hex to rgba
  if (color.startsWith('#')) {
    let r = 0, g = 0, b = 0;

    // Full hex (#rrggbb)
     if (color.length === 7) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${safeOpacity})`;
  }

  // If it's already rgba or another format, return as is
  return color;
};

// Export common color combinations for Islamic-themed components
export const themePatterns = {
  mosqueDome: {
    base: colors.earth.light,
    dome: colors.accent.main,
    details: colors.secondary.main,
  },
  prayer: {
    sajadah: colors.earth.main,
    border: colors.accent.main,
    pattern: colors.primary.main,
  },
  eid: {
    background: colors.background.pattern,
    crescentMoon: colors.islamic.crescentMoon,
    text: colors.primary.dark,
    decoration: colors.accent.main,
  },
  ramadan: {
    nightSky: colors.background.dark,
    stars: colors.islamic.starSymbol,
    lantern: colors.accent.light,
    text: colors.text.light,
  },
};