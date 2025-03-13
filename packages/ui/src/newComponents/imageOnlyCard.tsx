"use client"

import { useState } from "react"
import { Card, CardMedia, Typography, Box, IconButton, Dialog, DialogContent, Divider, useMediaQuery, useTheme } from "@mui/material"
import {Grid2 as Grid} from '@mui/material';
import { motion } from "framer-motion"
import { ZoomIn, Close } from "@mui/icons-material"

// Define the elementData type
interface ElementData {
  componentType: string
  referenceName: string
  items: any[]
  availability: { appId: string }[]
  numberItems: {
    web: number
    android: number
    iOS: number
  }
  title: {
    lanCode: string
    name: string
  }[]
  description: any[]
  draft: boolean
  publish: boolean
  withText: boolean
  withDescription: boolean
  viewText: string
  viewAll: any
  swiperOptions: any
  imageUrl: string
  cardOptions: {
    imagePosition: string
    titlePosition: string
    descriptionPosition: string
    actionButtonPosition: string
    actionButtonText: string
    actionButtonUrl: string
    cardAspectRatio: string
  }
  hoverEffect: string
  info: any[]
}

// Props interface for the component
interface ChildrensMinistryCardProps {
  elementData: ElementData
  containerTitle?: string
  themes: any;
}

export default function ChildrensMinistryCard({ elementData, containerTitle, themes }: ChildrensMinistryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  
  const title = elementData?.title?.[0]?.name || ""
  
  const handleOpenModal = () => {
    setModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{ marginBottom: 100 }}
      >
        <Card
          sx={{
            height: 600,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            position: "relative",
            cursor: "pointer",
            margin:5,
            "&:hover": {
              boxShadow: "0 12px 45px rgba(0,0,0,0.15)",
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleOpenModal}
        >
          <Box sx={{ position: "relative", height: "100%" }}>
            <CardMedia
              component="img"
              image={elementData?.imageUrl}
              alt={title}
              sx={{
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
            
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
                p: 3,
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(0)" : "translateY(10px)",
                opacity: isHovered ? 1 : 0.9,
              }}
            >
              <Typography 
                variant="h5" 
                component="h3" 
                sx={{ 
                  color: "white", 
                  fontWeight: 700, 
                  mb: 1
                }}
              >
                {title}
              </Typography>
              {elementData?.description?.length > 0 && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 3,
                      lineHeight: 1.8,
                      fontSize: '1.1rem'
                    }}
                  >
                    {elementData.description[0].paragraph}
                  </Typography>
                )}

            </Box>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: isHovered ? 1 : 0 }} 
              transition={{ duration: 0.2 }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <ZoomIn />
              </IconButton>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
      
      {/* Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        slotProps={{ paper:{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            overflow: "hidden",
            bgcolor: "background.paper",
          },},
          transition: {
            timeout: 0
          }
        }}
        
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              zIndex: 10,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ p: 0 }}>
            <Grid container>
              <Grid size = {{xs:12, md:5}} sx={{ position: "relative", height: { xs: 300, md: "auto" } }}>
                {/* Using CardMedia instead of Next.js Image to avoid hostname config error */}
                <CardMedia
                  component="img"
                  image={elementData.imageUrl}
                  alt={title}
                  sx={{
                    height: "100%",
                    minHeight: { md: 600 },
                    objectFit: "cover",
                  }}
                />
              </Grid>

              <Grid size = {{xs:12, md:7}}>
                <Box sx={{ p: 4 }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Typography 
                      variant="body1" 
                      component="p" 
                      sx={{ mt: 5 }} // Center align text
                    >
                      {elementData.description && elementData.description.length > 0 
                        ? elementData.description.map((desc: { paragraph: string }, index: number) => (
                            <Typography key={index} fontSize={'1.2rem'} sx={{ mb: 2 }}> {/* Ensure Box content is centered */}
                              {desc.paragraph}
                            </Typography>
                          ))
                        : "No additional information available."}
                    </Typography>
                  </motion.div>

                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  )
}