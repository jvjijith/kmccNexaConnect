"use client"

import { Card, Box, Skeleton } from "@mui/material"
import {Grid2 as Grid} from '@mui/material'

export function ChildrensMinistryCardSkeleton() {
  return (
    <Card
      sx={{
        height: 600,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        position: "relative",
        margin: 5,
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        animation="wave"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
        }}
      >
        <Skeleton variant="text" width="70%" height={40} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} animation="wave" />
        <Skeleton variant="text" width="90%" height={20} animation="wave" />
        <Skeleton variant="text" width="80%" height={20} animation="wave" />
      </Box>
    </Card>
  )
}

export function ChildrensMinistryModalSkeleton() {
  return (
    <Box sx={{ p: 0 }}>
      <Grid container>
        <Grid size={{xs:12, md:5}} sx={{ position: "relative", height: { xs: 300, md: "auto" } }}>
          <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" sx={{ minHeight: { md: 600 } }} />
        </Grid>

        <Grid size={{xs:12, md:7}}>
          <Box sx={{ p: 4 }}>
            <Skeleton variant="text" width="70%" height={50} animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={4} animation="wave" sx={{ my: 3 }} />
            <Skeleton variant="text" width="100%" height={25} animation="wave" sx={{ mt: 5, mb: 2 }} />
            <Skeleton variant="text" width="95%" height={25} animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={25} animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={25} animation="wave" sx={{ mb: 2 }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}