import axios from "axios";

const BASE_URL = "https://api.harvardartmuseums.org";
const API_KEY = import.meta.env.VITE_HARVARD_API_KEY;

/**
 * Fetch objects from Harvard Art Museums API with specified parameters
 * @param resourceType - The type of resource (e.g., "object")
 * @param params - Additional query parameters to include in the request
 * @returns Response data from the API
 */
export const fetchHarvardData = async (resourceType: string, params: Record<string, any>) => {
  try {
    // Append API key to query parameters
    const queryParams = {
      ...params,
      apikey: API_KEY,
    };

    // Build the full URL
    const url = `${BASE_URL}/${resourceType}`;

    // Make the GET request with query parameters
    const response = await axios.get(url, { params: queryParams });

    // Return the response data
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data from Harvard API:", error);
    throw new Error("Failed to fetch data from Harvard Art Museums API.");
  }
};
