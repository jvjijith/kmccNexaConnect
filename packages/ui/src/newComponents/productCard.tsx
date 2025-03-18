import React, { useState } from "react";
import { Box, Typography, IconButton } from "@repo/ui/mui";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard: React.FC<{ product: any; }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: { xs: "95%", sm: "90%", md: "85%" },
        maxWidth: "300px",
        pb: 2,
      }}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        //   borderRadius: "50% 50% 30% 30%",
        //   backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          mb: 1,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "contain",
          }}
        />
        
        {/* Cart icon overlay that appears on hover */}
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "inherit",
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          textTransform: "uppercase", 
          letterSpacing: 1,
          textAlign: "center",
          color: "#333",
          mb: 1
        }}
      >
        {product.name}
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: "#666", 
          fontStyle: "italic",
          mb: 2,
          textAlign: "center" 
        }}
      >
        {product.description}
      </Typography>
      
      {product.price &&
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 500,
          color: "#333" 
        }}
      >
        ${product.price}
      </Typography>}
    </Box>
  );
};

export default ProductCard;