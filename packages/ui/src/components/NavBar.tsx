"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Menu as MenuIcon, KeyboardArrowDown } from "@mui/icons-material";

interface NavbarProps {
  menuData: any;
  fetchApi: any;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  withOpacity: (color: string, opacity: number) => string;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<{ backgroundColor: string }>(({ backgroundColor }) => ({
  backgroundColor,
  boxShadow: "none",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
}));

const StyledToolbar = styled(Toolbar)(() => ({
  padding: "1rem 0",
}));

const LogoContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const StyledLogo = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  cursor: "pointer",
  color,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "customColor",
})<{ customColor: string }>(({ customColor }) => ({
  color: customColor,
  textTransform: "none",
  fontSize: "1rem",
  padding: "8px 16px",
  "&:hover": {
    color: customColor,
    backgroundColor: "transparent",
  },
}));

const DonateButton = styled(Button, {
  shouldForwardProp: (prop) => !["background", "text"].includes(prop as string),
})<{ background: string; text: string }>(({ background, text }) => ({
  backgroundColor: background,
  color: text,
  borderRadius: "50px",
  padding: "8px 24px",
  fontSize: "1rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: background,
  },
}));

export function Navbar({ menuData, fetchApi, theme, withOpacity }: NavbarProps) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <StyledAppBar backgroundColor={withOpacity(theme.primary, 0)}>
      <Container maxWidth="lg">
        <StyledToolbar>
          {/* Logo */}
          <LogoContainer>
            <StyledLogo color={theme.foreground}>
              <img
                src="https://kmccaustralia.org/public/images/kmcc_logo.png"
                alt="Mosque Icon"
                width={40}
                height={40}
                style={{ marginRight: "8px" }}
              />
              <MuiLink href="/" underline="none" sx={{ display: "flex", alignItems: "center", color: theme.foreground }}>
                <span>KMCC</span>
              </MuiLink>
            </StyledLogo>
          </LogoContainer>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 1, minHeight: "40px" }}>
              {menuData
                ? menuData.items.map((item: any, index: number) => (
                    <NavButton key={index} href={`/${item.menuPage}`} customColor={theme.foreground}>
                      {item.menuName}
                    </NavButton>
                  ))
                : null}
            </Box>
          )}

          {/* Donate Button */}
          {!isMobile && (
            <DonateButton href="/donate" background={theme.accent} text={theme.foreground}>
              Donate Now
              <KeyboardArrowDown sx={{ transform: "rotate(-90deg)" }} />
            </DonateButton>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="inherit" onClick={handleMenuOpen} sx={{ color: theme.foreground }}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: withOpacity(theme.primary, 0.9),
                    color: theme.foreground,
                  },
                }}
              >
                {menuData.items.map((item: any, index: number) => (
                  <MenuItem key={index} onClick={handleMenuClose}>
                    <MuiLink href={`/${item.menuPage}`} underline="none" sx={{ color: theme.foreground }}>
                      {item.menuName}
                    </MuiLink>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}
