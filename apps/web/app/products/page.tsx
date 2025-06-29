"use client"

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Rating, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Paper,
  Fade,
  Zoom,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Sort as SortIcon
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { getCatalog, getProduct, addToCart } from "../../src/data/loader";

// Types
interface ProductImage {
  url: string;
  _id: string;
  altText?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  images: ProductImage[];
  price: number;
  rating?: number;
  isBestseller?: boolean;
  stock?: number;
  category?: string;
  brand?: string;
  tags?: string[];
}

// Product Card Skeleton
const ProductCardSkeleton = () => (
  <Card sx={{ 
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }}>
    <Skeleton variant="rectangular" height={250} />
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
        ))}
      </Box>
      <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={16} width="80%" sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="circular" width={48} height={48} />
      </Box>
    </CardContent>
  </Card>
);

// Product Card Component
const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (productId: string, price: number) => void;
  addingToCart: boolean;
}> = ({ product, onAddToCart, addingToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Fade in timeout={600}>
      <Card sx={{
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        }
      }}>
        {/* Badges */}
        {product.isBestseller && (
          <Chip
            label="BESTSELLER"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'error.main',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              zIndex: 2
            }}
          />
        )}

        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <Chip
            label={`Only ${product.stock} left`}
            size="small"
            color="warning"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 600,
              fontSize: '0.75rem',
              zIndex: 2
            }}
          />
        )}

        {/* Favorite Button */}
        <Button
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            zIndex: 3,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: 'error.main', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          )}
        </Button>

        {/* Product Image */}
        <Box sx={{ 
          position: 'relative',
          height: 250,
          overflow: 'hidden',
          background: 'linear-gradient(45deg, #f5f5f5 0%, #e0e0e0 100%)'
        }}>
          <Image
            src={product.images?.[0]?.url || '/api/placeholder/400/300'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
            }}
          />
        </Box>

        {/* Product Content */}
        <CardContent sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3
        }}>
          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Typography>

          {/* Brand */}
          {product.brand && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontSize: '0.875rem' }}
            >
              {product.brand}
            </Typography>
          )}

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              value={product.rating || 4.5}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.rating?.toFixed(1) || '4.5'})
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 3,
              lineHeight: 1.5,
              flex: 1
            }}
          >
            {product.description}
          </Typography>

          {/* Price and Add to Cart */}
          <Box sx={{
            mt: 'auto',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              ${product.price?.toFixed(2) || '0.00'}
            </Typography>

            <Button
              variant="contained"
              onClick={() => onAddToCart(product._id, product.price || 0)}
              disabled={addingToCart || product.stock === 0}
              startIcon={addingToCart ? undefined : <CartIcon />}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                background: product.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: product.stock === 0 ? 'none' : '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: product.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  transform: product.stock === 0 ? 'none' : 'translateY(-2px)',
                  boxShadow: product.stock === 0 ? 'none' : '0 6px 10px 2px rgba(33, 203, 243, .3)',
                },
                '&:disabled': {
                  color: 'white'
                }
              }}
            >
              {addingToCart ? (
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Main Products Page Component
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [addingToCart, setAddingToCart] = useState<{[key: string]: boolean}>({});
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  const productsPerPage = 12;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // This is a placeholder - replace with actual catalog fetching
        const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
          _id: `product-${i + 1}`,
          name: `Amazing Product ${i + 1}`,
          description: `This is a fantastic product with amazing features that will enhance your daily life. Product ${i + 1} offers exceptional quality and value.`,
          images: [{ url: `/api/placeholder/400/300`, _id: `img-${i}` }],
          price: Math.floor(Math.random() * 200) + 20,
          rating: Math.floor(Math.random() * 2) + 3.5,
          isBestseller: Math.random() > 0.7,
          stock: Math.floor(Math.random() * 50) + 1,
          category: ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
          brand: ['Brand A', 'Brand B', 'Brand C'][Math.floor(Math.random() * 3)]
        }));
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle add to cart
  const handleAddToCart = async (productId: string, price: number) => {
    try {
      setAddingToCart(prev => ({...prev, [productId]: true}));
      
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setSnackbar({
          open: true,
          message: "Please login to add items to cart",
          severity: 'error'
        });
        return;
      }
      
      const cartData = {
        productId,
        quantity: 1,
        price,
        notes: ""
      };
      
      const customHeaders = {
        "Authorization": `Bearer ${accessToken}`,
      };
      
      await addToCart(cartData, customHeaders);
      
      setSnackbar({
        open: true,
        message: "Item added to cart successfully!",
        severity: 'success'
      });
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Failed to add item to cart",
        severity: 'error'
      });
    } finally {
      setAddingToCart(prev => ({...prev, [productId]: false}));
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || product.category === filterCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 2,
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Our Products
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          Discover our amazing collection of high-quality products designed to enhance your lifestyle
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Results Count */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {filteredProducts.length} products found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
            No products found matching your criteria. Try adjusting your search or filters.
          </Alert>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Zoom in timeout={200 + (index * 100)}>
                  <div>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      addingToCart={addingToCart[product._id] || false}
                    />
                  </div>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({...prev, open: false}))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsPage;