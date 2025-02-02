import axios from "axios";

const BASE_URL = "https://api.harvardartmuseums.org";
const API_KEY = import.meta.env.VITE_HARVARD_API_KEY; 

// const MAX_OBJECTS = 200;
const RETRY_LIMIT = 3;


export const fetchHarvardData = async (
  resourceType: "object" | "classification",
  params: Record<string, any> = {}
) => {
  let attempts = 0;

  while (attempts < RETRY_LIMIT) {
    try {
      const response = await axios.get(`${BASE_URL}/${resourceType}`, {
        params: {
          ...params,
          apikey: API_KEY,
        },
      });

      // console.log(`Successfully fetched ${resourceType} data`, response.data);
      return response.data;
    } catch (error: any) {
      attempts++;

      console.error(`API Request Failed (Attempt ${attempts}/${RETRY_LIMIT}):`, error.message);

      if (error.response) {
        console.error("📄 Response Data:", error.response.data);
      }

      if (attempts >= RETRY_LIMIT) {
        console.error(`Harvard API failed after ${RETRY_LIMIT} attempts for ${resourceType}`);
        return null; 
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return null;
};
