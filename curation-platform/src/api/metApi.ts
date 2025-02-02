import axios from "axios";

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
// const MAX_OBJECTS = 200;
const RETRY_LIMIT = 3;

export const fetchMetData = async (resourceType: string, params: Record<string, any> = {}) => {

  let attempts = 0;

  while (attempts < RETRY_LIMIT) {
    try {
      const response = await axios.get(`${BASE_URL}/${resourceType}`, {
        params: {
          ...params,
        },
      });

      // console.log(`Successfully fetched ${resourceType} data`, response.data);
      return response.data;
    } catch (error: any) {
      attempts++;

      console.error(`API Request Failed (Attempt ${attempts}/${RETRY_LIMIT}):`, error.message);

      if (error.response) {
        console.error("Response Data:", error.response.data);
      }

      if (attempts >= RETRY_LIMIT) {
        console.error(`Met API failed after ${RETRY_LIMIT} attempts for ${resourceType}`);
        return null; 
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return null;
};
