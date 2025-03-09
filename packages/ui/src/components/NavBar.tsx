import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box, 
  Menu, 
  MenuItem, 
  IconButton, 
  useTheme, 
  useMediaQuery 
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
  menuData?: MenuDataType;
}

const Navbar: React.FC<NavbarProps> = ({ menuData = { menuName: '', items: [] } }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menuName: string) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveMenu(menuName);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveMenu(null);
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

          {/* Mobile Menu */}
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={(e) => handleMenuOpen(e, 'mobile')}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl && activeMenu === 'mobile')}
                onClose={handleMenuClose}
              >
                {menuData.items.map((item, index) => (
                  <MenuItem key={index} onClick={handleMenuClose} component="a" href={`/pages/${item.menuName.toLowerCase().replace(/ /g, '-')}`}> 
                    {item.menuName}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: "center" }}>
              {/* Desktop Navigation */}
              {menuData?.items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.menuType === 'multiple' && item.multiItems?.length ? (
                    <>
                      <Button
                        color="inherit"
                        onClick={(e) => handleMenuOpen(e, item.menuName)}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{ color: 'white', mx: 2, '&:hover': { color: '#FF5722' } }}
                      >
                        {item.menuName}
                      </Button>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl && activeMenu === item.menuName)}
                        onClose={handleMenuClose}
                      >
                        {item.multiItems.map((subItem, subIndex) => (
                          <MenuItem key={subIndex} onClick={handleMenuClose} component="a" href={`/${subItem.menuName.toLowerCase().replace(/ /g, '-')}`}> 
                            {subItem.menuName}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
                    <Button color="inherit" component="a" href={`/pages/${item.menuName.toLowerCase().replace(/ /g, '-')}`} sx={{ color: 'white', mx: 2, '&:hover': { color: '#FF5722' } }}>
                      {item.menuName}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </Box>
          )}

          {/* Donate Button */}
          {!isMobile && (
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
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;