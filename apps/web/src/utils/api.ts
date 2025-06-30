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
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (err: any) {
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

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`

      // Try to get more detailed error information from the response body
      try {
        const errorBody = await response.text()
        if (errorBody) {
          try {
            const errorJson = JSON.parse(errorBody)
            if (errorJson.message) {
              errorMessage = errorJson.message
            } else if (errorJson.error) {
              errorMessage = errorJson.error
            } else {
              errorMessage = `${errorMessage} - ${errorBody}`
            }
          } catch {
            errorMessage = `${errorMessage} - ${errorBody}`
          }
        }
      } catch {
        // If we can't read the response body, use the original error
      }

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (err: any) {
    // If it's already an Error object, preserve the message
    if (err instanceof Error) {
      throw err
    }
    throw new Error(err)
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