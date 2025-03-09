import { notFound } from "next/navigation";
import { getPage } from "../src/data/loader";

export default async function HomeRoute() {
  const pages = await getPage();

  if (!pages || pages.length === 0) {
    notFound(); // Show 404 if no pages exist
  }

  return (
    <meta httpEquiv="refresh" content={`0;url=/${pages[0].slug}`} />
  );
}
