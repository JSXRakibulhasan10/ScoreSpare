import { API_BASE_URL, API_ENDPOINTS } from '../constants/apiConfig';

const makeApiCall = async (url) => {
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

export const getLeagueStandings = async (leagueCode, season) => {
  const url = `${API_ENDPOINTS.STANDINGS}/${leagueCode}?season=${season}`;
  return makeApiCall(url);
};