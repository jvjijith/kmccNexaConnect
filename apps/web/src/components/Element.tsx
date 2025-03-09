"use client";
import Hero from "@repo/ui/herosection";
import MovingCarousel from "@repo/ui/movingcarousel";
import React, { useEffect, useState } from "react";
import { colors, themes, withOpacity } from "../utils/colors";
import About from "@repo/ui/about";
import Card from "@repo/ui/card";
import Banner from "@repo/ui/banner";
import { getPage, getPageById } from "../data/loader";


interface ElementProps {
  containerTitle: string;
  elementData: {
    componentType:
      | "swimlane"
      | "list"
      | "image"
      | "textParagraph"
      | "audio"
      | "video"
      | "card"
      | "banner";
    referenceName: string;
    title?: { lanCode: string; name: string }[];
    description?: { lanCode: string; paragraph: string }[];
    imageUrl?: string;
    items?: { itemId: string; itemType: string }[];
    audioUrl?: string;
    videoUrl?: string;
    viewText?: string;
    viewAll?: string;
    withText?: boolean;
    withDescription?: boolean;
    hoverEffect?:
      | "none"
      | "shadow"
      | "scale"
      | "border"
      | "zoomIn"
      | "zoomOut";
    cardOptions?: {
      imagePosition?: "top" | "bottom" | "left" | "right" | "none";
      titlePosition?: "top" | "bottom" | "left" | "right" | "none";
      descriptionPosition?: "top" | "bottom" | "left" | "right" | "none";
      actionButtonPosition?:
        | "top"
        | "bottom"
        | "inline"
        | "hidden"
        | "none";
      actionButtonText?: string;
      actionButtonUrl?: string;
      cardAspectRatio?: string;
    };
    swiperOptions?: {
      slidesPerView: number;
      swiperType: "portrait" | "landscape" | "hero" | "circle" | "square";
      spaceBetween: number;
      loop: boolean;
      autoplay?: {
        delay: number;
        disableOnInteraction: boolean;
      };
      breakpoints?: Record<number, any>; // Define more specific structure if needed
      effect?: string;
      speed?: number;
    };
  };
}


const Element: React.FC<ElementProps> = ({ elementData ,containerTitle }) => {
  if (!elementData) return null;
  const fundraiserData = {
    id: '1',
    title: 'Help Build a School',
    description: 'We are raising funds to build a school in an underprivileged area.',
    imageSrc: 'https://via.placeholder.com/400', // Replace with an actual image URL
    raised: 7500,
    goal: 10000,
    color: 'green',
  };
  const [pages, setPages] = useState<any[]>([]);
  const [containers, setContainers] = useState<{ [key: string]: any }>({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract itemIds from elementData
        const itemIds = elementData.items?.map(item => item.itemId) || [];
  
        // Fetch pages for each itemId
        const pageData = await Promise.all(itemIds.map(itemId => getPageById(itemId)));
  
        // Store the pages in state
        setPages(pageData);
  
        // Fetch container data for each page and organize by slug
        const containerPromises = pageData.map(async (page) => {
          if (page?.items) {
            const containers = await Promise.all(page.items.map((itemId: string) => getPageById(itemId)));
            return { [page.slug]: containers };
          }
          return { [page.slug]: [] };
        });
  
        const resolvedContainers = await Promise.all(containerPromises);
        setContainers(Object.assign({}, ...resolvedContainers));
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  console.log("pages",pages)

  const renderContent = () => {
    switch (elementData.componentType) {
      case "image":
        return (
          <Hero 
          elementData={elementData}
          // theme={themes.ramadan}
          withOpacity={withOpacity}
          />
        );

        
      case "swimlane":
        return (
          <MovingCarousel  
          text={elementData?.description?.[0]?.paragraph ?? ""}
          theme={themes.ramadan}
          withOpacity={withOpacity}
          speed={elementData.swiperOptions?.speed ?? 30}
        />
        );

      case "video":
        return (
          <video
            src={elementData.videoUrl ?? ""}
            controls
            className="w-full rounded-md"
          />
        );

      case "audio":
        return (
          <audio src={elementData.audioUrl ?? ""} controls className="w-full" />
        );

        case "textParagraph":
          return (
            <About 
            elementData={elementData}
            theme={themes.ramadan}
            withOpacity={withOpacity}
             />
          );
        

      case "card":
        return (
          <Card  
          elementData={elementData}
          theme={themes.ramadan}
          withOpacity={withOpacity}
          containerTitle={containerTitle}
           />
        );

      case "banner":
        return (
          <Banner
          elementData={elementData}
          containerTitle={containerTitle}
          />
        );

      default:
        return <span>Unsupported component type: {elementData.componentType}</span>;
    }
  };

  return <div className={`element ${elementData.hoverEffect ?? ""}`}>{renderContent()}</div>;
};

export default Element;
