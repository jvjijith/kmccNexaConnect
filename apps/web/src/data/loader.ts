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

export async function payment(registrationId: any) {
  try {
    return await postApi(`/payments/create/${registrationId}`,{});
  } catch (error: any) {
    throw new Error(error || 'Payment failed');
  }
}

export async function registerEvent(data: any, headers?: HeadersInit) {
  try {
    console.log("Registering event with data:", data);
    console.log("Using headers:", headers);
    return await postApi('/events/register/guest', data, headers);
  } catch (error: any) {
    console.error("Registration API error:", error);
    throw new Error(error.message || error || 'Failed to register');
  }
}

export async function updateEvent(data: any, headers?: HeadersInit) {
  try {
    return await putApi('/events/update', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to update register');
  }
}

export async function getRegisterEvent(registerId: any, headers?: HeadersInit) {
  try {
    return await fetchApi(`/events/${registerId}`, { headers });
  } catch (error: any) {
    throw new Error(error || 'Failed to fetch events');
  }
}

// Membership API functions
export async function submitMembershipApplication(data: any, headers?: HeadersInit) {
  try {
    return await postApi('/members', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to submit membership application');
  }
}

export async function createMemberPayment(memberId: string, headers?: HeadersInit) {
  try {
    return await postApi(`/payments/member/create/${memberId}`, {}, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to create payment');
  }
}

// Media Upload API functions
export async function generateSignedUrl(data: {
  title: string;
  mediaType: 'image' | 'document' | 'signature';
  ext: string;
  active: boolean;
  uploadStatus: 'progressing' | 'completed' | 'failed';
  uploadProgress: number;
}, headers?: HeadersInit) {
  try {
    return await postApi('/media/generateSignedUrl', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to generate signed URL');
  }
}

export async function updateMediaStatus(mediaId: string, data: {
  title: string;
  mediaType: 'image' | 'document' | 'signature';
  ext: string;
  active: boolean;
  uploadStatus: 'progressing' | 'completed' | 'failed';
  uploadProgress: number;
}, headers?: HeadersInit) {
  try {
    return await putApi(`/media/update/${mediaId}`, data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to update media status');
  }
}

// Cart Payment API
export async function createCartPayment(headers?: HeadersInit) {
  try {
    return await postApi('/payments/cart/create', {}, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to create cart payment');
  }
}

// User Signup API
export async function signupUser(data: any, headers?: HeadersInit) {
  try {
    return await postApi('/auth/register', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to signup user');
  }
}

// Event Donors API - for donation events
export async function getEventDonors(eventId: string, headers?: HeadersInit) {
  try {
    return await fetchApi(`/events/${eventId}/donors`, { headers });
  } catch (error: any) {
    throw new Error(error || 'Failed to fetch event donors');
  }
}