import React, { useState, useEffect } from "react";
import StandingsTable from "../components/standings/StandingsTables";
import { getLeagueStandings } from "../services/footballApi";
import { LEAGUES, AVAILABLE_SEASONS } from "../constants/leagues";
import LeagueSelector from "../components/standings/LeagueSelector";
import SeasonSelector from "../components/standings/SeasonSelector";

// Simple in-memory cache for standings data
const standingsCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 5 minutes
// Cached API function
const getCachedStandings = async (leagueCode, season) => {
  const cacheKey = `${leagueCode}-${season}`;
  const cached = standingsCache.get(cacheKey);

  // Return cached data if it exists and is not expired
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("📋 Using cached standings data for", leagueCode);
    return cached.data;
  }

  // Fetch fresh data
  console.log("🌐 Fetching fresh standings data for", leagueCode);

  const data = await getLeagueStandings(leagueCode, season);

  // Cache the new data
  standingsCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

// Main Standings component
const Standings = () => {
  const [selectedLeague, setSelectedLeague] = useState("PL");
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const [standingsData, setStandingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStandings = async (leagueCode, season) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCachedStandings(leagueCode, season);
      setStandingsData(data);
    } catch (err) {
      setError("Failed to fetch standings. Please check your connection.");
      console.error("Error fetching standings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings(selectedLeague, selectedSeason);
  }, [selectedLeague, selectedSeason]);

  const handleLeagueChange = (leagueCode) => {
    setSelectedLeague(leagueCode);
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const currentLeague = LEAGUES.find(
    (league) => league.code === selectedLeague
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            League Standings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow the race for glory in Europe's top 5 football leagues
          </p>
        </div>

        {/* League Selector */}
        <div className="mb-8">
          <LeagueSelector handleLeagueChange={handleLeagueChange} selectedLeague={selectedLeague} LEAGUES={LEAGUES} />

          {/* Season Selector */}
          <SeasonSelector handleSeasonChange={handleSeasonChange} selectedSeason={selectedSeason} AVAILABLE_SEASONS={AVAILABLE_SEASONS} />
        </div>

        {/* Content Area */}
        <div className="mb-8">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading {currentLeague?.name} standings...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-red-800 font-bold text-lg mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchStandings(selectedLeague, selectedSeason)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && standingsData && (
            <StandingsTable
              standings={standingsData.standings}
              competition={standingsData.competition}
              season={standingsData.season}
              theme={currentLeague?.tableTheme}
            />
          )}

          {!loading &&
            !error &&
            standingsData &&
            standingsData.standings.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">
                  No standings data available for this selection.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Standings;

