export const baseApiConfig = {
  basePath: process.env.API_BASE_URL || "http://localhost:9999", // Fallback URL
  apiKey: process.env.API_KEY || "default-api-key",
  headers: {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate",
    "accept-language": "*",
    "connection": "keep-alive",
    "host": "localhost:9999",
    "sec-fetch-mode": "cors",
    "user-agent": "node",
    "x-nexa-appid": process.env.API_KEY || "66ee43a23d6b6d3398c67c87",
    "x-nexa-appsecret": process.env.API_SECRET || "ca66d1a2b39081269c1301b49337a78705f3af4353c813291a2d797792d39402"
  },
  fetchApi: (input: string | URL | Request, init?: RequestInit) =>
    fetch(input, {
      ...init,
      headers: {
        ...baseApiConfig.headers, // Ensure headers are passed
        ...init?.headers // Allow additional headers
      }
    })
};
