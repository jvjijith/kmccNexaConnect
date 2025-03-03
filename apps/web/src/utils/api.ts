import { baseApiConfig } from "./config";

const getConfig = async () => {
  return {
    ...baseApiConfig,
  };
};

export const fetchApi = async (endpoint: string, options: RequestInit = { method: "GET" }) => {
  const config = await getConfig();
  try {
    const response = await config.fetchApi(`${config.basePath}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const apiService = {
  fetchApi,
};
