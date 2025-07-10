"use client";

import React, { useEffect, useState, useCallback } from 'react';
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
  Collapse,
  Badge,
  Tooltip,
  ListItemIcon
} from '@mui/material';
import { 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Favorite as DonationIcon
} from '@mui/icons-material';
import { createDynamicTheme } from '@repo/ui/theme';
import { logoutUser, getCustomerIdFromToken, getAuthHeaders } from '../../../src/lib/auth';
import { getMembershipByCustomerId } from '../../../src/data/loader';

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const isMobile = useMediaQuery('(max-width:900px)');
  const isTablet = useMediaQuery('(max-width:1200px)');



  // Check login status function
  const checkLoginStatus = useCallback(() => {
    const userToken = localStorage.getItem('accessToken');
    const isLoggedInFlag = localStorage.getItem('isLoggedIn');
    const isUserLoggedIn = !!userToken && isLoggedInFlag === 'true';
    setIsLoggedIn(isUserLoggedIn);

    // Example cart count - replace with your actual cart logic
    const cartItems = localStorage.getItem('cartItems');
    setCartItemCount(cartItems ? JSON.parse(cartItems).length : 0);

    console.log("Login status checked:", isUserLoggedIn, "Token exists:", !!userToken, "Flag:", isLoggedInFlag);
  }, []);

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

    // Check login status on mount
    checkLoginStatus();

    // Listen for custom auth state changes
    const handleAuthStateChange = () => {
      checkLoginStatus();
    };

    // Add event listeners
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('authStateChanged', handleAuthStateChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, [checkLoginStatus]);

  // Check membership eligibility when login status changes

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

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      handleCloseUserMenu();
      setMobileOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to check if a menu item is active
  const isActive = (itemPath: string) => {
    // For home page
    if (itemPath === '/home' && activePath === '/home') {
      return true;
    }
    // For other pages
    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  const theme = createDynamicTheme({themes});

  // Get navbar colors from theme
  const navbarBgColor = themes?.navbar?.backgroundColor || (scrolled ? "rgba(245, 245, 220, 0.71)" : "rgba(255, 255, 255, 0.05)");
  const navbarTextColor = themes?.navbar?.textColor || (scrolled ? 'text.primary' : 'text.primary');

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: navbarBgColor,
          backdropFilter: scrolled ? "blur(10px)" : "blur(5px)",
          boxShadow: scrolled ? "0px 2px 4px rgba(0, 0, 0, 0.1)" : "none",
          transition: "all 0.3s ease",
          height: { xs: "60px", sm: "70px", md: "80px" },
          display: "flex",
          justifyContent: "center",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: "100%", justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, flex: { xs: 1, md: 'none' } }}>
              <Box 
                component="a"
                href="/"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minWidth: 0 }}
              >
                {/* Palm Tree Static Logo */}
                <Box 
                  component="img" 
                  src="/logo.png" 
                  alt="Logo" 
                  sx={{ 
                    height: { xs: 32, sm: 40, md: 60 },
                    mr: { xs: 0.5, sm: 1 },
                    flexShrink: 0
                  }} 
                />
                {/* Dynamic Logo */}
                <Box 
                  component="img" 
                  src={menuData.imageUrl} 
                  alt="Logo" 
                  sx={{ 
                    height: { xs: 32, sm: 40, md: 60 },
                    mr: { xs: 0.5, sm: 1 },
                    flexShrink: 0
                  }} 
                />
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                    color: navbarTextColor,
                    textDecoration: 'none',
                    display: { xs: 'none', sm: isTablet ? 'none' : 'block' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {/* {menuData.menuName} */}
                </Box>
              </Box>
            </Box>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                size="large"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ 
                  color: navbarTextColor,
                  ml: 'auto'
                }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}

            {/* Desktop Navigation Menu */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { sm: 1, md: 2 },
                flex: 1,
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {menuData.items.map((item, index) => {
                  const hasSubItems = item.multiItems && item.multiItems.length > 0;
                  const itemIsActive = isActive(`/${item.menuName.toLowerCase()}`);
                  
                  return (
                    <React.Fragment key={index}>
                      {hasSubItems ? (
                        <>
                          <Button
                            onClick={(e) => handleOpenNavMenu(e, index)}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                              color: itemIsActive ? 'primary.main' : navbarTextColor,
                              textTransform: 'none',
                              fontSize: { sm: '0.85rem', md: '1rem' },
                              fontWeight: itemIsActive ? 700 : 500,
                              px: { sm: 1, md: 2 },
                              minWidth: 'auto',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'primary.main'
                              },
                            }}
                          >
                            {item.menuName}
                          </Button>
                          <Menu
                            anchorEl={anchorElNav}
                            open={openMenuIndex === index}
                            onClose={handleCloseNavMenu}
                            slotProps={{
                              paper: {
                                sx: {
                                  backgroundColor: 'background.paper',
                                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                  borderRadius: '8px',
                                  mt: 1,
                                }
                              }
                            }}
                          >
                            {item.multiItems?.map((subItem, subIndex) => (
                              <MenuItem 
                                key={subIndex} 
                                onClick={handleCloseNavMenu}
                                component="a"
                                href={`/${subItem.menuName.toLowerCase().replace(/\s+/g, '-')}`}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText'
                                  }
                                }}
                              >
                                {subItem.menuName}
                              </MenuItem>
                            ))}
                          </Menu>
                        </>
                      ) : (
                        <Button
                          href={`/${item.menuName.toLowerCase()}`}
                          sx={{
                            color: itemIsActive ? 'primary.main' : navbarTextColor,
                            textTransform: 'none',
                            fontSize: { sm: '0.85rem', md: '1rem' },
                            fontWeight: itemIsActive ? 700 : 500,
                            px: { sm: 1, md: 2 },
                            minWidth: 'auto',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'primary.main'
                            },
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
            
            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 2 },
              ml: 'auto'
            }}>
              {/* Donation Button */}
              {!isMobile && (
                <Button
                  variant="contained"
                  href="/donation"
                  startIcon={<DonationIcon />}
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                    textTransform: 'none',
                    fontSize: { sm: '0.8rem', md: '0.9rem' },
                    fontWeight: 600,
                    px: { sm: 1.5, md: 2 },
                    display: { xs: 'none', sm: isTablet ? 'none' : 'flex' }
                  }}
                >
                  Donate
                </Button>
              )}

              {/* Membership Button - Always show */}
              {!isMobile && (
                <Button
                  variant="contained"
                  href={isLoggedIn ? "/membership" : "/login"}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    textTransform: 'none',
                    fontSize: { sm: '0.8rem', md: '0.9rem' },
                    fontWeight: 600,
                    px: { sm: 1.5, md: 2 },
                    display: { xs: 'none', sm: isTablet ? 'none' : 'flex' }
                  }}
                >
                  Membership
                </Button>
              )}

              {/* Login/Profile Section */}
              {isLoggedIn ? (
                <>
                  {/* Cart Icon - Only show when logged in */}
                  <Tooltip title="Cart">
                    <IconButton
                      component="a"
                      href="/cart"
                      sx={{
                        p: { xs: 0.5, sm: 1 },
                        color: navbarTextColor
                      }}
                    >
                      <Badge badgeContent={cartItemCount} color="error">
                        <ShoppingCartIcon sx={{ fontSize: { xs: 28, sm: 32 } }} color="primary" />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Profile Dropdown */}
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: { xs: 0.5, sm: 1 },
                        color: navbarTextColor
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: { xs: 28, sm: 32 } }} color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="profile-menu"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    slotProps={{
                      paper: {
                        sx: {
                          backgroundColor: 'background.paper',
                          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                          minWidth: 200,
                        }
                      }
                    }}
                  >
                    <MenuItem component="a" href="/profile" onClick={handleCloseUserMenu}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  href="/login"
                  sx={{
                    color: navbarTextColor,
                    borderColor: navbarTextColor,
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    },
                    textTransform: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                    px: { xs: 1.5, sm: 2 }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'background.paper',
            top: { xs: '60px', sm: '70px' },
            height: 'calc(100vh - 60px)',
            width: '100%',
            overflowY: 'auto'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            {menuData.items.map((item, index) => {
              const hasSubItems = item.multiItems && item.multiItems.length > 0;
              const isExpanded = expandedMobileMenus.includes(index);
              const itemIsActive = isActive(`/${item.menuName.toLowerCase()}`);
              
              return (
                <React.Fragment key={index}>
                  <ListItem 
                    onClick={hasSubItems ? () => toggleMobileSubmenu(index) : undefined}
                    component={hasSubItems ? "div" : "a"}
                    href={hasSubItems ? undefined : `/${item.menuName.toLowerCase()}`}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: itemIsActive ? 'primary.light' : 'transparent',
                      color: itemIsActive ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      },
                      borderRadius: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemText 
                      primary={item.menuName}
                      sx={{
                        fontWeight: itemIsActive ? 700 : 400
                      }}
                    />
                    {hasSubItems && (
                      isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    )}
                  </ListItem>
                  
                  {hasSubItems && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.multiItems?.map((subItem, subIndex) => (
                          <ListItem 
                            key={subIndex} 
                            component="a"
                            href={`/${subItem.menuName.toLowerCase().replace(/\s+/g, '-')}`}
                            sx={{ 
                              pl: 4,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText'
                              },
                              borderRadius: 1,
                              mb: 0.5
                            }}
                          >
                            <ListItemText primary={subItem.menuName} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Mobile Profile/Login Section */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              {isLoggedIn ? (
                <>
                  <ListItem component="a" href="/profile" sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    },
                    borderRadius: 1,
                    mb: 0.5
                  }}>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem component="a" href="/cart" sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    },
                    borderRadius: 1,
                    mb: 0.5
                  }}>
                    <ListItemIcon>
                      <Badge badgeContent={cartItemCount} color="error">
                        <ShoppingCartIcon color="primary" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Cart" />
                  </ListItem>
                  <ListItem onClick={handleLogout} sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    },
                    borderRadius: 1,
                    mb: 0.5
                  }}>
                    <ListItemIcon>
                      <LogoutIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              ) : (
                <ListItem component="a" href="/login" sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  },
                  borderRadius: 1,
                  mb: 0.5
                }}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              )}
              {/* Donation Button for Mobile */}
              <ListItem component="a" href="/donation" sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                },
                borderRadius: 1,
                mb: 0.5
              }}>
                <ListItemIcon>
                  <DonationIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Donate" />
              </ListItem>
              {/* Membership Button for Mobile - Always show */}
              <ListItem component="a" href={isLoggedIn ? "/membership" : "/login"} sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                },
                borderRadius: 1
              }}>
                <ListItemText primary="Membership" />
              </ListItem>
            </Box>
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;