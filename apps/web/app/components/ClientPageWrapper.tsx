"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import Page from "../../src/components/page";
import BeautifulLoadingScreen from "../components/BeautifulLoadingScreen";
import { getContainer, getPage } from "../../src/data/loader";
import {
  CloudDownload,
  Palette,
  ViewModule,
  DataObject
} from '@mui/icons-material';

interface PageData {
  items?: string[];
  [key: string]: any;
}

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface ClientPageWrapperProps {
  slug: string;
}

const ClientPageWrapper: React.FC<ClientPageWrapperProps> = ({ slug }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [containers, setContainers] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    {
      id: 'fetch',
      label: 'Fetching page data',
      icon: <CloudDownload />,
      completed: false,
      active: false
    },
    {
      id: 'containers',
      label: 'Loading components',
      icon: <ViewModule />,
      completed: false,
      active: false
    },
    {
      id: 'process',
      label: 'Processing elements',
      icon: <DataObject />,
      completed: false,
      active: false
    },
    {
      id: 'theme',
      label: 'Applying styles',
      icon: <Palette />,
      completed: false,
      active: false
    }
  ]);

  const updateStep = (stepId: string, completed: boolean, active: boolean = false) => {
    setLoadingSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, completed, active }
        : step.id === 'fetch' && stepId === 'containers' 
          ? { ...step, completed: true, active: false }
          : step.id === 'containers' && stepId === 'process'
            ? { ...step, completed: true, active: false }
            : step.id === 'process' && stepId === 'theme'
              ? { ...step, completed: true, active: false }
              : step
    ));
  };

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress(5);
        setLoadingText("Initializing page...");

        // Force loading to complete after 1 second maximum
        const forceComplete = setTimeout(() => {
          console.log("Force completing loading after 1 second");
          setLoadingProgress(100);
          setLoadingText("Ready!");
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }, 1000);

        // Add timeout for API calls
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout - API is taking too long to respond')), 800)
        );

        // Step 1: Fetch page data
        updateStep('fetch', false, true);
        setLoadingProgress(15);
        setLoadingText("Fetching page data...");

        await new Promise(resolve => setTimeout(resolve, 100)); // Show step

        try {
          const fetchedPageData: PageData = await Promise.race([
            getPage(slug),
            timeoutPromise
          ]) as PageData;

          if (!fetchedPageData) {
            throw new Error('No page data received');
          }

          setPageData(fetchedPageData);
        } catch (apiError: any) {
          console.error('API Error:', apiError);
          // Provide fallback data for development/testing
          // No fallback data, just show white screen
          setPageData(null);
          clearTimeout(forceComplete);
          setIsLoading(false);
          return;
        }

        updateStep('fetch', true, false);
        setLoadingProgress(35);

        // Step 2: Load containers
        updateStep('containers', false, true);
        setLoadingText("Loading page components...");
        await new Promise(resolve => setTimeout(resolve, 100));

        let fetchedContainers: any[] = [];
        if (pageData?.items?.length) {
          const totalItems = pageData.items.length;
          try {
            const containerPromises = pageData.items.map(async (itemId: string) => {
              try {
                const container = await Promise.race([
                  getContainer(itemId),
                  timeoutPromise
                ]);
                // Update progress for each container loaded
                const progressIncrement = 25 / totalItems;
                setLoadingProgress(prev => prev + progressIncrement);
                return container;
              } catch (containerError) {
                console.error(`Error loading container ${itemId}:`, containerError);
                // Return fallback container
                return {
                  id: itemId,
                  title: `Container ${itemId}`,
                  items: [],
                  layoutOptions: { layout: 'grid' }
                };
              }
            });

            fetchedContainers = await Promise.all(containerPromises);
          } catch (containerError) {
            console.error('Error loading containers:', containerError);
            fetchedContainers = [];
          }
        }

        setContainers(fetchedContainers);
        updateStep('containers', true, false);
        setLoadingProgress(70);

        // Step 3: Process elements
        updateStep('process', false, true);
        setLoadingText("Processing page elements...");
        await new Promise(resolve => setTimeout(resolve, 400));

        updateStep('process', true, false);
        setLoadingProgress(85);

        // Step 4: Apply theme and finalize
        updateStep('theme', false, true);
        setLoadingText("Applying theme and styles...");
        await new Promise(resolve => setTimeout(resolve, 300));

        updateStep('theme', true, false);
        setLoadingProgress(95);
        setLoadingText("Almost ready...");

        await new Promise(resolve => setTimeout(resolve, 200));
        setLoadingProgress(100);
        setLoadingText("Ready!");

        // Final delay before hiding loading screen
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);

      } catch (error: any) {
        console.error("Error loading page:", error);
        setError(error.message || "Failed to load page content");
        setLoadingText("Error loading content");
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [slug]);

  if (isLoading) {
    return (
      <BeautifulLoadingScreen 
        loadingText={loadingText}
        progress={loadingProgress}
        showProgress={true}
        steps={loadingSteps}
      />
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          textAlign: "center",
          padding: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: 400
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{
              background: 'linear-gradient(45deg, #16a249, #4caf50)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0d7a32, #16a249)',
              }
            }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  if (!pageData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'white'
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "column",
        overflow: "hidden",
        opacity: 0,
        animation: 'fadeIn 0.5s ease-in-out forwards',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Page pageData={pageData} containers={containers} />
    </Box>
  );
};

export default ClientPageWrapper;