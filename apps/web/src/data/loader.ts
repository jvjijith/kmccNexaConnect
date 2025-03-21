import { fetchApi } from "../utils/api";

export async function getPage(slug?: string) {
  if (slug) {
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

export async function getCatalog(catalogId: string) {
  return await fetchApi(`/apps/catalog/${catalogId}`);
}

export async function getEvent(eventId: string) {
  return await fetchApi(`/apps/event/${eventId}`);
}

export async function getProduct(productId: string) {
  return await fetchApi(`/apps/product/${productId}`);
}

export async function getElement(elementId: string) {
  return await fetchApi(`/apps/element/${elementId}`);
}

export async function getColor(mode: string) {
  return await fetchApi(`/apps/colors/${mode}`);
}

export async function getMenu() {
  return await fetchApi(`/apps/menu`);
}
