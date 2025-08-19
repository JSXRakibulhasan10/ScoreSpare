import React, { useState, useEffect } from "react";
import FixtureCard from "../components/fixtures/FixtureCard";
import { getAllFixtures } from "../services/footballApi";
import { getLeagueFixtures } from "../services/footballApi";
import LeagueSelector from "../components/fixtures/LeagueSelector";
import ActiveLeagueIndicator from "../components/fixtures/ActiveLeagueIndicator";
import FixtureHeaderGrid from "../components/fixtures/FixtureHeaderGrid";

// Using LEAGUES constants
const LEAGUES = [
  {
    code: "PL",
    name: "Premier League",
    shortName: "EPL",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    gradient: "from-purple-500 to-pink-600",
    tableTheme: "purple",
  },
  {
    code: "PD",
    name: "La Liga",
    shortName: "La Liga",
    country: "Spain",
    flag: "🇪🇸",
    gradient: "from-orange-500 to-red-600",
    tableTheme: "orange",
  },
  {
    code: "SA",
    name: "Serie A",
    shortName: "Serie A",
    country: "Italy",
    flag: "🇮🇹",
    gradient: "from-blue-500 to-cyan-600",
    tableTheme: "blue",
  },
  {
    code: "BL1",
    name: "Bundesliga",
    shortName: "Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
    gradient: "from-red-500 to-rose-600",
    tableTheme: "red",
  },
  {
    code: "FL1",
    name: "Ligue 1",
    shortName: "Ligue 1",
    country: "France",
    flag: "🇫🇷",
    gradient: "from-green-500 to-emerald-600",
    tableTheme: "green",
  },
];

// Simple in-memory cache for fixtures data
const fixturesCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cached API function
const getCachedFixtures = async (leagueCode, limit) => {
  const cacheKey = `${leagueCode}-${limit}`;
  const cached = fixturesCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("⚽ Using cached fixtures data for", leagueCode);
    return cached.data;
  }

  console.log("🌐 Fetching fresh fixtures data for", leagueCode);

  const data =
    leagueCode === "all"
      ? await getAllFixtures(limit)
      : await getLeagueFixtures(leagueCode, limit);

  fixturesCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

const Fixtures = () => {
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [fixturesData, setFixturesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add "All Leagues" option
  const allLeaguesOption = {
    code: "all",
    name: "All Leagues",
    shortName: "All Leagues",
    country: "Europe",
    flag: "🏆",
    gradient: "from-purple-600 to-blue-600",
    tableTheme: "purple",
  };

  const leagueOptions = [allLeaguesOption, ...LEAGUES];

  const fetchFixtures = async (leagueCode, limit = 25) => {
    setLoading(true);
    setError(null);

    try {
      let isMounted = true;

      const data = await getCachedFixtures(leagueCode, limit);

      if (!isMounted) return;

      // Handle both array and object responses
      const fixturesArray = Array.isArray(data) ? data : data.fixtures || [];

      setFixturesData({
        count: data.count || fixturesArray.length,
        fixtures: fixturesArray,
      });

      return () => {
        isMounted = false;
      };
    } catch (err) {
      console.error("Error fetching fixtures:", err);
      setError("Failed to fetch fixtures. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures(selectedLeague);
  }, [selectedLeague]);

  const handleLeagueChange = (leagueCode) => {
    setSelectedLeague(leagueCode);
  };

  const currentLeague = leagueOptions.find(
    (league) => league.code === selectedLeague
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Upcoming Fixtures
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with upcoming matches from Europe's top 5 football
            leagues
          </p>
        </div>

        {/* League Selection Cards*/}
        <LeagueSelector
          leagueOptions={leagueOptions}
          handleLeagueChange={handleLeagueChange}
          selectedLeague={selectedLeague}
        />

        {/* Active League Indicator */}
        <ActiveLeagueIndicator currentLeague={currentLeague} />

        {/* Content Area - exactly matching your standings pattern */}
        <div className="mb-8">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading {currentLeague?.name} fixtures...
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
                  onClick={() => fetchFixtures(selectedLeague)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && fixturesData && (
            <FixtureHeaderGrid currentLeague={currentLeague} fixturesData={fixturesData} />
          )}

          {!loading &&
            !error &&
            fixturesData &&
            fixturesData.fixtures?.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-gray-500 text-xl font-semibold mb-2">
                  No upcoming fixtures
                </h3>
                <p className="text-gray-400">
                  No fixtures available for this selection.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Fixtures;
