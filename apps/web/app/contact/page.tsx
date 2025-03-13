import Contact from '@repo/ui/contact'
import { getColor } from '../../src/data/loader';

export default async function ContactUs() {
  let colors =null;

  try {
    
    const colorData = await getColor("light");
    if (colorData?.theme?.palette?.primary?.main) {
      colors = colorData;
    }
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }

  return (
    <Contact 
    // themes={{colors}}
    />
  );
}
