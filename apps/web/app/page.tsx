import { getPage } from "../src/data/loader";

export default async function HomeRoute() {
  try {
    const pages = await getPage();
    console.log(pages);
    
    if (!pages || pages.length === 0) {
      // Instead of throwing notFound(), redirect to home page
      return (
        <meta httpEquiv="refresh" content={`0;url=/home`} />
      );
    }

    return (
      <meta httpEquiv="refresh" content={`0;url=/home`} />
    );
  } catch (error) {
    console.error('Error fetching pages during build:', error);
    // If API fails during build, still redirect to home page
    return (
      <meta httpEquiv="refresh" content={`0;url=/home`} />
    );
  }
}