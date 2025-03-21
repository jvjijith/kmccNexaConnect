import React, { useEffect, useState, Suspense } from "react";
import { Box, useTheme, useMediaQuery, Typography, ThemeProvider, Skeleton, Button, Chip } from "@repo/ui/mui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { CalendarToday, LocationOn, Star } from '@mui/icons-material';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { createDynamicTheme } from "@repo/ui/theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCatalog, getPageById, getProduct, getEvent } from "../data/loader";
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
    month: 'long', 
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
      borderRadius: { xs: "12px", sm: "16px" },
      overflow: "hidden",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
      backgroundColor: theme.palette.background.paper,
    }}>
      {/* Image skeleton */}
      <Skeleton variant="rectangular" width="100%" sx={{height:{ xs: 180, sm: 200, md: 220 }}} />
      
      {/* Content skeleton */}
      <Box sx={{ padding: { xs: "12px", sm: "14px", md: "16px" } }}>
        {/* Title skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="80%" height={24} sx={{ ml: 1 }} />
        </Box>
        
        {/* Rating skeleton */}
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        
        {/* Description skeleton */}
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="90%" height={16} sx={{ mb: 2 }} />
        
        {/* Price and button skeleton */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="circular" width={40} height={40} />
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
      maxWidth: { xs: "280px", sm: "550px", md: "650px" },
      borderRadius: { xs: "20px", sm: "25px", md: "30px" },
      overflow: "hidden",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
      backgroundColor: theme.palette.background.paper,
    }}>
      {/* Image skeleton */}
      <Skeleton variant="rectangular" width="100%" sx={{height:{ xs: 240, sm: 300, md: 360 }}} />
      
      {/* Content skeleton */}
      <Box sx={{ padding: { xs: "12px", sm: "14px", md: "16px" } }}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="90%" height={32} sx={{ mb: 3 }} />
        
        {/* Date and location skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={24} />
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        
        {/* Description skeleton */}
        <Skeleton variant="text" width="100%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="100%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="80%" height={18} sx={{ mb: 3 }} />
        
        {/* Button skeleton */}
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
};

// Create a skeleton loader component for the slider
const SliderSkeleton = ({ slidesPerView = 3, isEventType = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const getSkeletonWidth = () => {
    if (isEventType) {
      return {
        xs: "280px",
        sm: "550px",
        md: "650px"
      };
    }
    return {
      xs: "280px",
      sm: "300px",
      md: "320px"
    };
  };

  return (
    <Box sx={{ 
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: { xs: 2, sm: 3, md: 4 },
      justifyContent: "center"
    }}>
      {[...Array(isMobile ? 1 : isTablet ? 2 : slidesPerView)].map((_, index) => (
        <Box key={index} sx={{ 
          width: getSkeletonWidth()
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
  const [openModal, setOpenModal] = useState<{[key: string]: boolean}>({});
  const [isEventType, setIsEventType] = useState(false);
  
  // Create dynamic theme
  const theme = createDynamicTheme({themes});
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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
      image: product.images && product.images.length > 0 ? product.images[0]?.url : '',
      title: product.name || '',
      description: product.description || '',
      link: productId ? `/product/${productId}` : '#',
      price: product.price || 199.99,
      rating: product.rating || 4.5,
      isBestseller: product.isBestseller || false
    };
  };

  // Get event info
  const getEventInfo = (event: EventData, eventId: string): SlideData => {
    return {
      id: eventId,
      type: 'event',
      image: event.imageUrl || '/api/placeholder/400/360',
      title: event.name || event.metadata?.name || 'Event',
      description: event.description || event.metadata?.description || '',
      link: eventId ? `/event/${eventId}` : '#',
      price: event.priceConfig?.amount || 0,
      location: event.location || '',
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
    return "";
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

  // Handle modal open for events
  const handleModalOpen = (id: string) => {
    setOpenModal(prev => ({...prev, [id]: true}));
  };

  // Handle modal close for events
  const handleModalClose = (id: string) => {
    setOpenModal(prev => ({...prev, [id]: false}));
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
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            component="span"
            sx={{
              color: i < fullStars ? theme.palette.warning.main : '#E0E0E0',
              fontSize: { xs: '14px', sm: '15px', md: '16px' },
              mr: 0.5
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
            fontSize: { xs: '12px', sm: '13px', md: '14px' }
          }}
        >
          ({rating})
        </Typography>
      </Box>
    );
  };

  if (isLoading) {
    return <SliderSkeleton slidesPerView={slidesPerView} isEventType={isEventType} />;
  }

  // Handle button click for events
  const handleEventButtonClick = (slide: SlideData) => {
    if (slide.withDescription) {
      handleModalOpen(slide.id);
    } else {
      window.location.href = slide.cardOptions?.actionButtonUrl || '#';
    }
  };

  // Render event card

  const renderEventCard = (slide: SlideData, index: number) => (
    <Box sx={{
      maxWidth: { xs: "280px", sm: "400px", md: "450px" },
      minWidth: { xs: "280px", sm: "400px", md: "450px" },
      minHeight: { xs: "420px", sm: "480px", md: "600px" },
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      borderRadius: { xs: "16px", sm: "20px", md: "24px" },
      backgroundColor: theme.palette.background.paper,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.16)"
      }
    }}>
      <Box sx={{ flex: 1 }}>
        {/* Image section */}
        <Box sx={{ position: 'relative', height: { xs: 180, sm: 220, md: 250 } }}>
          <img
            src={slide.image || '/api/placeholder/400/360'}
            alt={slide.title || `Event ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
  
        {/* Card header with title */}
        <Box sx={{
          pt: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 2, sm: 2.5, md: 3 },
          pb: 1.5,
          minHeight: { xs: 80, sm: 90, md: 100 }
        }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' }
            }}
          >
            {slide.title}
          </Typography>
  
          {/* Date and location info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <CalendarToday sx={{
              fontSize: { xs: 16, sm: 18, md: 20 },
              color: 'primary.main'
            }} />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              {formatDate(slide.date || '')}
            </Typography>
          </Box>
  
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LocationOn sx={{
              fontSize: { xs: 16, sm: 18, md: 20 },
              color: 'primary.main'
            }} />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              {slide.location || 'Location TBA'}
            </Typography>
          </Box>
  
          {/* Description with line clamp */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              lineHeight: 1.6,
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
          >
            {slide.description}
          </Typography>
        </Box>
      </Box>
  
      {/* Card footer with button - always at bottom */}
      <Box sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        pt: 0,
        marginTop: 'auto'
      }}>
        {/* <Link href={`/event/${slide.id}`} passHref> */}
          <Button
            variant="outlined"
            fullWidth
            size={isMobile ? "small" : "medium"}
            href={`/event/${slide.id}`}
            sx={{
              py: { xs: 1, sm: 1.25, md: 1.5 },
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
              textTransform: 'none',
              borderRadius: 1.5,
              borderWidth: 1.5
            }}
          >
            {slide.cardOptions?.actionButtonText || 'Learn More'}
          </Button>
        {/* </Link> */}
      </Box>
    </Box>
  );

  // Render product card
  const renderProductCard = (slide: any, index: any) => (
    <Box sx={{
      maxWidth: { xs: "280px", sm: "400px", md: "450px" },
      minWidth: { xs: "280px", sm: "400px", md: "450px" },
      minHeight: { xs: "420px", sm: "480px", md: "600px" },
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      borderRadius: { xs: "16px", sm: "20px", md: "24px" },
      backgroundColor: theme.palette.background.paper,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.16)"
      }
    }}>
      <Box sx={{ flex: 1 }}>
        {/* Bestseller badge */}
        {slide.isBestseller && (
          <Box sx={{
            position: "absolute",
            top: { xs: "8px", sm: "10px", md: "12px" },
            left: { xs: "8px", sm: "10px", md: "12px" },
            backgroundColor: 'action.active',
            color: 'common.white',
            fontWeight: "bold",
            padding: { xs: "4px 8px", sm: "4px 10px", md: "4px 12px" },
            borderRadius: "20px",
            fontSize: { xs: "10px", sm: "11px", md: "12px" },
            zIndex: 2
          }}>
            BESTSELLER
          </Box>
        )}

        {/* Product image */}
        <Box sx={{ position: 'relative', height: { xs: 180, sm: 220, md: 250 } }}>
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Product details */}
        <Box sx={{
          pt: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 2, sm: 2.5, md: 3 },
          pb: 1.5,
          minHeight: { xs: 80, sm: 90, md: 100 }
        }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' }
            }}
          >
            {slide.title}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} sx={{
                color: i < Math.floor(slide.rating) ? 'primary.main' : 'action.disabled',
                fontSize: { xs: 16, sm: 18, md: 20 }
              }} />
            ))}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              ({slide.rating})
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              lineHeight: 1.6,
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
          >
            {slide.description}
          </Typography>
        </Box>
      </Box>

      {/* Price and cart button - keeping the original styling */}
      <Box sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        pt: 0,
        marginTop: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: "bold",
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.25rem"
              }
            }}
          >
            ${slide.price?.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '50%',
              minWidth: 'auto',
              width: {
                xs: "36px",
                sm: "40px",
                md: "44px"
              },
              height: {
                xs: "36px",
                sm: "40px",
                md: "44px"
              },
              p: 0
            }}
          >
            <ShoppingCartIcon sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
                md: "22px"
              }
            }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Swiper
      breakpoints={getResponsiveConfig()}
      loop={loop}
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
        padding: "0 4px"  // add minimal padding
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
            padding: "2px"
          }}
        >
          {slide.type === 'event' 
            ? renderEventCard(slide, index) 
            : renderProductCard(slide, index)}
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
              console.error(`Error fetching catalog ${item.itemId}:`, error);}
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
          marginTop: { xs: 5, sm: 8, md: 10 },
          marginBottom: { xs: 5, sm: 8, md: 10 },
          px: { xs: 2, sm: 3, md: 4 },
          backgroundColor: theme.palette.background.default
        }}>
          <Box sx={{
            width:  { 
                  xs: "100%", 
                  sm: "90%", 
                  md: "100%", 
                  lg: "95%" 
                },
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Suspense fallback={<SliderSkeleton slidesPerView={elementData?.swiperOptions?.slidesPerView || 3} isEventType={isEventType} />}>
              <SliderContent elementData={elementData} themes={themes} />
            </Suspense>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };
  
  export default SliderPage;