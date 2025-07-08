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

  if (!basePath) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not set')
    throw new Error('API base URL is not configured')
  }

  if (!apiKey) {
    console.error('NEXT_PUBLIC_API_KEY is not set')
    throw new Error('API key is not configured')
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