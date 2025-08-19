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

// Fixtures for a single league
export const getLeagueFixtures = async (leagueCode, limit = 10) => {
  const url = `${API_ENDPOINTS.FIXTURES}?competitionId=${leagueCode}&limit=${limit}`;
  return makeApiCall(url);
};

// All fixtures
export const getAllFixtures = async (limit = 20) => {
  const url = `${API_ENDPOINTS.FIXTURES}/all?limit=${limit}`;
  return makeApiCall(url);
};

// Fixtures for a specific team
export const getTeamFixtures = async (teamId, limit = 10) => {
  const url = `${API_ENDPOINTS.FIXTURES}/team/${teamId}?limit=${limit}`;
  return makeApiCall(url);
};

// Search teams
export const searchTeams = async (searchTerm) => {
  const url = `${API_ENDPOINTS.TEAMS}/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
  return makeApiCall(url);
};

// BPL Fixtures  
export const getBPLFixtures = async () => {
  const url = `${API_ENDPOINTS.BPL}/fixtures`;
  return makeApiCall(url);
};

export const getBPLStandings = async () => {
  const url = `${API_ENDPOINTS.BPL}/standings`;
  return makeApiCall(url);
};

export const getBPLiveScores = async () => {
  const url = `${API_ENDPOINTS.BPL}/live-score`;
  return makeApiCall(url)
}

// Live Matches
export const getLiveMatches = async () => {
  const url = API_ENDPOINTS.LIVE_MATCHES;
  return makeApiCall(url);
};
