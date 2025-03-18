// ClientElement.tsx
"use client";

import React from "react";
import Hero from "@repo/ui/herosection";
import MovingCarousel from "@repo/ui/movingcarousel";
import About from "@repo/ui/about";
import Card from "@repo/ui/card";
import Banner from "@repo/ui/banner";
import Paragraph from "@repo/ui/biography";
import TextBanner from "@repo/ui/textbanner";
import { withOpacity } from "../utils/colors";
import SliderPage from "./slider";
import { Box, Typography } from "@repo/ui/mui";

interface ClientElementProps {
  description?: string;
  elementData: any;
  containerTitle?: string;
  colors: any;
  pages: any[];
  pageArray: any;
  theme: any;
}

const ClientElement: React.FC<ClientElementProps> = ({ 
  elementData, 
  description,
  containerTitle, 
  colors, 
  pages, 
  pageArray,
  theme
}) => {
  const renderContent = () => {
    switch (elementData.componentType) {
      case "image":
        return (
          <Hero elementData={elementData} withOpacity={withOpacity} themes={colors} />
        );

      case "swimlane":
        return (
          <>
           {/* <MovingCarousel
            text={elementData?.description?.[0]?.paragraph ?? ""}
            theme={theme}
            withOpacity={withOpacity}
            speed={elementData.swiperOptions?.speed ?? 30}
          /> */}
          {containerTitle && (
            <Box textAlign="center" py={2} sx={{ mb: "1%", mt: "5%" }}>
              <Typography variant="h1" fontWeight="bold" sx={{ fontSize: "3rem" }}>
                {containerTitle}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {description}
              </Typography>
              </Box>)
              }

          <SliderPage
          elementData={elementData} themes={colors}
          >
          </SliderPage>
          </>
        );

      case "video":
        return (
          <video src={elementData.videoUrl ?? ""} controls className="w-full rounded-md" />
        );

      case "audio":
        return (
          <audio src={elementData.audioUrl ?? ""} controls className="w-full" />
        );

      case "textParagraph":
        return (
          <Paragraph/>
        );

      case "card":
        return (
          <Card
            elementData={elementData}
            theme={colors}
            withOpacity={withOpacity}
            containerTitle={containerTitle}
          />
        );

      case "banner":
        return (
          <>
          {elementData.imageUrl != null &&
            <Banner 
            elementData={elementData} 
            containerTitle={containerTitle}
            themes={colors} 
          />}
          {elementData.imageUrl == null &&
            <TextBanner 
            elementData={elementData} 
            containerTitle={containerTitle}
            themes={colors} 
          />}
          </>
        );

      default:
        return <span>Unsupported component type: {elementData.componentType}</span>;
    }
  };

  return (
    <div className={`element ${elementData.hoverEffect ?? ""}`}>
      {renderContent()}
    </div>
  );
};

export default ClientElement;