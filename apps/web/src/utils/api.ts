import { baseApiConfig } from "./config"

const getConfig = async () => {
  return {
    ...baseApiConfig,
  }
}

export const fetchApi = async (endpoint: string, options: RequestInit = { method: "GET" }) => {
  const config = await getConfig()
  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options)

    if (!response.ok) {
      // During build time, if we get a 404, return empty array instead of throwing
      if (response.status === 404 && process.env.NODE_ENV !== 'development') {
        console.warn(`API endpoint ${endpoint} returned 404 during build, returning empty array`);
        return [];
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (err: any) {
    // During build time, return empty array instead of throwing
    if (process.env.NODE_ENV !== 'development') {
      console.warn(`API call to ${endpoint} failed during build:`, err.message);
      return [];
    }
    throw new Error(err.message)
  }
}

export const postApi = async <T>(
  endpoint: string,
  data: any,
  customHeaders?: HeadersInit
): Promise<T> => {
  const config = await getConfig()
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
      ...customHeaders,
    },
    body: JSON.stringify(data),
  }

  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options)

    // Try to parse the response body for better error messages
    let responseData
    try {
      responseData = await response.json()
    } catch (parseError) {
      responseData = null
    }

    if (!response.ok) {
      // If we have response data with error details, use that
      if (responseData && responseData.error) {
        const errorMessage = typeof responseData.error === 'string'
          ? responseData.error
          : JSON.stringify(responseData.error)
        throw new Error(errorMessage)
      } else if (responseData && responseData.message) {
        const errorMessage = typeof responseData.message === 'string'
          ? responseData.message
          : JSON.stringify(responseData.message)
        throw new Error(errorMessage)
      } else if (responseData) {
        // If we have response data but no specific error field, stringify the whole response
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(responseData)}`)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    }

    return responseData
  } catch (err: any) {
    console.error(`API Error for ${endpoint}:`, err)
    throw new Error(err.message || 'API request failed')
  }
}

export const putApi = async <T>(
  endpoint: string,
  data: any,
  customHeaders?: HeadersInit
): Promise<T> => {
  const config = await getConfig()
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
      ...customHeaders,
    },
    body: JSON.stringify(data),
  }

  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (err: any) {
    throw new Error(err)
  }
}

export const deleteApi = async <T>(
  endpoint: string,
  body?: any,
  customHeaders?: HeadersInit
): Promise<T> => {
  const config = await getConfig()
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
      ...customHeaders,
    },
    ...(body && { body: JSON.stringify(body) }) // Include body only if it exists
  }

  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (err: any) {
    throw new Error(err)
  }
}

// Optional: Add a patch method if needed
export const patchApi = async <T>(
  endpoint: string,
  data: any,
  customHeaders?: HeadersInit
): Promise<T> => {
  const config = await getConfig()
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
      ...customHeaders,
    },
    body: JSON.stringify(data),
  }

  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (err: any) {
    throw new Error(err)
  }
}

export const apiService = {
  fetchApi,
  postApi,
  putApi,
  deleteApi,
  patchApi, // Include if you want to use PATCH
}