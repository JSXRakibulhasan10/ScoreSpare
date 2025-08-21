import React, { useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { useMatchData } from "../hooks/useMatchData";
import LeagueSelector from "../live/LeagueSelector";
import MatchSection from "../live/MatchSection";
import StatusBar from "../live/StatusBar";
import Header from "../live/Header";
import { leagues } from "../live/Leagues";
import { getStatusColor, formatStatus, getScoreDisplay, isLiveMatch } from "../live/matchUtils";

const LiveScores = () => {
  const [activeLeague, setActiveLeague] = useState("all");
  const { allMatches, loading, error, lastUpdated, refreshing, fetchMatches } =
    useMatchData(activeLeague);

  const handleLeagueChange = (leagueId) => {
    setActiveLeague(leagueId);
    fetchMatches(false);
  };

  // Separate matches into live and finished based on your backend data structure
  const liveMatches = allMatches.filter((match) =>
    ["live", "in_play", "half_time", "ht"].includes(
      match.matchStatus?.toLowerCase()
    )
  );

  const finishedMatches = allMatches.filter((match) =>
    ["finished", "ft", "full_time"].includes(match.matchStatus?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Header */}
      <Header
        lastUpdated={lastUpdated}
        fetchMatches={fetchMatches}
        refreshing={refreshing}
      />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {loading && !refreshing ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-blue-200 rounded-full animate-spin"></div>
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0"
                style={{
                  clipPath: "inset(0 50% 0 0)",
                  animationDirection: "reverse",
                  animationDuration: "1s",
                }}
              ></div>
            </div>
            <p className="text-gray-600 font-medium mt-4 sm:mt-6 animate-pulse text-sm sm:text-base">
              Loading live matches...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-red-100 rounded-full mb-4 sm:mb-6 shadow-lg">
              <WifiOff className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Connection Error
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base">
              {error}
            </p>
            <button
              onClick={() => fetchMatches()}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* League Selector */}
            <div className="mb-4 sm:mb-6">
              <LeagueSelector
                leagues={leagues}
                allMatches={allMatches}
                handleLeagueChange={handleLeagueChange}
                activeLeague={activeLeague}
              />
            </div>

            {/* Stats Bar */}
            <div className="mb-4 sm:mb-6">
              <StatusBar
                liveMatches={liveMatches}
                finishedMatches={finishedMatches}
                allMatches={allMatches}
              />
            </div>

            {/* Live Matches Section */}
            <div className="mb-6 sm:mb-8">
              <MatchSection
                matches={liveMatches}
                title="Live Matches"
                emptyMessage="No live matches at the moment. Check back later!"
                isLiveSection={true}
                leagues={leagues}
                activeLeague={activeLeague}
                getScoreDisplay={getScoreDisplay}
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                isLiveMatch={isLiveMatch}
              />
            </div>

            {/* Spacing between sections */}
            {liveMatches.length > 0 && finishedMatches.length > 0 && (
              <div className="my-6 sm:my-8 lg:my-12"></div>
            )}

            {/* Finished Matches Section */}
            <div className="mb-4 sm:mb-6">
              <MatchSection
                matches={finishedMatches}
                title="Finished Matches"
                emptyMessage="No finished matches to show."
                isLiveSection={false}
                leagues={leagues}
                activeLeague={activeLeague}
                getScoreDisplay={getScoreDisplay}
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                isLiveMatch={isLiveMatch}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveScores;