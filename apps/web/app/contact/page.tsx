import Contact from '@repo/ui/contact'
import { getColor } from '../../src/data/loader';

export default async function ContactUs() {
  let colors = null;

  try {
    // Add timeout to prevent build hanging
    const colorPromise = getColor("light");
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );
    
    const colorData = await Promise.race([colorPromise, timeoutPromise]);
    if (colorData?.theme?.palette?.primary?.main) {
      colors = colorData;
    }
  } catch (error) {
    console.error("Error fetching color data:", error);
    // Use fallback colors for build
    colors = {
      theme: {
        palette: {
          primary: {
            main: '#1976d2'
          }
        }
      }
    };
  }

  return (
    <Contact />
  );
}