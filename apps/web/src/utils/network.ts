import { ResponseError } from "../nexa-api-client";

export const handleApiClientError = async <T>(
  error: T,
  logPrefix: string = 'API Error'
) => {
  if (error instanceof ResponseError) {
    console.debug(
      logPrefix,
      JSON.stringify(
        {
          url: error.response.url,
          status: error.response.status,
          statusText: error.response.statusText,
          response: await error.response.json()
        },
        null,
        2
      )
    );
  } else if (error instanceof Error) {
    console.debug(logPrefix, error.message);
  }
};
