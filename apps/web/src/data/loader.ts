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

export async function getProductPricing(productId: string) {
  return await fetchApi(`/apps/product/${productId}/pricing`);
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
    console.log('Registration request data:', data)
    console.log('Registration request headers:', headers)
    const response = await postApi('/auth/register', data, headers)
    console.log('Registration response:', response)
    return response
  } catch (error: any) {
    console.error('Registration API error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}
export async function login(data: any, headers?: any) {
  try {
    console.log('Login request data:', data)
    console.log('Login request headers:', headers)
    const response = await postApi('/auth/createToken', data, headers)
    console.log('Login response:', response)
    return response
  } catch (error: any) {
    console.error('Login API error:', error)
    throw new Error(error.message || 'Login failed')
  }
}

export async function getCart(headers?: HeadersInit) {
  return await fetchApi('/cart', { headers });
}

export async function addToCart(data: any, headers?: HeadersInit) {
  return await postApi('/cart/add', data, headers);
}

export async function updateCart(data: any, headers?: HeadersInit) {
  return await putApi('/cart/update', data, headers);
}

export async function removeFromCart(data: any, headers?: HeadersInit) {
  return await deleteApi('/cart/remove', data, headers);
}

export async function clearCart(headers?: HeadersInit) {
  return await deleteApi('/cart/clear', {}, headers);
}

export async function createCartPayment(headers?: HeadersInit) {
  try {
    return await postApi('/payments/cart/create', {}, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to create cart payment');
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
    return await postApi('/events/register/guest', data, headers);
  } catch (error: any) {
    throw new Error(error || 'Failed to register');
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
  return await postApi(`/membership/${memberId}/payment`, {}, headers);
}

export async function createSalesInvoice(data: any, headers?: HeadersInit) {
  try {
    console.log('Creating sales invoice with data:', JSON.stringify(data, null, 2))
    console.log('Using headers:', headers)

    const result = await postApi('/sales-invoices', data, headers);
    console.log('Sales invoice created successfully:', result)
    return result
  } catch (error: any) {
    console.error('Sales invoice creation failed:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    // Re-throw with a more descriptive message
    const errorMessage = error.message || 'Failed to create sales invoice'
    throw new Error(`Sales invoice creation failed: ${errorMessage}`)
  }
}

export async function getEventRegistrationsByPaymentStatus(eventId: string, paymentStatus: string, headers?: HeadersInit) {
  return await fetchApi(`/events/${eventId}/registrations/payment-status/${paymentStatus}`, { headers });
}