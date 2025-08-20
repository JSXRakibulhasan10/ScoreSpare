
import MatchCard from "./MatchCard";
import { Trophy, Activity } from "lucide-react";


const MatchSection = ({
  matches,
  title,
  emptyMessage,
  isLiveSection,
  activeLeague,
  leagues,
  getScoreDisplay,
  getStatusColor,
  formatStatus,
  isLiveMatch,
}) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <div
        className={`w-3 h-3 rounded-full ${
          isLiveSection ? "bg-red-500 animate-pulse" : "bg-gray-500"
        }`}
      ></div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {matches.length}
      </span>
      {activeLeague !== "all" && (
        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {leagues.find((l) => l.id === activeLeague)?.name}
        </span>
      )}
    </div>

    {matches.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <div
          className={`w-16 h-16 ${
            isLiveSection ? "bg-red-100" : "bg-gray-100"
          } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {isLiveSection ? (
            <Activity
              className={`w-8 h-8 ${
                isLiveSection ? "text-red-400" : "text-gray-400"
              }`}
            />
          ) : (
            <Trophy className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <p className="text-gray-600">{emptyMessage}</p>
        {activeLeague !== "all" && (
          <p className="text-gray-500 text-sm mt-2">
            Try selecting "All Leagues" to see more matches
          </p>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match, index) => (
          <MatchCard
            key={match.matchId || match.fixtureId || index}
            match={match}
            index={index}
            getScoreDisplay={getScoreDisplay}
            getStatusColor={getStatusColor}
            formatStatus={formatStatus}
            isLiveMatch={isLiveMatch}
          />
        ))}
      </div>
    )}
  </div>
);

export default MatchSection;
