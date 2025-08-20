import React from 'react'
import { Clock, MapPin, Circle, Trophy, Zap } from 'lucide-react';
import TeamLogo from './TeamLogo';

const MatchCard = ({ match, index, getScoreDisplay, getStatusColor, formatStatus, isLiveMatch }) => {
    const scores = getScoreDisplay(match.score);
    const isLive = isLiveMatch(match.matchStatus);
    
    return (
      <div 
        className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border overflow-hidden ${
          isLive ? 'border-red-200 shadow-red-100' : 'border-gray-200'
        }`}
        style={{ 
          animation: `fadeInUp 0.5s ease-out ${index * 80}ms both`
        }}
      >
        {/* Competition Header */}
        <div className={`px-4 py-3 text-white relative overflow-hidden ${
          isLive 
            ? 'bg-gradient-to-r from-red-500 to-red-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          {isLive && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 animate-pulse opacity-30"></div>
          )}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="font-medium text-sm truncate">
                {match.competition?.name || 'Unknown Competition'}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.matchStatus)} flex items-center space-x-1`}>
              {isLive && <Circle className="w-2 h-2 fill-current animate-pulse" />}
              <span>{formatStatus(match.matchStatus, match.matchTime)}</span>
            </div>
          </div>
          
          {match.country?.name && (
            <div className="mt-1 text-xs opacity-80">
              {match.country.name}
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Teams and Score */}
          <div className="space-y-4">
            {/* Home Team */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamLogo team={match.homeTeam} side="home" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 truncate block group-hover:text-gray-900 transition-colors">
                    {match.homeTeam?.name || 'Unknown Team'}
                  </span>
                </div>
              </div>
              <div className={`text-3xl font-bold min-w-[3rem] text-center transition-all duration-300 ${
                isLive ? 'text-red-600 scale-105' : 'text-gray-800'
              }`}>
                {scores[0] || '0'}
              </div>
            </div>

            {/* Score Divider with Animation */}
            <div className="flex justify-center">
              <div className={`transition-all duration-500 ${
                isLive 
                  ? 'w-16 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-200' 
                  : 'w-10 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full'
              }`}></div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamLogo team={match.awayTeam} side="away" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 truncate block group-hover:text-gray-900 transition-colors">
                    {match.awayTeam?.name || 'Unknown Team'}
                  </span>
                </div>
              </div>
              <div className={`text-3xl font-bold min-w-[3rem] text-center transition-all duration-300 ${
                isLive ? 'text-red-600 scale-105' : 'text-gray-800'
              }`}>
                {scores[1] || '0'}
              </div>
            </div>
          </div>

          {/* Match Details */}
          {(match.scheduledTime || match.venue) && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                {match.scheduledTime && (
                  <div className="flex items-center space-x-2 hover:text-gray-800 transition-colors">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(match.scheduledTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {match.venue && (
                  <div className="flex items-center space-x-2 hover:text-gray-800 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{match.venue}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Scores */}
          {(match.score?.halfTime || match.score?.fullTime) && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex space-x-3 text-xs">
                {match.score.halfTime && match.score.halfTime !== '0 - 0' && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-3 py-2 border border-gray-200 hover:shadow-sm transition-all">
                    <span className="text-gray-500">HT:</span>
                    <span className="ml-2 font-medium text-gray-700">{match.score.halfTime}</span>
                  </div>
                )}
                {match.score.fullTime && match.score.fullTime !== '0 - 0' && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-3 py-2 border border-gray-200 hover:shadow-sm transition-all">
                    <span className="text-gray-500">FT:</span>
                    <span className="ml-2 font-medium text-gray-700">{match.score.fullTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live Match Indicator */}
          {isLive && (
            <div className="mt-4 pt-4 border-t border-red-100">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <Zap className="w-4 h-4 animate-bounce" />
                <span className="text-sm font-medium">Live Match</span>
                <Zap className="w-4 h-4 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default MatchCard