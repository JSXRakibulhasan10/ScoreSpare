import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConfig";



const apiCall = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Standings with league and season parameters
export const getStandings = (leagueCode, season = '2024') => {
  return apiCall(`${API_ENDPOINTS.STANDINGS}/${leagueCode}?season=${season}`);
};

// Add other API functions as needed
export const getFixtures = () => apiCall(API_ENDPOINTS.FIXTURES);
export const getLiveMatches = () => apiCall(API_ENDPOINTS.LIVE_MATCHES);