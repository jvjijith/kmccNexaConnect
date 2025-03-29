import { deleteApi, fetchApi, postApi, putApi } from "../utils/api";

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

export async function getAuth(data: any, headers?: any) {
  try {
    return await postApi('/auth/register', data, headers)
  } catch (error: any) {
    throw new Error(error || 'Registration failed')
  }
}
export async function login(data: any, headers?: any) {
  try {
    return await postApi('/auth/createToken', data, headers)
  } catch (error: any) {
    throw new Error(error || 'Registration failed')
  }
}

export async function getCart(headers?: HeadersInit) {
  try {
    return await fetchApi('/cart', { headers });
  } catch (error: any) {
    throw new Error(error || 'Failed to fetch cart');
  }
}

export async function addToCart(data: any, headers?: HeadersInit) {
  try {
    return await postApi('/cart/add', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to add item to cart');
  }
}

export async function updateCart(data: any, headers?: HeadersInit) {
  try {
    return await putApi('/cart/update', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to update cart');
  }
}

export async function removeFromCart(data: any, headers?: HeadersInit) {
  try {
    return await deleteApi('/cart/remove', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to remove item from cart');
  }
}

export async function clearCart(headers?: HeadersInit) {
  try {
    return await deleteApi('/cart/clear', undefined, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to clear cart');
  }
}