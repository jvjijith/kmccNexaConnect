// ClientElement.tsx
"use client";

import React from "react";
import Hero from "@repo/ui/herosection";
import MovingCarousel from "@repo/ui/movingcarousel";
import About from "@repo/ui/about";
import Card from "@repo/ui/card";
import Slider from "@repo/ui/slider";
import Banner from "@repo/ui/banner";
import { withOpacity } from "../utils/colors";

interface ClientElementProps {
  elementData: any;
  containerTitle: string;
  colors: any;
  pages: any[];
  pageArray: any;
  theme: any;
}

const ClientElement: React.FC<ClientElementProps> = ({ 
  elementData, 
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
          <Hero elementData={elementData} withOpacity={withOpacity} />
        );

      case "swimlane":
        return (
          // <MovingCarousel
          //   text={elementData?.description?.[0]?.paragraph ?? ""}
          //   theme={theme}
          //   withOpacity={withOpacity}
          //   speed={elementData.swiperOptions?.speed ?? 30}
          // />

          <Slider
          elementData={elementData}
          pageArray={pageArray}
          >
          </Slider>
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
          <About elementData={elementData} theme={theme} withOpacity={withOpacity} />
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
          <Banner 
            elementData={elementData} 
            containerTitle={containerTitle}
            themes={colors} 
          />
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