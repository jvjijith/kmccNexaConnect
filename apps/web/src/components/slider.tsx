import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography } from "@repo/ui/mui";
import Element from "./Element";
import { getCatalog, getColor, getElement, getPage, getPageById } from "../data/loader";
// Import Swiper and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";

// Define types
interface PageData {
  slug?: string;
  portraitImage?: string;
  title?: any[];
  metaDescription?: any[];
  [key: string]: any;
}

// Convert to a client component
const SliderPage: React.FC<{ elementData: any; themes: any }> = ({ elementData, themes }) => {
  // Use state to store page data
  const [pages, setPages] = useState<PageData[]>([]);
  const [catalog, setCatalog] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get theme and create media query breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Extract swiper options from elementData
  const {
    slidesPerView = 3,
    swiperType = "portrait",
    spaceBetween = 2,
    loop = true,
    autoplay = { delay: 0, disableOnInteraction: true },
    effect = "none",
    speed = 1,
  } = elementData?.swiperOptions || {};

  // Calculate responsive slidesPerView
  const responsiveSlidesPerView = isMobile ? 1 : isTablet ? 2 : slidesPerView;

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

  // Use useEffect to fetch pages only once
  useEffect(() => {
    const fetchPages = async () => {
      const fetchedPages: PageData[] = [];
      const fetchedCatalog: PageData[] = [];
      
      if (elementData?.items && elementData.items.length > 0) {
        for (const item of elementData.items) {
          if (item.itemType === "Page") {
            try {
              const pageData = await getPageById(item.itemId);
              if (pageData) {
                fetchedPages.push(pageData);
              }
            } catch (error) {
              console.error(`Error fetching page ${item.itemId}:`, error);
            }
          }
          if (item.itemType === "Catalogue") {
            try {
              const catalogData = await getCatalog(item.itemId);
              if (catalogData) {
                fetchedCatalog.push(catalogData);
              }
            } catch (error) {
              console.error(`Error fetching page ${item.itemId}:`, error);
            }
          }
        }
      }
      
      setPages(fetchedPages);
      setCatalog(fetchedCatalog);
      setIsLoading(false);
    };

    fetchPages();
  }, [elementData]); // Only re-run if elementData changes

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  // Get responsive height
  const getResponsiveHeight = () => {
    if (swiperType === "portrait") {
      return {
        xs: "250px",
        sm: "300px",
        md: "350px",
        lg: "600px"
      };
    } else {
      return {
        xs: "150px",
        sm: "175px",
        md: "200px",
        lg: "200px"
      };
    }
  };

  const responsiveHeight = getResponsiveHeight();

    // Get appropriate image based on swiperType
    const getPageImage = (page: PageData) => {
      if (swiperType === "portrait" && page.portraitImage) {
        return page.portraitImage;
      } else if (swiperType === "landscape" && page.landscapeImage) {
        return page.landscapeImage;
      } else if (page.bannerImage) {
        return page.bannerImage;
      }
      return ""; // Fallback
    };
  
    // Get title text from the page title array
    const getPageTitle = (page: PageData) => {
      if (page.title && page.title.length > 0) {
        // Default to first title (can be refined to match language preference)
        return page?.title[0]?.title;
      }
      return page.referenceName || "";
    };
  
    // Get description text from the page metaDescription array
    const getPageDescription = (page: PageData) => {
      if (page.metaDescription && page.metaDescription.length > 0) {
        // Default to first description (can be refined to match language preference)
        return page?.metaDescription[0]?.description;
      }
      return "";
    };

  console.log("pages from slider",pages);
  console.log("catalog from slider",catalog);

  return (
    <Box sx={{ 
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: { xs: 10, sm: 15, md: 20 },
      marginBottom: { xs: 10, sm: 15, md: 20 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Swiper
          slidesPerView={responsiveSlidesPerView}
          spaceBetween={spaceBetween}
          loop={loop}
          effect={effect !== "none" ? effect : undefined}
          speed={speed * 1000} // Convert to milliseconds
          autoplay={
            autoplay && autoplay.delay !== undefined
              ? {
                  delay: autoplay.delay * 1000, // Convert to milliseconds
                  disableOnInteraction: autoplay.disableOnInteraction,
                }
              : false
          }
          navigation={!isMobile} // Only show navigation on non-mobile devices
          modules={swiperModules}
          className="mySwiper"
          style={{ 
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {pages.map((page, index) => (
            <SwiperSlide 
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Box
                component="a"
                href={page.slug ? `/${page.slug}` : '#'}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: {
                    xs: responsiveHeight.xs,
                    sm: responsiveHeight.sm,
                    md: responsiveHeight.md,
                    lg: responsiveHeight.lg,
                  },
                  width: { xs: "95%", sm: "90%", md: "85%" },
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: { xs: 1, sm: 2 },
                  boxShadow: 1
                }}
              >
                {page.portraitImage && (
                  <img
                    src={getPageImage(page)}
                    alt={page.referenceName || `Slide ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
              
              {/* {page.title && page.title.length > 0 && ( */}
                <Box textAlign="center" py={2} sx={{ mb: "1%", mt: "5%" }}>
                    <Typography 
                      variant="h4" 
                      gutterBottom 
                      fontWeight="bold" 
                      sx={{ mb: 3 }}
                    >
                      {getPageTitle(page)}
                    </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 1 }}>
                      {getPageDescription(page)}
                    </Typography>
                </Box>
              {/* )} */}
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default SliderPage;