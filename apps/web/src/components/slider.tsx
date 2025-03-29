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
// Render product card
const renderProductCard = (slide: any, index: any) => (
  <Box sx={{
    width: "100%",
    maxWidth: { xs: "280px", sm: "300px", md: "320px" }, // Match ProductCardSkeleton dimensions
    borderRadius: { xs: "12px", sm: "16px" },
    overflow: 'hidden',
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)", // Match skeleton shadow
    backgroundColor: theme.palette.background.paper,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: 'flex',
    flexDirection: 'column',
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.12)"
    }
  }}>
    {/* Bestseller badge */}
    {slide.isBestseller && (
      <Box sx={{
        position: "absolute",
        top: { xs: 8, sm: 10, md: 12 },
        left: { xs: 8, sm: 10, md: 12 },
        backgroundColor: 'action.active',
        color: 'common.white',
        fontWeight: "bold",
        px: { xs: 1, sm: 1.2, md: 1.5 },
        py: 0.5,
        borderRadius: "16px",
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
        zIndex: 2
      }}>
        BESTSELLER
      </Box>
    )}

    {/* Image section */}
    <Box sx={{ 
      width: "100%",
      position: 'relative',
      height: { xs: 180, sm: 200, md: 220 }, // Match skeleton height
      overflow: 'hidden'
    }}>
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

    {/* Content section */}
    <Box sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: { xs: "12px", sm: "14px", md: "16px" } // Match skeleton padding
    }}>
      {/* Title */}
      <Typography
        variant="h6"
        gutterBottom
        fontWeight="bold"
        sx={{
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          mb: 1.5,
          lineHeight: 1.2
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
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mb: 2,
          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
          lineHeight: 1.5
        }}
      >
        {slide.description}
      </Typography>

      {/* Price and Cart Button */}
      <Box sx={{
        mt: 'auto',
        pt: 1.5,
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
            fontWeight: "bold",
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }
          }}
        >
          ${slide.price?.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            minWidth: 'auto',
            width: { xs: 36, sm: 38, md: 40 },
            height: { xs: 36, sm: 38, md: 40 },
            borderRadius: '50%',
            p: 0
          }}
        >
          <ShoppingCartIcon />
        </Button>
      </Box>
    </Box>
  </Box>
);

// Render event card
const renderEventCard = (slide: SlideData, index: number) => (
  <Box sx={{
    width: "100%",
    maxWidth: { xs: "280px", sm: "300px", md: "350px" },
    borderRadius: { xs: "12px", sm: "16px" },
    overflow: 'hidden',
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    backgroundColor: theme.palette.background.paper,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: 'flex',
    flexDirection: 'column',
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.12)"
    }
  }}>
    {/* Image section */}
    <Box sx={{ 
      width: "100%",
      position: 'relative',
      height: { xs: 180, sm: 200, md: 220 },
      overflow: 'hidden'
    }}>
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
        sx={{
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          fontWeight: "bold",
          mb: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {slide.title}
      </Typography>

      {/* Date and Location - Compact version */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 0.5,
          gap: 1
        }}>
          <CalendarToday sx={{
            fontSize: '1rem',
            color: 'primary.main'
          }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
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
            fontSize: '1rem',
            color: 'primary.main'
          }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              fontSize: '0.85rem',
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
          fontSize: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mb: 1.5,
          lineHeight: 1.5
        }}
      >
        {slide.description}
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        fullWidth
        href={`/event/${slide.id}`}
        sx={{
          mt: 'auto',
          py: 1,
          fontSize: '0.9rem',
          textTransform: 'none',
          borderRadius: 1.5
        }}
      >
        {slide.cardOptions?.actionButtonText || 'Learn More'}
      </Button>
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
      padding: "0 4px"
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
          padding: "4px"
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
          marginTop: { xs: 4, sm: 6, md: 8 }, // reduced margins
          marginBottom: { xs: 4, sm: 6, md: 8 },
          px: { xs: 1, sm: 2, md: 3 }, // reduced horizontal padding
          backgroundColor: theme.palette.background.default
        }}>
          <Box sx={{
            width: { 
              xs: "100%", 
              sm: "95%", 
              md: "100%", 
              lg: "90%" 
            }, // increased width percentages
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