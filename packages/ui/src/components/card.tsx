import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import About from '../newComponents/about.js'
import Image from '../newComponents/image.js'
import ImageLeftCard from '../newComponents/imageLeftCard.js'
import ImageRightCard from '../newComponents/imageRightCard.js'
import NoImageCard from '../newComponents/noImageCard.js'
import ImageOnlyCard from '../newComponents/imageOnlyCard.js'

const FundraiserCard = ({
  elementData,
  theme,
  withOpacity,
  containerTitle
}: {
  elementData: any;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  withOpacity: (color: string, opacity: number) => string;
  containerTitle: string;
}) => {
  const { cardOptions, title, description, imageUrl } = elementData;

  // Helper function to determine visibility
  const isVisible = (position: string) => position !== "none" && position !== "hidden";

  return (
    <>
    {
      (cardOptions.imagePosition === "left" && cardOptions.titlePosition === "right" && cardOptions.descriptionPosition  === "right" )&&
      <About elementData={elementData} containerTitle={containerTitle} />
      }
    {
      (cardOptions.imagePosition === "top" && cardOptions.titlePosition === "bottom" && cardOptions.descriptionPosition  === "none" )&&
      <Image elementData={elementData} containerTitle={containerTitle} />
      }
    {
      (cardOptions.imagePosition === "left" && cardOptions.titlePosition === "right" && cardOptions.descriptionPosition  === "none" )&&
      <ImageLeftCard elementData={elementData} containerTitle={containerTitle} />
      }
    {
      (cardOptions.imagePosition === "none" && cardOptions.titlePosition === "bottom" && cardOptions.descriptionPosition  === "top" )&&
      <NoImageCard 
      elementData={elementData} containerTitle={containerTitle}
       />
      }
    {
      (cardOptions.imagePosition === "right" && cardOptions.titlePosition === "left" && cardOptions.descriptionPosition  === "left" )&&
      <ImageRightCard 
      elementData={elementData} containerTitle={containerTitle}
       />
      }
      {
        (cardOptions.imagePosition === "top" && cardOptions.titlePosition === "top" && cardOptions.descriptionPosition  === "none" )&&
        <ImageOnlyCard 
        elementData={elementData} containerTitle={containerTitle}
         />
        }
      
    </>
  );
};

export default FundraiserCard;