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
