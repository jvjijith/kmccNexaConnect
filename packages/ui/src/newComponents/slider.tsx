import React, { useEffect, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow, EffectFlip, EffectCube } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';

interface SwiperOptions {
  slidesPerView: number;
  swiperType: string;
  spaceBetween?: number;
  loop: boolean;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
  };
  breakpoints?: Record<string, any>;
  effect?: string;
  speed: number;
}

interface SliderProps {
  elementData: any;
  pageArray: any;
  swiperOptions: SwiperOptions;
  children: React.ReactNode[];
}

const SliderContainer = styled(Box)({
  width: '100%',
  position: 'relative',
  '& .swiper': {
    width: '100%',
    height: '100%',
  },
  '& .swiper-slide': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .swiper-button-next, & .swiper-button-prev': {
    color: '#FF5733',
    '&:after': {
      fontSize: '20px',
    },
  },
  '& .swiper-pagination-bullet': {
    backgroundColor: '#FF5733',
  },
  '& .swiper-pagination-bullet-active': {
    backgroundColor: '#FF5733',
  },
});

const Slider: React.FC<SliderProps> = ({ 
  elementData, 
  pageArray, 
  swiperOptions, 
  children 
}) => {
  const swiperRef = useRef<SwiperType>();

  // Determine spaceBetween value
  const getSpaceBetween = (): number => {
    if (swiperOptions.spaceBetween !== undefined) {
      return swiperOptions.spaceBetween;
    }
    
    // Default to 2 for product and event cards
    const cardTypes = ['product', 'event'];
    if (cardTypes.includes(swiperOptions.swiperType?.toLowerCase())) {
      return 2;
    }
    
    return 0; // Default for other types
  };

  // Get effect modules based on effect type
  const getEffectModules = () => {
    const baseModules = [Navigation, Pagination];
    
    if (swiperOptions.autoplay) {
      baseModules.push(Autoplay);
    }
    
    switch (swiperOptions.effect?.toLowerCase()) {
      case 'fade':
        baseModules.push(EffectFade);
        break;
      case 'coverflow':
        baseModules.push(EffectCoverflow);
        break;
      case 'flip':
        baseModules.push(EffectFlip);
        break;
      case 'cube':
        baseModules.push(EffectCube);
        break;
      default:
        break;
    }
    
    return baseModules;
  };

  // Prepare swiper configuration
  const swiperConfig = {
    modules: getEffectModules(),
    slidesPerView: swiperOptions.slidesPerView,
    spaceBetween: getSpaceBetween(),
    loop: swiperOptions.loop,
    speed: swiperOptions.speed,
    navigation: true,
    pagination: { clickable: true },
    onSwiper: (swiper: SwiperType) => {
      swiperRef.current = swiper;
    },
    ...(swiperOptions.autoplay && {
      autoplay: {
        delay: swiperOptions.autoplay.delay,
        disableOnInteraction: swiperOptions.autoplay.disableOnInteraction,
      },
    }),
    ...(swiperOptions.effect && { effect: swiperOptions.effect }),
    ...(swiperOptions.breakpoints && { breakpoints: swiperOptions.breakpoints }),
  };

  return (
    <SliderContainer>
      <Swiper {...swiperConfig}>
        {children.map((child, index) => (
          <SwiperSlide key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderContainer>
  );
};

export default Slider;