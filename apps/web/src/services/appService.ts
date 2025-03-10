import { AppsApi, Configuration, GetPageBySlugRequest } from '../nexa-api-client';
import { baseApiConfig } from '../utils/config'

const getConfig = async () => {
    return new Configuration({
      ...baseApiConfig,
    });
    
  };

const getPageBySlug = async (params: string) => {
  const config = await getConfig();
  const appsApi = new AppsApi(config);
  const  response = await appsApi.getPageBySlug({
    slug: params
  });
  return response;
};

export const appServices = {getPageBySlug}