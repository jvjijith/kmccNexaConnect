import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Container, 
  useTheme, 
  alpha,
  Grid,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define the data structure for the biography content
interface BiographyData {
  name: string;
  title: string;
  biography: string[];
  achievements: string[];
  education: string[];
}

const legendData: BiographyData = {
  name: "John Doe",
  title: "Professional Title",
  biography: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at justo eget nisi fringilla varius. Vivamus euismod magna in lacus commodo, in eleifend dolor volutpat. Praesent vitae est nec felis interdum vehicula. Suspendisse potenti. Cras luctus, nisl in tincidunt varius, nisi magna facilisis nisl, vel ultricies nisi nunc vel nisi.",
    "Nullam in quam at magna efficitur lobortis. Ut eget ligula vel sapien eleifend tincidunt. Quisque aliquam, nisl in semper sagittis, nisi magna facilisis nisl, vel ultricies nisi nunc vel nisi. Vivamus euismod magna in lacus commodo, in eleifend dolor volutpat. Praesent vitae est nec felis interdum vehicula.",
    "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla facilisi. Quisque aliquam, nisl in semper sagittis, nisi magna facilisis nisl, vel ultricies nisi nunc vel nisi. Vivamus euismod magna in lacus commodo, in eleifend dolor volutpat. Praesent vitae est nec felis interdum vehicula."
  ],
  achievements: [
    "Award for Excellence in the Field (2020)",
    "Notable Publication in Major Journal (2019)",
    "Industry Recognition for Outstanding Contribution (2018)"
  ],
  education: [
    "Ph.D. in Field of Study, University Name (2015)",
    "Master's Degree in Related Field, Another University (2012)",
    "Bachelor's Degree in Basic Field, First University (2010)"
  ]
};

const BiographySection: React.FC = () => {
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  // Fix: Initialize empty arrays to avoid undefined issues
  const paragraphRefs = useRef<(HTMLElement | null)[]>([]);
  const achievementRefs = useRef<(HTMLElement | null)[]>([]);
  const educationRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize the ref arrays based on data length
  useEffect(() => {
    paragraphRefs.current = Array(legendData.biography.length).fill(null);
    achievementRefs.current = Array(legendData.achievements.length).fill(null);
    educationRefs.current = Array(legendData.education.length).fill(null);
  }, []);

  // Initialize animation on component mount
  useEffect(() => {
    if (sectionRef.current) {
      // Animate the section header
      gsap.fromTo(
        '.biography-header',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate the divider
      gsap.fromTo(
        '.biography-divider',
        { width: '0%' },
        { 
          width: '100%', 
          duration: 1.2, 
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Animate each paragraph with staggered delay
      paragraphRefs.current.forEach((paragraph, index) => {
        if (paragraph) {
          gsap.fromTo(
            paragraph,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              delay: 0.4 + (index * 0.2),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: paragraph,
                start: 'top 85%',
              }
            }
          );
        }
      });

      // Animate achievements and education sections
      ['.achievements-header', '.education-header'].forEach((selector, idx) => {
        gsap.fromTo(
          selector,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            delay: 0.6 + (idx * 0.2),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: selector,
              start: 'top 85%',
            }
          }
        );
      });

      // Animate achievement items
      achievementRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -20, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.6, 
              delay: 0.8 + (index * 0.15),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
              }
            }
          );
        }
      });

      // Animate education items
      educationRefs.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -20, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.6, 
              delay: 1 + (index * 0.15),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
              }
            }
          );
        }
      });
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          my: 4, 
          borderRadius: 2,
          minHeight: '50vh',
          width: '100%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.default, 0.95)})`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box id="biography" ref={sectionRef} sx={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              className="biography-header"
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.primary.main, 
                display: 'flex', 
                alignItems: 'center',
                position: 'relative',
                // '&::after': {
                //   content: '""',
                //   position: 'absolute',
                //   bottom: -8,
                //   left: 0,
                //   width: '60px',
                //   height: '4px',
                //   backgroundColor: theme.palette.secondary.main,
                //   borderRadius: '2px'
                // }
              }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: '1.5em' }} /> Biography
            </Typography>
          </motion.div>
          
          <Divider 
            className="biography-divider"
            sx={{ 
              mb: 4, 
              mt: 1,
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${alpha(theme.palette.primary.main, 0.3)})` 
            }} 
          />
          
          {/* Fixed Grid - Removed incorrect margin and width settings */}
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={4}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '100%',
                  minHeight: 250,
                  background: theme.palette.mode === 'dark' ? 
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.5)}, ${alpha(theme.palette.primary.main, 0.2)})` : 
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.5)}, ${alpha(theme.palette.primary.main, 0.2)})`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3
                }}
              >
                <PersonIcon sx={{ fontSize: '5rem', color: alpha(theme.palette.common.white, 0.8), mb: 2 }} />
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    color: theme.palette.common.white, 
                    fontWeight: 'bold',
                    mb: 1
                  }}
                >
                  {legendData.name}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  align="center" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.9),
                    fontStyle: 'italic'
                  }}
                >
                  {legendData.title}
                </Typography>
              </Box>
            </Grid> */}
            
            <Grid item xs={12} md={12}>
              {legendData.biography.map((paragraph, index) => (
                <Typography 
                  key={index} 
                  variant="body1" 
                  paragraph
                  ref={(el) => { 
                    paragraphRefs.current[index] = el as HTMLElement | null; 
                  }}
                  sx={{ 
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: theme.palette.text.primary,
                    textAlign: 'justify',
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Grid>
          </Grid>
          
          {/* Achievements and Education Section - Fixed Grid */}
          {/* <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h5" 
                component="h3" 
                className="achievements-header"
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.secondary.main,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Achievements
              </Typography>
              <Box sx={{ pl: 2, borderLeft: `3px solid ${alpha(theme.palette.secondary.main, 0.6)}` }}>
                {legendData.achievements.map((achievement, index) => (
                  <Box 
                    key={index}
                    ref={(el) => { 
                      achievementRefs.current[index] = el as HTMLElement | null; 
                    }}
                    sx={{ 
                      mb: 2,
                      pb: 1,
                      borderBottom: index !== legendData.achievements.length - 1 ? 
                        `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        color: theme.palette.text.primary
                      }}
                    >
                      {achievement}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid> */}
            
            {/* Education Section */}
            {/* <Grid item xs={12} md={6}>
              <Typography 
                variant="h5" 
                component="h3" 
                className="education-header"
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.secondary.main,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Education
              </Typography>
              <Box sx={{ pl: 2, borderLeft: `3px solid ${alpha(theme.palette.secondary.main, 0.6)}` }}>
                {legendData.education.map((education, index) => (
                  <Box 
                    key={index}
                    ref={(el) => { 
                      educationRefs.current[index] = el as HTMLElement | null; 
                    }}
                    sx={{ 
                      mb: 2,
                      pb: 1,
                      borderBottom: index !== legendData.education.length - 1 ? 
                        `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        color: theme.palette.text.primary
                      }}
                    >
                      {education}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid> */}
        </Box>
      </Paper>
    </Container>
  );
};

export default BiographySection;