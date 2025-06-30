import React, { useEffect, useState, Suspense } from "react";
import { Box, useTheme, useMediaQuery, Typography, ThemeProvider, Skeleton, Button, Chip } from "@repo/ui/mui";
import { Snackbar, Alert } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { CalendarToday, LocationOn, Star, Add } from '@mui/icons-material';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { createDynamicTheme } from "@repo/ui/theme";
import { getCatalog, getPageById, getProduct, getEvent, addToCart } from "../data/loader";
import Link from "next/link";

// Define types
interface PageData {
  slug?: string;
  portraitImage?: string;
  landscapeImage?: string;
  bannerImage?: string;
  title?: any[];
  metaDescription?: any[];
  referenceName?: string;
  [key: string]: any;
}

interface ProductData {
  _id?: string;
  name?: string;
  description?: string;
  images?: { url: string; _id: string }[];
  price?: number;
  rating?: number;
  isBestseller?: boolean;
  stock?: number;
  [key: string]: any;
}

interface EventData {
  _id?: string;
  name?: string;
  description?: string;
  location?: string;
  startingDate?: string;
  endingDate?: string;
  priceConfig?: {
    type: string;
    amount: number;
    dependantField: string;
  };
  metadata?: {
    name?: string;
    description?: string;
    imageUrl?:string;
  };
  [key: string]: any;
}

interface SlideData {
  id: string;
  type: 'page' | 'product' | 'event';
  image?: string;
  title: string;
  description: string;
  link: string;
  price?: number;
  rating?: number;
  isBestseller?: boolean;
  location?: string;
  date?: string;
  stock?: number;
  cardOptions?: {
    actionButtonText: string;
    actionButtonUrl: string;
    actionButtonPosition: string;
  };
  withDescription?: boolean;
}

// Format date for events
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Create a skeleton loader component for product cards
const ProductCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      width: "100%",
      maxWidth: { xs: "280px", sm: "300px", md: "320px" },
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      backgroundColor: theme.palette.background.paper,
    }}>
      {/* Image skeleton */}
      <Skeleton variant="rectangular" width="100%" sx={{height:{ xs: 200, sm: 220, md: 240 }}} />
      
      {/* Content skeleton */}
      <Box sx={{ padding: 3 }}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: 2 }} />
        
        {/* Rating skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
          ))}
          <Skeleton variant="text" width="30%" height={20} sx={{ ml: 1 }} />
        </Box>
        
        {/* Description skeleton */}
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 3 }} />
        
        {/* Price and button skeleton */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="circular" width={48} height={48} />
        </Box>
      </Box>
    </Box>
  );
};

// Create a skeleton loader component for event cards
const EventCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      width: "100%",
      maxWidth: { xs: "280px", sm: "300px", md: "350px" },
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      backgroundColor: theme.palette.background.paper,
    }}>
      {/* Image skeleton */}
      <Skeleton variant="rectangular" width="100%" sx={{height:{ xs: 200, sm: 220, md: 240 }}} />
      
      {/* Content skeleton */}
      <Box sx={{ padding: 3 }}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: 2 }} />
        
        {/* Date and location skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        
        {/* Description skeleton */}
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 3 }} />
        
        {/* Button skeleton */}
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
};

// Create a skeleton loader component for the slider
const SliderSkeleton = ({ slidesPerView = 3, isEventType = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ 
      width: "100%",
      display: "flex",
      gap: 3,
      justifyContent: "center",
      overflowX: "auto",
      pb: 2
    }}>
      {[...Array(isMobile ? 1 : isTablet ? 2 : slidesPerView)].map((_, index) => (
        <Box key={index} sx={{ 
          minWidth: isEventType ? { xs: "280px", sm: "300px", md: "350px" } : { xs: "280px", sm: "300px", md: "320px" }
        }}>
          {isEventType ? <EventCardSkeleton /> : <ProductCardSkeleton />}
        </Box>
      ))}
    </Box>
  );
};

// Main component logic
const SliderContent: React.FC<{ elementData: any; themes: any }> = ({ elementData, themes }) => {
  // Use state to store data
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventType, setIsEventType] = useState(false);
  const [addingToCart, setAddingToCart] = useState<{[key: string]: boolean}>({});
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Create dynamic theme
  const theme = createDynamicTheme({themes});
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Extract swiper options from elementData
  const {
    slidesPerView = 3,
    swiperType = "portrait",
    spaceBetween = 24,
    loop = true,
    autoplay = { delay: 5, disableOnInteraction: false },
    effect = "none",
    speed = 1,
  } = elementData?.swiperOptions || {};

  // Get responsive breakpoints configuration
  const getResponsiveConfig = () => {
    return {
      320: {  // for phones
        slidesPerView: 1,
        spaceBetween: 16
      },
      768: {  // for tablets
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: { // for desktop
        slidesPerView: Math.min(slidesPerView, 4),
        spaceBetween: spaceBetween
      }
    };
  };

  // Set up modules based on options
  const swiperModules = [Navigation, Pagination];
  
  // Add Autoplay module if autoplay is enabled
  if (autoplay && autoplay.delay !== undefined) {
    swiperModules.push(Autoplay);
  }
  
  // Add EffectFade module if effect is fade
  if (effect === "fade") {
    swiperModules.push(EffectFade);
  }

  // Get page info
  const getPageInfo = (page: PageData): SlideData => {
    return {
      id: page._id || '',
      type: 'page',
      image: getPageImage(page),
      title: getPageTitle(page),
      description: getPageDescription(page),
      link: page.slug ? `/${page.slug}` : '#'
    };
  };

  // Get product info
  const getProductInfo = (product: ProductData, productId: string): SlideData => {
    return {
      id: productId,
      type: 'product',
      image: product.images && product.images.length > 0 ? product.images[0]?.url : '/api/placeholder/400/300',
      title: product.name || 'Product',
      description: product.description || 'No description available',
      link: productId ? `/product/${productId}` : '#',
      price: product.price || 0,
      rating: product.rating || 4.5,
      isBestseller: product.isBestseller || false,
      stock: product.stock || 0
    };
  };

  // Get event info
  const getEventInfo = (event: EventData, eventId: string): SlideData => {
    return {
      id: eventId,
      type: 'event',
      image: event.metadata?.imageUrl || '/api/placeholder/400/300',
      title: event.name || event.metadata?.name || 'Event',
      description: event.description || event.metadata?.description || 'No description available',
      link: eventId ? `/event/${eventId}` : '#',
      price: event.priceConfig?.amount || 0,
      location: event.location || 'Location TBA',
      date: event.startingDate,
      cardOptions: {
        actionButtonText: 'Register Now',
        actionButtonUrl: `/event/${eventId}`,
        actionButtonPosition: 'bottom'
      },
      withDescription: true
    };
  };

  // Get appropriate image based on swiperType
  const getPageImage = (page: PageData) => {
    if (swiperType === "portrait" && page.portraitImage) {
      return page.portraitImage;
    } else if (swiperType === "landscape" && page.landscapeImage) {
      return page.landscapeImage;
    } else if (page.bannerImage) {
      return page.bannerImage;
    }
    return "/api/placeholder/400/300";
  };

  // Get title text from the page title array
  const getPageTitle = (page: PageData) => {
    if (page.title && page.title.length > 0) {
      return page?.title[0]?.title;
    }
    return page.referenceName || "Page";
  };

  // Get description text from the page metaDescription array
  const getPageDescription = (page: PageData) => {
    if (page.metaDescription && page.metaDescription.length > 0) {
      return page?.metaDescription[0]?.description;
    }
    return "No description available";
  };

  // Handle add to cart with better error handling and user feedback
  const handleAddToCart = async (productId: string, price: number) => {
    try {
      // Set loading state for this specific product
      setAddingToCart(prev => ({...prev, [productId]: true}));
      
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setSnackbar({
          open: true,
          message: "Please login to add items to cart",
          severity: 'error'
        });
        return;
      }
      
      // Prepare request data
      const cartData = {
        productId,
        quantity: 1,
        price,
        notes: ""
      };
      
      // Custom headers with authorization token
      const customHeaders = {
        "Authorization": `Bearer ${accessToken}`,
      };
      
      // Call the addToCart function from loader
      const result = await addToCart(cartData, customHeaders);
      
      // Show success message
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
      // Reset loading state
      setAddingToCart(prev => ({...prev, [productId]: false}));
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };

  // Use useEffect to fetch data only once
  useEffect(() => {
    const fetchData = async () => {
      const fetchedSlides: SlideData[] = [];
      
      if (elementData?.items && elementData.items.length > 0) {
        for (const item of elementData.items) {
          if (item.itemType === "Page") {
            try {
              const pageData = await getPageById(item.itemId);
              if (pageData) {
                fetchedSlides.push(getPageInfo(pageData));
              }
            } catch (error) {
              console.error(`Error fetching page ${item.itemId}:`, error);
            }
          } else if (item.itemType === "Catalogue") {
            try {
              const catalogData = await getCatalog(item.itemId);
              
              // Check if the catalog is an event type
              if (catalogData && catalogData.dataType === "event") {
                setIsEventType(true);
                // Handle event IDs
                if (catalogData.eventIds && catalogData.eventIds.length > 0) {
                  for (const eventId of catalogData.eventIds) {
                    try {
                      const eventData = await getEvent(eventId);
                      if (eventData) {
                        fetchedSlides.push(getEventInfo(eventData, eventId));
                      }
                    } catch (error) {
                      console.error(`Error fetching event ${eventId}:`, error);
                    }
                  }
                }
              } else if (catalogData && catalogData.productIds && catalogData.productIds.length > 0) {
                // Handle product IDs
                for (const productId of catalogData.productIds) {
                  try {
                    const productData = await getProduct(productId);
                    if (productData) {
                      fetchedSlides.push(getProductInfo(productData, productId));
                    }
                  } catch (error) {
                    console.error(`Error fetching product ${productId}:`, error);
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching catalog ${item.itemId}:`, error);
            }
          }
        }
      }
      
      setSlides(fetchedSlides);
      setIsLoading(false);
    };

    fetchData();
  }, [elementData, swiperType]);

  // Render star rating
  const renderRating = (rating: number = 4.5) => {
    const fullStars = Math.floor(rating);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            sx={{
              fontSize: 16,
              color: i < fullStars ? 'warning.main' : 'grey.300',
              mr: 0.25
            }}
          />
        ))}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            ml: 1,
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  if (isLoading) {
    return <SliderSkeleton slidesPerView={slidesPerView} isEventType={isEventType} />;
  }

  if (slides.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="info">
          No items available to display at the moment.
        </Alert>
      </Box>
    );
  }

  // Render product card with improved styling
  const renderProductCard = (slide: SlideData, index: number) => (
    <Box sx={{
      width: "100%",
      maxWidth: { xs: "280px", sm: "300px", md: "320px" },
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      backgroundColor: 'background.paper',
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.15)"
      }
    }}>
      {/* Bestseller badge */}
      {slide.isBestseller && (
        <Chip
          label="BESTSELLER"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: 'error.main',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.75rem',
            zIndex: 2,
            '& .MuiChip-label': {
              px: 1.5
            }
          }}
        />
      )}

      {/* Stock indicator */}
      {slide.stock !== undefined && slide.stock < 10 && slide.stock > 0 && (
        <Chip
          label={`Only ${slide.stock} left`}
          size="small"
          color="warning"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 600,
            fontSize: '0.75rem',
            zIndex: 2
          }}
        />
      )}

      {/* Image section */}
      <Box sx={{ 
        width: "100%",
        position: 'relative',
        height: { xs: 200, sm: 220, md: 240 },
        overflow: 'hidden',
        background: 'linear-gradient(45deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}>
        <img
          src={slide.image}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
          }}
        />
      </Box>

      {/* Content section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 3
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            mb: 1.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary'
          }}
        >
          {slide.title}
        </Typography>

        {/* Rating */}
        <Box sx={{ mb: 1.5 }}>
          {renderRating(slide.rating)}
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
            mb: 2,
            lineHeight: 1.5,
            fontSize: '0.875rem'
          }}
        >
          {slide.description}
        </Typography>

        {/* Price and Cart Button */}
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
            ${slide.price?.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            onClick={() => handleAddToCart(slide.id, slide.price || 0)}
            disabled={addingToCart[slide.id] || slide.stock === 0}
            startIcon={addingToCart[slide.id] ? undefined : <Add />}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              background: slide.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: slide.stock === 0 ? 'none' : '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: slide.stock === 0 ? 'grey.400' : 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                transform: slide.stock === 0 ? 'none' : 'translateY(-2px)',
                boxShadow: slide.stock === 0 ? 'none' : '0 6px 10px 2px rgba(33, 203, 243, .3)',
              },
              '&:disabled': {
                color: 'white'
              }
            }}
          >
            {addingToCart[slide.id] ? (
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
            ) : slide.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // Render event card with improved styling
  const renderEventCard = (slide: SlideData, index: number) => (
    <Box sx={{
      width: "100%",
      maxWidth: { xs: "280px", sm: "300px", md: "350px" },
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      backgroundColor: 'background.paper',
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: 'flex',
      flexDirection: 'column',
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.15)"
      }
    }}>
      {/* Image section */}
      <Box sx={{ 
        width: "100%",
        position: 'relative',
        height: { xs: 200, sm: 220, md: 240 },
        overflow: 'hidden',
        background: 'linear-gradient(45deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}>
        <img
          src={slide.image || '/api/placeholder/400/300'}
          alt={slide.title || `Event ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
          }}
        />
        
        {/* Event type badge */}
        <Chip
          label="EVENT"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: 'primary.main',
            color: 'text.secondary',
            fontWeight: 700,
            fontSize: '0.75rem',
            zIndex: 2
          }}
        />
      </Box>

      {/* Content section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 3
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            color: 'text.primary'
          }}
        >
          {slide.title}
        </Typography>

        {/* Date and Location */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            gap: 1
          }}>
            <CalendarToday sx={{
              fontSize: 18,
              color: 'primary.main'
            }} />
            <Typography
              variant="body2"
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {formatDate(slide.date || '')}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <LocationOn sx={{
              fontSize: 18,
              color: 'primary.main'
            }} />
            <Typography
              variant="body2"
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.primary',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {slide.location || 'Location TBA'}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 3,
            lineHeight: 1.5,
            flex: 1
          }}
        >
          {slide.description}
        </Typography>

        {/* Price and Button */}
        <Box sx={{ mt: 'auto' }}>
          {/* {slide.price && slide.price > 0 && (
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.1rem',
                mb: 2
              }}
            >
              ${slide.price.toFixed(2)}
            </Typography>
          )} */}
          
          <Button
            variant="contained"
            fullWidth
            component={Link}
            href={`/event/${slide.id}`}
            sx={{
              py: 1.5,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              textColor: 'text.secondary',
              // background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              '&:hover': {
                // background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                transform: 'translateY(-2px)',
                // boxShadow: '0 6px 10px 2px rgba(255, 105, 135, .3)',
              }
            }}
          >
            {slide.cardOptions?.actionButtonText || 'Learn More'}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Swiper
        breakpoints={getResponsiveConfig()}
        loop={loop && slides.length > 1}
        effect={effect !== "none" ? effect : undefined}
        speed={speed * 1000}
        autoplay={
          autoplay && autoplay.delay !== undefined && slides.length > 1
            ? {
                delay: autoplay.delay * 1000,
                disableOnInteraction: autoplay.disableOnInteraction,
                pauseOnMouseEnter: true,
              }
            : false
        }
        navigation={!isMobile && slides.length > 1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        modules={swiperModules}
        className="mySwiper"
        style={{ 
          width: "100%",
          padding: "0 8px 40px 8px"
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide 
            key={`${slide.type}-${slide.id}-${index}`}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              padding: "8px"
            }}
          >
            {slide.type === 'event' 
              ? renderEventCard(slide, index) 
              : renderProductCard(slide, index)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Main component with Suspense
const SliderPage: React.FC<{ elementData: any; themes: any }> = ({ elementData, themes }) => {
  // Create dynamic theme
  const theme = createDynamicTheme({themes});

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        width: "100%", 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 }
      }}>
        <Suspense fallback={<SliderSkeleton />}>
          <SliderContent elementData={elementData} themes={themes} />
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

export default SliderPage;