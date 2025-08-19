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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !refreshing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div
                className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0"
                style={{
                  clipPath: "inset(0 50% 0 0)",
                  animationDirection: "reverse",
                  animationDuration: "1s",
                }}
              ></div>
            </div>
            <p className="text-gray-600 font-medium mt-6 animate-pulse">
              Loading live matches...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 shadow-lg">
              <WifiOff className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Connection Error
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => fetchMatches()}
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* League Selector */}
            <LeagueSelector
              leagues={leagues}
              allMatches={allMatches}
              handleLeagueChange={handleLeagueChange}
              activeLeague={activeLeague}
            />

            {/* Stats Bar */}
            <StatusBar
              liveMatches={liveMatches}
              finishedMatches={finishedMatches}
              allMatches={allMatches}
            />

            {/* Live Matches Section */}
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

            {/* Spacing between sections */}
            {liveMatches.length > 0 && finishedMatches.length > 0 && (
              <div className="my-12"></div>
            )}

            {/* Finished Matches Section */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default LiveScores;
