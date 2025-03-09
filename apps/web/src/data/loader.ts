import { fetchApi } from "../utils/api";

export async function getPage(slug?: string) {
  if (slug) {
    console.log("slug",await fetchApi(`/apps/page/slug/${slug}`));
    return await fetchApi(`/apps/page/slug/${slug}`); // Fetch page by slug
  }
  return await fetchApi("/apps/page"); // Fetch all pages
}

export async function getPageById(pageId: string) {
  return await fetchApi(`/apps/page/${pageId}`);
}

export async function getContainer(containerId: string) {
  return await fetchApi(`/apps/container/${containerId}`);
}

export async function getElement(elementId: string) {
  return await fetchApi(`/apps/element/${elementId}`);
}
