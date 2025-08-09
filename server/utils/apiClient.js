import axios from "axios";

// Asynchronous function to fetch data from a given API endpoint
// url: The API endpoint to send the GET request to
// params: Optional query parameters to include in the request
export const fetchFromAPI = async (url, params = {}) => {
    try {
        // Send a GET request using axios with the provided URL and parameters
        const response = await axios.get(url, { params });
        // Return the data from the API response
        return response.data;
    } catch (error) {
        // Log any errors that occur during the request
        console.error("API Fetch error: ", error.message);
        // Throw a new error to be handled by the calling function
        throw new Error("Failed to fetch Data from API");
    }
}