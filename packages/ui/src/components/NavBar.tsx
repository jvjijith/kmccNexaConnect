"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import ActionButton from "./ActionButton.js";
import Link from "./NavLink.js";
import useMediaQuery from "../hooks/useMediaQuery.js";

interface NavbarProps {
  isTopOfPage: boolean;
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

const Navbar = ({ isTopOfPage, menuData, fetchApi, theme, withOpacity }: NavbarProps) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isTopOfPage ? "transparent" : theme.background,
        boxShadow: isTopOfPage ? "none" : 1,
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box component="img" src={"https://kmccaustralia.org/public/images/kmcc_logo.png"} alt="logo" sx={{ height: 40 }} />

        {/* Desktop Menu */}
        {isAboveMediumScreens ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {menuData?.items?.map((item: any) => (
              <Link key={item.menuName} page={item.menuName} selectedPage={item.menuName} setSelectedPage={item.menuName} />
            ))}
            <Button color="inherit">Sign In</Button>
            <ActionButton setSelectedPage={"donate"}>Donate</ActionButton>
          </Box>
        ) : (
          <IconButton color="inherit" onClick={() => setIsMenuToggled(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={isMenuToggled} onClose={() => setIsMenuToggled(false)}>
        <Box sx={{ width: 250, display: "flex", flexDirection: "column", p: 2 }}>
          {/* Close Button */}
          <IconButton onClick={() => setIsMenuToggled(false)} sx={{ alignSelf: "flex-end" }}>
            <CloseIcon />
          </IconButton>

          {/* Menu Items */}
          <List>
          {menuData?.items?.map((item: any) => (
              <Link key={item.menuName} page={item.menuName} selectedPage={item.menuName} setSelectedPage={item.menuName} />
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
