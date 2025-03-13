"use client"

import { useEffect, useState } from "react"
import {
  Typography,
  Box,
  IconButton,
  Divider,
  CardMedia,
  Paper,
  Modal,
  Breadcrumbs,
  Link as MuiLink,
  ThemeProvider
} from "@mui/material"
import {Grid2 as Grid} from '@mui/material';
import { motion } from "framer-motion"
import { ArrowBack, Home } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { createDynamicTheme } from "../theme/theme";

// Define the ElementData type
interface ElementData {
  title: { lanCode: string; name: string }[]
  description: { paragraph: string }[]
  imageUrl: string
  info: { title: string; content: string }[]
}

// Props interface for the component
interface ChildrensMinistryDetailProps {
  elementData: ElementData
  open: boolean
  themes: any;
  onClose: () => void
}

export default function ChildrensMinistryDetail({
  elementData,
  open,
  themes,
  onClose
}: ChildrensMinistryDetailProps) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  const ministryTitle = elementData?.title?.[0]?.name || "Ministry Details"

  useEffect(() => {
    if (open) setLoaded(true)
  }, [open])

  const theme = createDynamicTheme({ themes });
  return (
      <ThemeProvider theme={theme}>
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "53%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 2000,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          maxHeight: "90vh",
          overflowY: "hidden" // Hide the outer scrollbar
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 0, display: "flex", alignItems: "center", position: "static" }}>
            <IconButton
            size="large"
              onClick={onClose}
              sx={{
                height: {xs:40, sm:40, md:60},
                width: {xs:40, sm:40, md:60},
                mr: 2,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark"
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight={700}>
              {/* {ministryTitle} */}
            </Typography>
          </Box>

          {/* Added top margin to bring the card down */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              mb: 6,
              mt: 3, // Added margin-top to bring the card down
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              height: "70vh" // Fixed height for the entire paper container
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              {/* Left side - Fixed Image */}
              <Grid
                size={{
                  xs: 12,
                  md: 5,
                  lg: 6
                }}
                sx={{
                  height: { xs: "40vh", md: "100%" },
                  position: { md: "sticky" },
                  top: 0
                }}
              >
                <CardMedia
                  component="img"
                  image={elementData.imageUrl}
                  alt={ministryTitle}
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover"
                  }}
                />
              </Grid>

              {/* Right side - Scrollable Content */}
              <Grid
                size={{
                  xs: 12,
                  md: 7,
                  lg: 6
                }}
                sx={{
                  height: "100%",
                  overflow: "hidden"
                }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 5 },
                    overflowY: "auto",
                    height: "100%",
                    scrollbarWidth: "none", // Hide scrollbar for Firefox
                    msOverflowStyle: "none", // Hide scrollbar for IE and Edge
                    "&::-webkit-scrollbar": {
                      display: "none" // Hide scrollbar for Chrome, Safari, and Opera
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Typography
                      variant="h3"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" }
                      }}
                    >
                      {ministryTitle}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loaded ? 1 : 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box sx={{ mt: 3 }}>
  {elementData.description && elementData.description.length > 0 ? (
    elementData.description.map((desc, index) => {
      let text = desc.paragraph.trim();

      // Updated pattern to use "_" instead of "-"
      const linkPattern = /#\s*(.*?)\s*_\s*(.*?)\s*_/g;
      let modifiedText: (string | JSX.Element)[] = [];
      let lastIndex = 0;

      text.replace(linkPattern, (match, url, linkText, offset) => {
        modifiedText.push(text.substring(lastIndex, offset)); // Add text before link
        modifiedText.push(
          <MuiLink 
            key={`${index}-${offset}`} 
            href={url.trim()} 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            {linkText.trim()}
          </MuiLink>
        );
        lastIndex = offset + match.length;
        return match;
      });

      modifiedText.push(text.substring(lastIndex)); // Add remaining text after last match

      // Handle Subheadings (**text**)
      if (text.startsWith("**")) {
        return (
          <Typography key={index} variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
            {text.replace("**", "").trim()}
          </Typography>
        );
      }

      // Handle Bullet Points (* text or * #link _ text _ other text)
      if (text.startsWith("*")) {
        let bulletText = text.replace(/^\*\s*/, "").trim(); // Remove the "*"

        // Process links inside bullet points
        let formattedText: (string | JSX.Element)[] = [];
        let lastIdx = 0;

        bulletText.replace(linkPattern, (match, url, linkText, offset) => {
          formattedText.push(bulletText.substring(lastIdx, offset)); // Text before the link
          formattedText.push(
            <MuiLink 
              key={`${index}-bullet-${offset}`} 
              href={url.trim()} 
              target="_blank" 
              rel="noopener noreferrer" 
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              {linkText.trim()}
            </MuiLink>
          );
          lastIdx = offset + match.length;
          return match;
        });

        formattedText.push(bulletText.substring(lastIdx)); // Remaining text after the last link

        return (
          <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.2rem",
                textIndent: "-1rem", // Moves bullet left
                paddingLeft: "1.5rem", // Aligns text correctly
                lineHeight: 1.8
              }}
            >
              <span style={{ color: "primary.main", fontWeight: 600, marginRight: "8px" }}>•</span>
              {formattedText}
            </Typography>
          </Box>
        );
      }

      // Normal paragraph with inline links
      return (
        <Typography key={index} variant="body1" component="p" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1.2rem" }}>
          {modifiedText}
        </Typography>
      );
    })
  ) : (
    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
      No additional information available for this ministry.
    </Typography>
  )}
</Box>


                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </Modal>
    </ThemeProvider>
  )
}