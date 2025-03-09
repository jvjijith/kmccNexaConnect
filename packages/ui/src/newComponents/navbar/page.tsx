import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Box, Skeleton } from "@mui/material";

type NavbarProps = {
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
};

const Navbar: React.FC<NavbarProps> = ({ isTopOfPage, menuData, fetchApi, theme, withOpacity }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isTopOfPage ? "transparent" : "#FFE1E0",
        boxShadow: isTopOfPage ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2%",
          minHeight: "80px",
        }}
      >
        {/* Logo & Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          {!menuData || loading ? (
            <Skeleton variant="circular" sx={{ marginLeft: "200px" }} width={60} height={60} />
          ) : (
            <img src={menuData.imageUrl} alt="EVOGYM" style={{ height: "60px", marginLeft: "200px" }} />
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, marginLeft: "10px" }}>
            {!menuData || loading ? (
              <Skeleton variant="rectangular" width={80} height={30} />
            ) : (
              <span style={{ fontSize: "1.25rem" }}>KMCC</span>
            )}
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, marginLeft: "30px" }}>
          {!menuData || loading
            ? [1, 2, 3, 4].map((_, index) => <Skeleton key={index} variant="text" width={80} height={30} />)
            : menuData.items.map((item: any, index: number) => (
                <Button
                  key={index}
                  href={item?.menuName.toLowerCase()}
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                    fontSize: "1rem",
                    "&:hover": { backgroundColor: "transparent", color: "#FF6B6B" },
                  }}
                >
                  {item.menuName}
                </Button>
              ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginRight: "200px" }}>
          {!menuData || loading ? (
            <>
              <Skeleton variant="rectangular" width={80} height={30} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </>
          ) : (
            <>
              <Button
                variant="text"
                sx={{
                  color: "black",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "transparent", color: "#FF6B6B" },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFB627",
                  color: "black",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#FFC045" },
                }}
              >
                Become a Member
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
