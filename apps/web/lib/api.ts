import { fetchApi } from '../src/utils/api';

// Event API functions
export const getEvent = async (id: string) => {
  try {
    const response = await fetchApi(`/events/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getEventDonors = async (eventId: string) => {
  try {
    const response = await fetchApi(`/events/${eventId}/registrations/payment-status/paid`);
    return response;
  } catch (error) {
    console.error('Error fetching event donors:', error);
    return []; // Return empty array if no donors or error
  }
};

export const registerEvent = async (eventId: string, registrationData: any) => {
  try {
    const response = await fetchApi(`/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    return response;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const payment = async (paymentData: any) => {
  try {
    const response = await fetchApi('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return response;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Color API function
export const getColor = async () => {
  try {
    const response = await fetchApi('/colors');
    return response;
  } catch (error) {
    console.error('Error fetching colors:', error);
    // Return default colors if API fails
    return {
      primary: {
        light: '#64b5f6',
        main: '#2196f3',
        dark: '#1976d2',
        contrastText: '#ffffff'
      },
      secondary: {
        light: '#f48fb1',
        main: '#e91e63',
        dark: '#c2185b',
        contrastText: '#ffffff'
      }
    };
  }
};