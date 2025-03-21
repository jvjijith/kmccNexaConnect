"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Box, 
  Container, 
  Typography, 
  Skeleton 
} from "@repo/ui/mui";
import EventDetailPage from "@repo/ui/eventdetails";
import type { Event } from "@repo/ui/event";
import { getColor, getEvent } from "../../../src/data/loader";

// Skeleton component for the header section
const HeaderSkeleton = () => (
  <Box
    sx={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 2, sm: 3, md: 4 },
      marginTop: { xs: 3, sm: 4, md: 5 }
    }}
  >
    <Skeleton 
      variant="rectangular" 
      width="60%" 
      height={60} 
      sx={{ mx: 'auto' }} 
    />
    <Skeleton 
      variant="rectangular" 
      width="80%" 
      height={40} 
      sx={{ mx: 'auto' }} 
    />
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Skeleton variant="rectangular" width={100} height={20} />
      <Skeleton variant="rectangular" width={100} height={20} />
    </Box>
  </Box>
);

// Skeleton component for the event details
const EventDetailsSkeleton = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Skeleton variant="rectangular" width="100%" height={400} />
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={60} />
      <Skeleton variant="rectangular" width="90%" height={40} />
      <Skeleton variant="rectangular" width="85%" height={40} />
    </Box>
  </Box>
);

// Main content component
const EventContent = ({ event, themes }: { event: Event, themes: any }) => (
  <>
    <Box
  sx={{
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    // bgcolor: themes?.theme.palette.primary?.light
  }}
>
  <Container
    maxWidth={false}
    sx={{
      py: { xs: 6, sm: 8, md: 12 },
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 8, sm: 12, md: 16 },
    }}
  >
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3, md: 4 },
        marginTop: { xs: 3, sm: 4, md: 5 }
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        fontWeight="bold" 
        sx={{ 
          letterSpacing: '-0.025em',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        {event.name || 'Event Details'}
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{
          maxWidth: '42rem',
          mx: 'auto',
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        {event.metadata?.description || event.description}
      </Typography>
    </Box>
  </Container>
</Box>
    <EventDetailPage event={event} themes={themes} />
  </>
);

// Loading component
const LoadingState = () => (
  <Container sx={{ py: 12 }}>
    <HeaderSkeleton />
    <EventDetailsSkeleton />
  </Container>
);

// Error component
const ErrorState = () => (
  <Container sx={{ py: 12, textAlign: 'center' }}>
    <Typography variant="h5" color="error">
      Event not found or error loading event
    </Typography>
  </Container>
);

export default function EventPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [color, setColor] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
          const [eventData, colorData] = await Promise.all([
            getEvent(id),
            getColor("light")
          ]);
          setEvent(eventData);
          setColor(colorData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  if (error) {
    return <ErrorState />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      {loading ? (
        <LoadingState />
      ) : event && color ? (
        <EventContent event={event} themes={color} />
      ) : (
        <ErrorState />
      )}
    </Suspense>
  );
}