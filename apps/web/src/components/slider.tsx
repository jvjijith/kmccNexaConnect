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
  name?: string;
  description?: string;
  images?: { url: string; _id: string }[];
  price?: number;
  rating?: number;
  isBestseller?: boolean;
  RFQ?: boolean; // Add RFQ field from product data
  [key: string]: any;
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
  pageType?: string; // Add page type for details handling
  productID?: string; // Add productID for details navigation
  eventID?: string; // Add eventID for details navigation
  isDonation?: boolean; // Add donation flag for events
  isRFQ?: boolean; // Add RFQ flag for products
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
    spaceBetween = 2, // Changed default from 16 to 2
    loop = true,
    autoplay = { delay: 3, disableOnInteraction: true },
    effect = "none",
    speed = 1,
  } = elementData?.swiperOptions || {};

  // Get responsive breakpoints configuration
  const getResponsiveConfig = () => {
    // For hero type, always show 1 slide with full width
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
        320: { slidesPerView: 2, spaceBetween: spaceBetween },
        768: { slidesPerView: 3, spaceBetween: spaceBetween },
        1024: { slidesPerView: Math.min(slidesPerView, 5), spaceBetween: spaceBetween }
      };
    }

    return {
      320: {  // for phones
        slidesPerView: 1,
        spaceBetween: spaceBetween
      },
      768: {  // for tablets
        slidesPerView: 2,
        spaceBetween: spaceBetween
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
      link: page.slug ? `/${page.slug}` : '#',
      pageType: page.type, // Add page type for details handling
      productID: page.productID, // Add productID if present
      eventID: page.eventID // Add eventID if present
    };
  };

  // Get product info
  const getProductInfo = async (product: ProductData, productId: string): Promise<SlideData> => {
    let price: number | undefined = product.price;
    let isRFQ = product.RFQ || false; // Get RFQ from product data

    // If RFQ is true, don't fetch or show price
    if (!isRFQ) {
      try {
        // Fetch pricing data
        const pricingData = await getProductPricing(productId);
        if (pricingData && Array.isArray(pricingData) && pricingData.length > 0) {
          const firstPricing = pricingData[0];
          if (firstPricing.pricing && firstPricing.pricing.length > 0) {
            const priceInfo = firstPricing.pricing[0];
            if (priceInfo.amount && priceInfo.amount > 0) {
              price = priceInfo.amount;
            }
          }
        }

        // Fallback to a default price if no price is found and not RFQ
        if (!price || price <= 0) {
          price = 199.99;
        }
      } catch (error) {
        console.error(`Error fetching pricing for product ${productId}:`, error);
        // Fallback to product price or default if pricing fetch fails
        price = product.price || 199.99;
      }
    }

    return {
      id: productId,
      type: 'product',
      image: product.images && product.images.length > 0 ? product.images[0]?.url : '',
      title: product.name || '',
      description: product.description || '',
      link: productId ? `/product/${productId}` : '#',
      price: isRFQ ? undefined : price,
      rating: product.rating || 4.5,
      isBestseller: product.isBestseller || false,
      isRFQ: isRFQ
    };
  };

  // Enhanced event info extraction with better fallbacks
  const getEventInfo = (event: EventData, eventId: string): SlideData => {
    // Better title extraction with multiple fallbacks
    const getEventTitle = () => {
      return event.name || 
             event.title || 
             'Event';
    };

    // Better description extraction
    const getEventDescription = () => {
      return event.metadata?.description || 
             event.description || 
             'Join us for this exciting event!';
    };

    // Better image extraction
    const getEventImage = () => {
      return event.metadata?.imageUrl || 
             event.image ||
             (event.images && event.images.length > 0 ? event.images[0]?.url : '') ||
             '';
    };

    // Check if this is a donation event
    const isDonation = event.metadata?.name?.toLowerCase().includes('donation') ||
                      event.name?.toLowerCase().includes('donation');

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
      isDonation: isDonation // Add donation flag
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
      // For product cards, navigate to product page
      router.push(slide.link);
    } else if (slide.type === 'page') {
      // For page cards (including hero), navigate to the page
      router.push(slide.link);
    } else if (slide.type === 'event') {
      // For event cards, navigate to page (not event details)
      router.push(slide.link);
    }
  };

  // Handle add to cart
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
                      fetchedSlides.push(await getProductInfo(productData, productId));
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
            width: "100vw", // Full viewport width
            height: "100vh", // Full viewport height
            maxWidth: "none",
            borderRadius: 0 // No border radius for full screen
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
            transform: swiperType === 'hero' ? "scale(1.02)" : "translateY(-8px) scale(1.02)",
            boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.2)"
          },
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: swiperType === 'hero'
              ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(45deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
            opacity: swiperType === 'hero' ? 1 : 0,
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

        {/* Hero overlay with title and description */}
        {swiperType === 'hero' && (slide.title || slide.description) && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: { xs: 3, sm: 4, md: 6 },
            color: 'white',
            zIndex: 2
          }}>
            {slide.title && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 'bold',
                  mb: { xs: 1, sm: 2, md: 3 },
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  color: 'white',
                }}
              >
                {slide.title}
              </Typography>
            )}

            {slide.description && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                  lineHeight: 1.6,
                  maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  opacity: 0.95,
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 3, sm: 4, md: 5 },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {slide.description}
              </Typography>
            )}
          </Box>
        )}
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
          {slide.isRFQ ? (
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' }
              }}
            >
              Request Quote
            </Typography>
          ) : (
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' }
              }}
            >
              ₹{slide.price?.toFixed(2) || '0.00'}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={(e) => {
              if (slide.isRFQ) {
                // For RFQ products, prevent card click and navigate to product page for quote
                e.stopPropagation();
                router.push(slide.link);
              } else {
                // For regular products, add to cart
                handleAddToCart(slide.id, slide.price || 0, e);
              }
            }}
            disabled={addingToCart[slide.id]}
            sx={{
              minWidth: 'auto',
              width: { xs: 44, sm: 46, md: 48 },
              height: { xs: 44, sm: 46, md: 48 },
              borderRadius: '50%',
              p: 0,
              // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: slide.isRFQ
                ? '0 4px 15px rgba(255, 152, 0, 0.4)'
                : '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              "&:hover": {
                transform: 'scale(1.1)',
                boxShadow: slide.isRFQ
                  ? '0 6px 20px rgba(255, 152, 0, 0.6)'
                  : '0 6px 20px rgba(102, 126, 234, 0.6)',
                background: slide.isRFQ
                  ? 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)'
                  : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            {addingToCart[slide.id] ? (
              <Box sx={{
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
              }} />
            ) : slide.isRFQ ? (
              <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>RFQ</Typography>
            ) : (
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // Render donation campaign card with minimal details
  const renderDonationCard = (slide: SlideData) => (
    <Box
      onClick={() => handleCardClick(slide)}
      sx={{
        width: "100%",
        maxWidth: { xs: "260px", sm: "280px", md: "320px" },
        height: { xs: "420px", sm: "440px", md: "460px" },
        borderRadius: { xs: "12px", sm: "16px" },
        overflow: 'hidden',
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.3s ease",
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)"
        }
      }}
    >
      {/* Image section */}
      <Box sx={{
        width: "100%",
        height: { xs: 160, sm: 180, md: 250 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={slide.image || '/api/placeholder/400/300'}
          alt={slide.title || 'Donation Campaign'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Donation badge */}
        <Box sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          borderRadius: '8px',
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          💚 Donate
        </Box>
      </Box>

      {/* Content section */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: "12px", sm: "14px", md: "16px" }
      }}>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            mb: 1,
            lineHeight: 3,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {slide.title}
        </Typography>

        {/* Minimal description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
            lineHeight: 1.4,
            flex: 1
          }}
        >
          {slide.description}
        </Typography>

        {/* Donate button */}
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => {
            // Prevent card click when clicking button
            e.stopPropagation();
            // For now, just navigate to event page - can be customized later
            router.push(slide.link);
          }}
          sx={{
            mt: 'auto',
            py: 1,
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
            fontWeight: 'bold',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            textTransform: 'none',
            "&:hover": {
              background: 'primary.main',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
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

          {slide.price && (
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
          onClick={(e) => {
            // Prevent card click when clicking button
            e.stopPropagation();
            // For now, just navigate to event details - can be customized later
            router.push(slide.link);
          }}
          sx={{
            mt: 'auto',
            py: 1.5,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            fontWeight: 'bold',
            borderRadius: '12px',
            // background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            "&:hover": {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 107, 107, 0.6)',
              background: 'primary.main'
            }
          }}
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
      spaceBetween={spaceBetween}
      style={{
        width: swiperType === 'hero' ? "100vw" : "100%",
        justifyContent: "center",
        padding: swiperType === 'hero' ? "0" : "0 8px"
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
            padding: swiperType === 'hero' ? "0" : "2px"
          }}
        >
          {slide.type === 'event'
            ? (slide.isDonation ? renderDonationCard(slide) : renderEventCard(slide))
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
        marginTop: elementData?.swiperOptions?.swiperType === 'hero' ? 0 : { xs: 4, sm: 6, md: 8 },
        marginBottom: elementData?.swiperOptions?.swiperType === 'hero' ? 0 : { xs: 4, sm: 6, md: 8 },
        px: elementData?.swiperOptions?.swiperType === 'hero' ? 0 : { xs: 1, sm: 2, md: 3 },
        backgroundColor: theme.palette.background.default
      }}>
        <Box sx={{
          width: elementData?.swiperOptions?.swiperType === 'hero' ? "100vw" : {
            xs: "100%",
            sm: "95%",
            md: "80%",
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