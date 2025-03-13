import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import About from '../newComponents/about'
import Image from '../newComponents/image'
import ImageLeftCard from '../newComponents/imageLeftCard'
import ImageRightCard from '../newComponents/imageRightCard'
import NoImageCard from '../newComponents/noImageCard'
import ImageOnlyCard from '../newComponents/imageOnlyCard'
import NormalCard from '../newComponents/normalCard'

const event = {
  id: '123',
  title: 'Tech Conference 2025',
  description: 'Join us for the biggest tech event of the year with speakers from around the globe discussing the latest innovations.',
  date: '2025-04-15',
  location: 'San Francisco, CA',
  category: 'technology',
  image: '/images/tech-conference.jpg'
};

const FundraiserCard = ({
  elementData,
  theme,
  withOpacity,
  containerTitle
}: {
  elementData: any;
  theme: any;
  withOpacity: (color: string, opacity: number) => string;
  containerTitle?: string;
}) => {
  const { cardOptions, title, description, imageUrl } = elementData;

  // Helper function to determine visibility
  const isVisible = (position: string) => position !== "none" && position !== "hidden";

  return (
    <>
    {
      (cardOptions.imagePosition === "left" && cardOptions.titlePosition === "right" && cardOptions.descriptionPosition  === "right" )&&
      <About elementData={elementData} containerTitle={containerTitle} 
      themes={theme} 
      />
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
      themes={theme}
       />
      }
    {
      (cardOptions.imagePosition === "right" && cardOptions.titlePosition === "left" && cardOptions.descriptionPosition  === "left" )&&
      <ImageRightCard 
      elementData={elementData} containerTitle={containerTitle}
      themes={theme} 
       />
      }
      {
        (cardOptions.imagePosition === "top" && cardOptions.titlePosition === "top" && cardOptions.descriptionPosition  === "none" )&&
        <ImageOnlyCard 
        elementData={elementData} containerTitle={containerTitle}
        themes={theme} 
         />
        }
      {
        (cardOptions.imagePosition === "top" && cardOptions.titlePosition === "bottom" && cardOptions.descriptionPosition  === "bottom" )&&
        <NormalCard 
        elementData={elementData}
        themes={theme}  />
        }
      
    </>
  );
};

export default FundraiserCard;