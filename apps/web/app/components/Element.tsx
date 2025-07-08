// element.tsx
import { getColor, getPageById } from "../data/loader";

// Import theme constants (not functions)
import { themes } from "../utils/colors";
import ClientElement from "./clientElement";

interface ElementProps {
  containerTitle?: string;
  description?: string;
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
      actionButtonPosition?: "top" | "bottom" | "inline" | "hidden" | "none";
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
      breakpoints?: Record<number, any>;
      effect?: string;
      speed?: number;
    };
  };
}

async function Element({ elementData, containerTitle, description }: ElementProps) {
  if (!elementData) return null;

  // Fetch data server-side
  const itemIds = elementData.items?.map((item) => item.itemId) || [];
  const pages = await Promise.all(
    itemIds.map((itemId) => getPageById(itemId))
  );

  const containersPromises = pages.map(async (page) => {
    if (page?.items) {
      const containers = await Promise.all(
        page.items.map((itemId: string) => getPageById(itemId))
      );
      return { [page.slug]: containers };
    }
    return { [page.slug]: [] };
  });

  const containers = Object.assign({}, ...(await Promise.all(containersPromises)));
  
  // Fetch colors server-side
  let colors = {};
  try {
    const colorData = await getColor("light");
    if (colorData?.theme?.palette?.primary?.main) {
      colors = colorData;
    }
  } catch (error) {
    console.error("Error fetching theme colors:", error);
  }

  // Server-side rendering with error handling
  if (!pages || !containers) {
    return <div>Failed to load content</div>;
  }

  // Pass all data to client component instead of functions
  return (
    <ClientElement 
      elementData={elementData}
      containerTitle={containerTitle}
      colors={colors}
      pages={pages}
      pageArray={containers}
      theme={themes.ramadan}
      description={description}
    />
  );
}

export default Element;