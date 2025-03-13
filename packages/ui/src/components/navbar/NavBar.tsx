"use client";

import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box, 
  Menu, 
  MenuItem, 
  IconButton,
  ThemeProvider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { createDynamicTheme } from '@repo/ui/theme/theme';

interface MenuItemType {
  menuName: string;
  menuType: string;
  multiItems?: { menuName: string }[];
}

interface MenuDataType {
  menuName: string;
  items: MenuItemType[];
  imageUrl: string;
}

interface NavbarProps {
  menuData: MenuDataType;
  themes: any;
}

const Navbar: React.FC<NavbarProps> = ({ menuData, themes }) => {
  // Add state for dropdown menus
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null);
  const [activePath, setActivePath] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<number[]>([]);
  
  const isMobile = useMediaQuery('(max-width:1000px)');
  const isHomePage = activePath === '/home';

  // Update active path when component mounts or path changes
  useEffect(() => {
    // Get the current path from window.location
    const path = window.location.pathname;
    setActivePath(path);
    
    // Listen for path changes
    const handleRouteChange = () => {
      setActivePath(window.location.pathname);
    };

    // Handle scroll events
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorElNav(event.currentTarget);
    setOpenMenuIndex(index);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setOpenMenuIndex(null);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleMobileSubmenu = (index: number) => {
    setExpandedMobileMenus(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Function to check if a menu item is active
  const isActive = (itemPath: string) => {
    // For home page
    if (itemPath === '/' && activePath === '/') {
      return true;
    }
    // For other pages
    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  const theme = createDynamicTheme({themes});

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled 
            ? "rgba(0, 0, 0, 0.85)" 
            : "rgba(255, 255, 255, 0)",
          boxShadow: scrolled ? "0px 2px 4px rgba(0, 0, 0, 0.1)" : "none",
          transition: "background-color 0.3s ease",
          height: { xs: "70px", md: "80px" },
          display: "flex",
          justifyContent: "center",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: "100%", justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box 
                component="a"
                href="/"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <Box 
                  component="img" 
                  src={menuData.imageUrl} 
                  alt="Logo" 
                  sx={{ 
                    height: { xs: 40, md: 60 },
                    mr: 1
                  }} 
                />
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: scrolled ? 'white' : 'text.primary',
                    display: { xs: 'none', sm: 'inline' }
                  }}
                >
                  {menuData.menuName}
                </Box>
              </Box>
            </Box>
            
            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ 
                  color: isHomePage ? 'white' : scrolled ? 'white' : 'text.primary'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: "center",
                alignItems: "center",
                ml: 'auto',
                mr: 2
              }}>
                {menuData?.items?.map((item, index) => {
                  const itemPath = `/${item.menuName.toLowerCase().replace(/ /g, '-')}`;
                  const active = isActive(itemPath);

                  return (
                    <React.Fragment key={index}>
                      {item.menuType === 'multiple' && item.multiItems?.length ? (
                        <>
                          <Button
                            onClick={(e) => handleOpenNavMenu(e, index)}
                            aria-controls={openMenuIndex === index ? `menu-${index}` : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenuIndex === index ? 'true' : undefined}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ 
                              color: active 
                                ? 'primary.main' 
                                : isHomePage ? 'white' : scrolled ? 'white' : 'text.primary', 
                              mx: 1.5, 
                              '&:hover': { color: 'primary.main' },
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              textTransform: 'none'
                            }}
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
                            {item.multiItems.map((subItem, subIndex) => {
                              const subItemPath = `/${subItem.menuName.toLowerCase().replace(/ /g, '-')}`;
                              const subActive = isActive(subItemPath);
                              
                              return (
                                <MenuItem 
                                  key={subIndex} 
                                  component="a" 
                                  href={subItemPath}
                                  onClick={handleCloseNavMenu}
                                  sx={{
                                    color: subActive ? 'primary.main' : 'inherit',
                                    backgroundColor: subActive ? 'action.hover' : 'inherit',
                                    '&:hover': { backgroundColor: 'action.hover' }
                                  }}
                                > 
                                  {subItem.menuName}
                                </MenuItem>
                              );
                            })}
                          </Menu>
                        </>
                      ) : (
                        <Button 
                          component="a" 
                          href={itemPath} 
                          sx={{ 
                            color: active 
                              ? 'primary.main' 
                              : isHomePage ? 'white' : scrolled ? 'white' : 'text.primary', 
                            mx: 1.5, 
                            '&:hover': { color: 'primary.main' },
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500
                          }}
                        >
                          {item.menuName}
                        </Button>
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            )}
            
            {/* Contact/Donate Button */}
            {/* {!isMobile && (
              <Button
                variant="contained"
                color="primary"
                href="/contact"
                sx={{
                  borderRadius: '4px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'primary.dark' },
                  whiteSpace: 'nowrap'
                }}
              >
                Contact
              </Button>
            )} */}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '75%', 
            maxWidth: '300px',
            boxSizing: 'border-box',
            bgcolor: 'background.paper'
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {menuData?.items?.map((item, index) => {
            const itemPath = item.menuName.toLowerCase() === 'home' 
              ? '/' 
              : `/${item.menuName.toLowerCase().replace(/ /g, '-')}`;
            const active = isActive(itemPath);
            const isExpanded = expandedMobileMenus.includes(index);

            return (
              <React.Fragment key={index}>
                {item.menuType === 'multiple' && item.multiItems?.length ? (
                  <>
                    <ListItem 
                      onClick={() => toggleMobileSubmenu(index)}
                      sx={{ 
                        color: active ? 'primary.main' : 'text.primary',
                        bgcolor: active ? 'action.selected' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemText primary={item.menuName} />
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.multiItems.map((subItem, subIndex) => {
                          const subItemPath = `/${subItem.menuName.toLowerCase().replace(/ /g, '-')}`;
                          const subActive = isActive(subItemPath);
                          
                          return (
                            <ListItem  
                              key={subIndex}
                              component="a"
                              href={subItemPath}
                              onClick={toggleMobileMenu}
                              sx={{ 
                                pl: 4,
                                color: subActive ? 'primary.main' : 'text.secondary',
                                bgcolor: subActive ? 'action.selected' : 'transparent',
                                textDecoration: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <ListItemText primary={subItem.menuName} />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem 
                    component="a"
                    href={itemPath}
                    onClick={toggleMobileMenu}
                    sx={{ 
                      color: active ? 'primary.main' : 'text.primary',
                      bgcolor: active ? 'action.selected' : 'transparent',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText primary={item.menuName} />
                  </ListItem>
                )}
              </React.Fragment>
            );
          })}
          {/* <ListItem sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href="/contact"
              fullWidth
              sx={{
                borderRadius: '4px',
                py: 1,
                textTransform: 'none'
              }}
            >
              Contact
            </Button>
          </ListItem> */}
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;