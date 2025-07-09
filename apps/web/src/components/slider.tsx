import React, { useEffect, useState, Suspense } from "react";
import { Box, useTheme, useMediaQuery, Typography, ThemeProvider, Skeleton, Button } from "@repo/ui/mui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { CalendarToday, LocationOn, AccessTime, AttachMoney } from '@mui/icons-material';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { createDynamicTheme } from "@repo/ui/theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCatalog, getPageById, getProduct, getEvent, addToCart, getProductPricing } from "../data/loader";
import { useRouter } from "next/navigation";

// Define types
interface PageData {
  slug?: string;
  portraitImage?: string;
  landscapeImage?: string;
  bannerImage?: string;
  heroImage?: string;
  circleImage?: string;
  squareImage?: string;
  title?: any[];
  metaDescription?: any[];
  referenceName?: string;
  [key: string]: any;
}

interface ProductData {
  _id?: string;
  active: boolean;
  HSN: string;
  RFQ: boolean;
  brand: {
    name: string;
    category: string;
    active: boolean;
    __v: number;
  };
  category: {
    categoryName: string;
    categoryType: string;
    __v: number;
  };
  description: string;
  images: {
    url: string;
    _id: string;
  }[];
  model: string;
  name: string;
  notes: any[];
  productCode: string;
  stock: number;
  subBrand: {
    subBrandName: string;
    brandId: string;
    active: boolean;
    __v: number;
  };
  subCategory: {
    subCategoryName: string;
    subCategoryType: string;
    category: string;
    __v: number;
  };
  variants: any[];
  pricing?: {
    productId: string;
    variantId: string;
    pricing: {
      amount: number;
      currency: string;
      discount: number;
      rules: any[];
      _id: string;
    }[];
    active: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
  }[];
}

interface EventData {
  _id?: string;
  name?: string;
  title?: string;
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
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  images?: { url: string; _id: string }[];
  image?: string;
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
  endDate?: string;
  cardOptions?: {
    actionButtonText: string;
    actionButtonUrl: string;
    actionButtonPosition: string;
  };
  withDescription?: boolean;
  metadata?: {
    name?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  isRFQ?: boolean; // Add RFQ flag to slide data
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
      borderRadius: { xs: "16px", sm: "20px" },
      overflow: "hidden",
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      backgroundColor: theme.palette.background.paper,
    }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={220}
        sx={{ borderRadius: 0 }}
      />
      <Box sx={{ padding: { xs: "16px", sm: "18px", md: "20px" } }}>
        <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={16} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="circular" width={44} height={44} />
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
      borderRadius: { xs: "16px", sm: "20px" },
      overflow: "hidden",
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      backgroundColor: theme.palette.background.paper,
    }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={220}
        sx={{ borderRadius: 0 }}
      />
      <Box sx={{ padding: { xs: "16px", sm: "18px", md: "20px" } }}>
        <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={16} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
};

// Create a skeleton loader component for page cards (image only)
const PageCardSkeleton = ({ swiperType }: { swiperType: string }) => {
  const theme = useTheme();
  
  const getSkeletonDimensions = () => {
    switch (swiperType) {
      case 'portrait':
        return { width: "100%", height: 300, maxWidth: "240px" };
      case 'landscape':
        return { width: "100%", height: 200, maxWidth: "350px" };
      case 'hero':
        return { width: "100%", height: 400, maxWidth: "600px" };
      case 'circle':
        return { width: 200, height: 200, maxWidth: "200px", borderRadius: "50%" };
      case 'square':
        return { width: 250, height: 250, maxWidth: "250px" };
      default:
        return { width: "100%", height: 250, maxWidth: "300px" };
    }
  };

  const dimensions = getSkeletonDimensions();
  
  return (
    <Box sx={{
      width: dimensions.width,
      maxWidth: dimensions.maxWidth,
      height: dimensions.height,
      borderRadius: dimensions.borderRadius || { xs: "16px", sm: "20px" },
      overflow: "hidden",
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      backgroundColor: theme.palette.background.paper,
    }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%"
        sx={{ borderRadius: dimensions.borderRadius || 0 }}
      />
    </Box>
  );
};

// Skeleton loader for the entire slider
const SliderSkeleton = ({ slidesPerView, isEventType, swiperType }: { slidesPerView: number, isEventType: boolean, swiperType: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const getSkeletonWidth = () => {
    if (swiperType === 'hero') return "100%";
    if (swiperType === 'circle') return "200px";
    if (swiperType === 'square') return "250px";
    return isMobile ? "280px" : isTablet ? "300px" : "320px";
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: { xs: 2, sm: 3, md: 4 },
      justifyContent: "center"
    }}>
      {[...Array(isMobile ? 1 : isTablet ? 2 : slidesPerView)].map((_, index) => (
        <Box key={index} sx={{ 
          width: getSkeletonWidth()
        }}>
          {isEventType ? (
            <EventCardSkeleton />
          ) : swiperType === 'page' ? (
            <PageCardSkeleton swiperType={swiperType} />
          ) : (
            <ProductCardSkeleton />
          )}
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
  const router = useRouter();
  
  // Create dynamic theme
  const theme = createDynamicTheme({themes});
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract swiper options from elementData
  const {
    slidesPerView = 3,
    swiperType = "portrait",
    spaceBetween = 16,
    loop = true,
    autoplay = { delay: 3, disableOnInteraction: true },
    effect = "none",
    speed = 1,
  } = elementData?.swiperOptions || {};

  // Get responsive breakpoints configuration
  const getResponsiveConfig = () => {
    // For hero type, always show 1 slide
    if (swiperType === 'hero') {
      return {
        320: { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 1, spaceBetween: 0 },
        1024: { slidesPerView: 1, spaceBetween: 0 }
      };
    }
    
    // For circle type, adjust based on screen size
    if (swiperType === 'circle') {
      return {
        320: { slidesPerView: 2, spaceBetween: 8 },
        768: { slidesPerView: 3, spaceBetween: 12 },
        1024: { slidesPerView: Math.min(slidesPerView, 5), spaceBetween: spaceBetween }
      };
    }
    
    return {
      320: {  // for phones
        slidesPerView: 1,
        spaceBetween: 8
      },
      768: {  // for tablets
        slidesPerView: 2,
        spaceBetween: 12
      },
      1024: { // for desktop
        slidesPerView: slidesPerView,
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

  // Get page image based on swiper type
  const getPageImage = (page: PageData) => {
    switch (swiperType) {
      case "portrait":
        return page.portraitImage || page.bannerImage || "";
      case "landscape":
        return page.landscapeImage || page.bannerImage || "";
      case "hero":
        return page.heroImage || page.bannerImage || page.landscapeImage || "";
      case "circle":
        return page.circleImage || page.portraitImage || page.bannerImage || "";
      case "square":
        return page.squareImage || page.portraitImage || page.bannerImage || "";
      default:
        return page.bannerImage || page.portraitImage || page.landscapeImage || "";
    }
  };

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

  // Get product info with pricing
  const getProductInfo = (product: ProductData, productId: string): SlideData => {
    // Get price from pricing data
    const getProductPrice = () => {
      if (product.pricing && product.pricing.length > 0) {
        const firstPricing = product.pricing[0]
        if (firstPricing?.pricing && firstPricing.pricing.length > 0 && firstPricing.pricing[0]) {
          return firstPricing.pricing[0].amount
        }
      }
      return 0
    }

    // Get discount from pricing data
    const getProductDiscount = () => {
      if (product.pricing && product.pricing.length > 0) {
        const firstPricing = product.pricing[0]
        if (firstPricing?.pricing && firstPricing.pricing.length > 0 && firstPricing.pricing[0]) {
          return firstPricing.pricing[0].discount
        }
      }
      return 0
    }

    const price = getProductPrice()
    const discount = getProductDiscount()
    const discountedPrice = price > 0 ? price - (price * discount / 100) : 0

    return {
      id: productId,
      type: 'product',
      image: product.images && product.images.length > 0 ? product.images[0]?.url : '',
      title: product.name || '',
      description: product.description || '',
      link: productId ? `/product/${productId}` : '#',
      price: discountedPrice > 0 ? discountedPrice : (product.RFQ ? 0 : price),
      rating: 4.5, // Default rating since it's not in the API
      isBestseller: false, // Default since it's not in the API
      isRFQ: product.RFQ || false // Add RFQ flag from product data
    };
  };

  // Enhanced event info extraction with better fallbacks
  const getEventInfo = (event: EventData, eventId: string): SlideData => {
    // Better title extraction with multiple fallbacks
    const getEventTitle = () => {
      return event.metadata?.title || 
             event.name || 
             event.title || 
             'Event';
    };

    // Better description extraction
    const getEventDescription = () => {
      return event.description || 
             'Join us for this exciting event!';
    };

    // Better image extraction
    const getEventImage = () => {
      return event.metadata?.imageUrl || 
             event.image ||
             (event.images && event.images.length > 0 ? event.images[0]?.url : '') ||
             '';
    };

    return {
      id: eventId,
      type: 'event',
      image: getEventImage(),
      title: getEventTitle(),
      description: getEventDescription(),
      link: eventId ? `/event/${eventId}` : '#',
      location: event.location || '',
      date: event.startingDate ? formatDate(event.startingDate) : '',
      endDate: event.endingDate ? formatDate(event.endingDate) : '',
      price: event.priceConfig?.amount,
      metadata: event.metadata
    };
  };

  // Get title text from the page title array
  const getPageTitle = (page: PageData) => {
    if (page.title && page.title.length > 0) {
      return page?.title[0]?.title;
    }
    return page.referenceName || "";
  };

  // Get description text from the page metaDescription array
  const getPageDescription = (page: PageData) => {
    if (page.metaDescription && page.metaDescription.length > 0) {
      return page?.metaDescription[0]?.description;
    }
    return "";
  };

  // Handle card click navigation
  const handleCardClick = (slide: SlideData) => {
    if (slide.type === 'product') {
      // Navigate to product page using product ID
      router.push(`/product/${slide.id}`);
    } else if (slide.type === 'event') {
      // Navigate to event page using event ID
      router.push(`/event/${slide.id}`);
    } else if (slide.type === 'page') {
      // For pages, navigate to the page using the link
      router.push(slide.link);
    }
  };

  // Handle add to cart
  // Handle RFQ request
  const handleRFQRequest = async (productId: string, event: React.MouseEvent) => {
    // Prevent card click when clicking RFQ button
    event.stopPropagation();

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("Please login to request a quote");
        return;
      }

      // For now, show a simple alert. In a real implementation, this would
      // open a modal or navigate to an RFQ form
      alert("RFQ functionality will be implemented soon. Please contact us directly for a quote.");

      // TODO: Implement actual RFQ functionality
      // This could involve:
      // - Opening an RFQ modal
      // - Navigating to an RFQ form page
      // - Sending an RFQ request to the backend

    } catch (error: any) {
      console.error("RFQ request error:", error);
      alert("Failed to process RFQ request");
    }
  };

  const handleAddToCart = async (productId: string, price: number, event: React.MouseEvent) => {
    // Prevent card click when clicking add to cart
    event.stopPropagation();
    
    try {
      // Set loading state for this specific product
      setAddingToCart(prev => ({...prev, [productId]: true}));
      
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        alert("Please login to add items to cart");
        setAddingToCart(prev => ({...prev, [productId]: false}));
        return;
      }
      
      // Prepare request data
      const cartData = {
        productId,
        quantity: 1,
        price,
        notes: ""
      };
      
      // Prepare headers
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      };
      
      // Call add to cart API
      const response = await addToCart(cartData, headers);
      console.log("Add to cart response:", response);
      
      // Show success message
      alert("Product added to cart successfully!");
      
    } catch (error: any) {
      console.error("Add to cart error:", error);
      alert(error.message || "Failed to add product to cart");
    } finally {
      // Reset loading state
      setAddingToCart(prev => ({...prev, [productId]: false}));
    }
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
              console.log("catalogData", catalogData);
              
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
                      // Fetch pricing data
                      try {
                        const pricingData = await getProductPricing(productId);
                        console.log("Pricing data for product", productId, pricingData);
                        // Combine product and pricing data
                        const productWithPricing = {
                          ...productData,
                          pricing: pricingData
                        };
                        fetchedSlides.push(getProductInfo(productWithPricing, productId));
                      } catch (pricingError) {
                        console.warn(`Could not fetch pricing for product ${productId}:`, pricingError);
                        // Use product data without pricing
                        fetchedSlides.push(getProductInfo(productData, productId));
                      }
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

  // Render star rating with enhanced styling
  const renderRating = (rating: number = 4.5) => {
    const fullStars = Math.floor(rating);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            component="span"
            sx={{
              color: i < fullStars ? '#FFD700' : '#E0E0E0',
              fontSize: { xs: '16px', sm: '17px', md: '18px' },
              mr: 0.3,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            ★
          </Box>
        ))}
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary, 
            ml: 1,
            fontSize: { xs: '13px', sm: '14px', md: '15px' },
            fontWeight: 500
          }}
        >
          ({rating})
        </Typography>
      </Box>
    );
  };

  // Render page card (image only) with enhanced styling
  const renderPageCard = (slide: SlideData) => {
    const getCardDimensions = () => {
      switch (swiperType) {
        case 'portrait':
          return { 
            width: "100%", 
            maxWidth: { xs: "200px", sm: "220px", md: "240px" },
            height: { xs: 250, sm: 280, md: 300 }
          };
        case 'landscape':
          return { 
            width: "100%", 
            maxWidth: { xs: "280px", sm: "320px", md: "350px" },
            height: { xs: 160, sm: 180, md: 200 }
          };
        case 'hero':
          return { 
            width: "100%", 
            maxWidth: { xs: "100%", sm: "100%", md: "600px" },
            height: { xs: 300, sm: 350, md: 400 }
          };
        case 'circle':
          return { 
            width: { xs: 150, sm: 180, md: 200 }, 
            height: { xs: 150, sm: 180, md: 200 },
            borderRadius: "50%"
          };
        case 'square':
          return { 
            width: { xs: 200, sm: 220, md: 250 }, 
            height: { xs: 200, sm: 220, md: 250 }
          };
        default:
          return { 
            width: "100%", 
            maxWidth: { xs: "280px", sm: "300px", md: "320px" },
            height: { xs: 200, sm: 220, md: 250 }
          };
      }
    };

    const dimensions = getCardDimensions();

    return (
      <Box 
        onClick={() => handleCardClick(slide)}
        sx={{
          ...dimensions,
          borderRadius: dimensions.borderRadius || { xs: "16px", sm: "20px" },
          overflow: 'hidden',
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
          backgroundColor: theme.palette.background.paper,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: 'pointer',
          position: 'relative',
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.2)"
          },
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1
          },
          "&:hover::before": {
            opacity: 1
          }
        }}
      >
        <img
          src={slide.image || '/api/placeholder/400/300'}
          alt={slide.title || 'Page Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
    );
  };

  // Render product card with enhanced styling
  const renderProductCard = (slide: SlideData) => (
    <Box
      onClick={() => handleCardClick(slide)}
      sx={{
        width: "100%",
        maxWidth: { xs: "280px", sm: "300px", md: "320px" },
        height: { xs: "420px", sm: "440px", md: "460px" },
        borderRadius: { xs: "16px", sm: "20px" },
        overflow: 'hidden',
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.2)"
        }
      }}
    >
      {/* Bestseller badge */}
      {slide.isBestseller && (
        <Box sx={{
          position: "absolute",
          top: { xs: 12, sm: 14, md: 16 },
          left: { xs: 12, sm: 14, md: 16 },
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          color: 'white',
          fontWeight: "bold",
          px: { xs: 1.5, sm: 2, md: 2.5 },
          py: { xs: 0.5, sm: 0.7, md: 0.8 },
          borderRadius: "20px",
          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
          zIndex: 2,
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          ✨ Bestseller
        </Box>
      )}

      {/* Image section */}
      <Box sx={{ 
        width: "100%",
        position: 'relative',
        height: { xs: 180, sm: 200, md: 220 },
        overflow: 'hidden',
        "&::after": {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
          pointerEvents: 'none'
        }
      }}>
        <img
          src={slide.image || '/api/placeholder/400/300'}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />
      </Box>

      {/* Content section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: "16px", sm: "18px", md: "20px" }
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
            mb: 1.5,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {slide.title}
        </Typography>

        {/* Rating */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5
        }}>
          {renderRating(slide.rating)}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            lineHeight: 1.6,
            flex: 1,
            minHeight: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' }
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
  variant="h5"
  sx={{
    color: 'text.primary',
    fontWeight: "bold",
    fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' }
  }}
>
  {slide.price && slide.price > 0 ? `$${slide.price.toFixed(2)}` : 'RFQ'}
</Typography>

          <Button
            variant="contained"
            onClick={(e) =>
              slide.isRFQ ? handleRFQRequest(slide.id, e) : handleAddToCart(slide.id, slide.price || 0, e)
            }
            disabled={addingToCart[slide.id]}
            sx={{
              minWidth: slide.isRFQ ? 'auto' : 'auto',
              width: slide.isRFQ ? 'auto' : { xs: 44, sm: 46, md: 48 },
              height: { xs: 44, sm: 46, md: 48 },
              borderRadius: slide.isRFQ ? '8px' : '50%',
              p: slide.isRFQ ? { xs: 1, sm: 1.2, md: 1.5 } : 0,
              px: slide.isRFQ ? { xs: 2, sm: 2.5, md: 3 } : 0,
              fontSize: slide.isRFQ ? { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } : 'inherit',
              fontWeight: slide.isRFQ ? 'bold' : 'normal',
              backgroundColor: slide.isRFQ ? 'primary.main' : 'primary.main',
              '&:hover': {
                backgroundColor: slide.isRFQ ? 'primary.dark' : 'primary.dark',
                transform: slide.isRFQ ? 'none' : 'scale(1.05)',
              }
            }}
          >
            {addingToCart[slide.id] ? (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            ) : slide.isRFQ ? (
              'Request Quote'
            ) : (
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // Render minimal donation event card with only name and description
  const renderDonationEventCard = (slide: SlideData) => (
    <Box
      onClick={() => handleCardClick(slide)}
      sx={{
        width: "100%",
        maxWidth: { xs: "280px", sm: "300px", md: "350px" },
        height: { xs: "auto", sm: "auto", md: "auto" },
        borderRadius: { xs: "16px", sm: "20px" },
        overflow: 'hidden',
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.2)"
        }
      }}
    >
      {/* Image section with gradient overlay */}
      <Box sx={{
        width: "100%",
        position: 'relative',
        height: { xs: 180, sm: 200, md: 220 },
        overflow: 'hidden',
        "&::after": {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          pointerEvents: 'none'
        }
      }}>
        <img
          src={slide.image || '/api/placeholder/400/360'}
          alt={slide.title || 'Donation Event'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />
      </Box>

      {/* Content section - minimal for donations but same layout as regular cards */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: "16px", sm: "18px", md: "20px" }
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
            mb: 1.5,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {slide.title}
        </Typography>

        {/* Description - taking up more space since no other details */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            lineHeight: 1.6,
            flex: 1,
            minHeight: { xs: '4.8rem', sm: '5.2rem', md: '5.6rem' }
          }}
        >
          {slide.description}
        </Typography>

        {/* Action button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 'auto',
            py: 1.5,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            fontWeight: 'bold',
            borderRadius: '12px',
            // background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            // boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            "&:hover": {
              transform: 'translateY(-2px)',
              // boxShadow: '0 6px 20px rgba(255, 107, 107, 0.6)',
              // background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)'
            }
          }}
        >
          💝 Support This Cause
        </Button>
      </Box>
    </Box>
  );

  // Render event card with enhanced styling and better information display
  const renderEventCard = (slide: SlideData) => (
    <Box 
      onClick={() => handleCardClick(slide)}
      sx={{
        width: "100%",
        maxWidth: { xs: "280px", sm: "300px", md: "350px" },
        height: { xs: "480px", sm: "500px", md: "520px" },
        borderRadius: { xs: "16px", sm: "20px" },
        overflow: 'hidden',
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.2)"
        }
      }}
    >
      {/* Image section with gradient overlay */}
      <Box sx={{ 
        width: "100%",
        position: 'relative',
        height: { xs: 180, sm: 200, md: 220 },
        overflow: 'hidden',
        "&::after": {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          pointerEvents: 'none'
        }
      }}>
        <img
          src={slide.image || '/api/placeholder/400/360'}
          alt={slide.title || 'Event Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />
        
        {/* Date badge on image */}
        {slide.date && (
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
            <Typography variant="caption" fontWeight="bold" color="text.primary">
              {slide.date}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: "16px", sm: "18px", md: "20px" }
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
            mb: 1.5,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {slide.title}
        </Typography>

        {/* Event details */}
        <Box sx={{ mb: 1.5 }}>
          {slide.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ 
                fontSize: 18, 
                mr: 1, 
                color: 'primary.main',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '50%',
                p: 0.3
              }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                {slide.location}
              </Typography>
            </Box>
          )}
          
          {slide.endDate && slide.endDate !== slide.date && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ 
                fontSize: 18, 
                mr: 1, 
                color: 'secondary.main',
                background: 'rgba(118, 75, 162, 0.1)',
                borderRadius: '50%',
                p: 0.3
              }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Until {slide.endDate}
              </Typography>
            </Box>
          )}

          {slide.price && slide.price > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{
                fontSize: 18,
                mr: 1,
                color: 'success.main',
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '50%',
                p: 0.3
              }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                From ${slide.price}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{
                fontSize: 18,
                mr: 1,
                color: 'warning.main',
                background: 'rgba(255, 152, 0, 0.1)',
                borderRadius: '50%',
                p: 0.3
              }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Request for Quote
              </Typography>
            </Box>
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            lineHeight: 1.6,
            flex: 1,
            minHeight: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' }
          }}
        >
          {slide.description}
        </Typography>

        {/* Action button */}
        <Button
          variant="contained"
          fullWidth
          // sx={{
          //   mt: 'auto',
          //   py: 1.5,
          //   fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
          //   fontWeight: 'bold',
          //   borderRadius: '12px',
          //   background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          //   boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          //   transition: 'all 0.3s ease',
          //   textTransform: 'none',
          //   "&:hover": {
          //     transform: 'translateY(-2px)',
          //     boxShadow: '0 6px 20px rgba(255, 107, 107, 0.6)',
          //     background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)'
          //   }
          // }}
        >
          🎟️ View Event Details
        </Button>
      </Box>
    </Box>
  );

  // Show loading skeleton
  if (isLoading) {
    return <SliderSkeleton slidesPerView={slidesPerView} isEventType={isEventType} swiperType={swiperType} />;
  }

  // Show message if no slides
  if (slides.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        color: theme.palette.text.secondary 
      }}>
        <Typography variant="h6" sx={{ mb: 1 }}>No items to display</Typography>
        <Typography variant="body2">Check back later for updates!</Typography>
      </Box>
    );
  }

  return (
    <Swiper
      breakpoints={getResponsiveConfig()}
      loop={loop && slides.length > 1}
      effect={effect !== "none" ? effect : undefined}
      speed={speed * 1000}
      autoplay={
        autoplay && autoplay.delay !== undefined
          ? {
              delay: autoplay.delay * 1000,
              disableOnInteraction: autoplay.disableOnInteraction,
            }
          : false
      }
      navigation={!isMobile}
      pagination={isMobile}
      modules={swiperModules}
      className="mySwiper"
      style={{ 
        width: "100%",
        justifyContent: "center",
        padding: "0 8px"
      }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide 
          key={`${slide.type}-${slide.id}-${index}`}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px"
          }}
        >
          {slide.type === 'event'
            ? (slide.metadata?.name === 'donation'
                ? renderDonationEventCard(slide)
                : renderEventCard(slide))
            : slide.type === 'page'
            ? renderPageCard(slide)
            : renderProductCard(slide)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

// Main component with Suspense
const SliderPage: React.FC<{ elementData: any; themes: any }> = ({ elementData, themes }) => {
  // Create dynamic theme
  const theme = createDynamicTheme({themes});
  const [isEventType, setIsEventType] = useState(false);
  
  useEffect(() => {
    const checkIfEventType = async () => {
      if (elementData?.items && elementData.items.length > 0) {
        for (const item of elementData.items) {
          if (item.itemType === "Catalogue") {
            try {
              const catalogData = await getCatalog(item.itemId);
              if (catalogData && catalogData.dataType === "event") {
                setIsEventType(true);
                break;
              }
            } catch (error) {
              console.error(`Error fetching catalog ${item.itemId}:`, error);
            }
          }
        }
      }
    };
    
    checkIfEventType();
  }, [elementData]);
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: { xs: 4, sm: 6, md: 8 },
        marginBottom: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 2, md: 3 },
        backgroundColor: theme.palette.background.default
      }}>
        <Box sx={{
          width: { 
            xs: "100%", 
            sm: "95%", 
            md: "100%", 
            lg: "90%" 
          },
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Suspense fallback={<SliderSkeleton slidesPerView={elementData?.swiperOptions?.slidesPerView || 3} isEventType={isEventType} swiperType={elementData?.swiperOptions?.swiperType || "portrait"} />}>
            <SliderContent elementData={elementData} themes={themes} />
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SliderPage;