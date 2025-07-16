export const baseApiConfig = {
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "", // Ensure fallback
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
  headers: {
    accept: "*/*",
    "accept-encoding": "gzip, deflate",
    "accept-language": "*",
    connection: "keep-alive",
    host: "storeapi-vewo.onrender.com",
    "sec-fetch-mode": "cors",
    "user-agent": "node",
    "x-nexa-appid": process.env.NEXT_PUBLIC_API_KEY || "",
    "x-nexa-appsecret": process.env.NEXT_PUBLIC_API_SECRET || ""
  },
  fetchApi: (input: string | URL | Request, init?: RequestInit) => {
    // If no API base URL is configured, return a mock response
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn('API base URL not configured, returning mock data');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          title: 'Mock Page',
          items: [],
          message: 'API not configured'
        })
      } as Response);
    }

    const filteredHeaders = Object.fromEntries(
      Object.entries(baseApiConfig.headers).filter(([_, value]) => value !== undefined)
    );

    return fetch(input, {
      ...init,
      headers: {
        ...filteredHeaders, // Use filtered headers
        ...(init?.headers as HeadersInit) // Ensure additional headers are merged properly
      }
    });
  }
};

export const getConfig = async (): Promise<Configuration> => {
  const basePath = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""

  console.log('API Configuration:', {
    basePath,
    apiKey: apiKey ? 'Set' : 'Not set',
    hasApiKey: !!apiKey
  })

  // Don't throw errors if API is not configured, just warn
  if (!basePath) {
    console.warn('NEXT_PUBLIC_API_BASE_URL is not set - using fallback mode')
  }

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_API_KEY is not set - using fallback mode')
  }

  return {
    basePath,
    fetchApi: fetch,
    headers: {
      "x-nexa-appid": apiKey,
      "x-nexa-appsecret": process.env.NEXT_PUBLIC_API_SECRET || "",
      "Content-Type": "application/json",
    },
  }
}

export interface Configuration {
  basePath: string
  fetchApi: typeof fetch
  headers: Record<string, string>
}