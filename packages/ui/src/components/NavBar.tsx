"use client"; // Add this at the top to mark it as a client component

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box, 
  Menu, 
  MenuItem, 
  IconButton
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface MenuItemType {
  menuName: string;
  menuType: string;
  multiItems?: { menuName: string }[];
}

interface MenuDataType {
  menuName: string;
  items: MenuItemType[];
}

interface NavbarProps {
  menuData: MenuDataType;
}

const Navbar: React.FC<NavbarProps> = ({ menuData }) => {
  // Add state for dropdown menus
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorElNav(event.currentTarget);
    setOpenMenuIndex(index);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setOpenMenuIndex(null);
  };

  return (
    <AppBar
      position="absolute"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "none",
        width: "100vw",
        height: "150px",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ width: "100%", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 20 }}>
            <Box 
              component="img" 
              src="https://demo.awaikenthemes.com/avenix/wp-content/uploads/2024/08/logo-2.svg" 
              alt="Logo" 
              sx={{ height: 60, mr: 1 }} 
            />
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: "center" }}>
            {menuData?.items?.map((item, index) => (
              <React.Fragment key={index}>
                {item.menuType === 'multiple' && item.multiItems?.length ? (
                  <>
                    <Button
                      color="inherit"
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{ color: 'white', mx: 2, '&:hover': { color: '#FF5722' } }}
                      onClick={(e) => handleOpenNavMenu(e, index)}
                      aria-controls={openMenuIndex === index ? `menu-${index}` : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenuIndex === index ? 'true' : undefined}
                    >
                      {item.menuName}
                    </Button>
                    <Menu
                      id={`menu-${index}`}
                      anchorEl={anchorElNav}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={openMenuIndex === index}
                      onClose={handleCloseNavMenu}
                    >
                      {item.multiItems.map((subItem, subIndex) => (
                        <MenuItem 
                          key={subIndex} 
                          component="a" 
                          href={`/${subItem.menuName.toLowerCase().replace(/ /g, '-')}`}
                          onClick={handleCloseNavMenu}
                        > 
                          {subItem.menuName}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Button 
                    color="inherit" 
                    component="a" 
                    href={`/${item.menuName.toLowerCase().replace(/ /g, '-')}`} 
                    sx={{ color: 'white', mx: 2, '&:hover': { color: '#FF5722' } }}
                  >
                    {item.menuName}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </Box>
          
          {/* Donate Button */}
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#FF5722',
              borderRadius: '50px',
              px: 3,
              ml: 30,
              height: "80px",
              width: "250px",
              '&:hover': { bgcolor: '#E64A19' }
            }}
          >
            Donate Now
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;