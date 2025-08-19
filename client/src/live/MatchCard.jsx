import React from 'react'
import { RefreshCw, Wifi, WifiOff, Clock, MapPin, Trophy, Users, Activity, Zap, Filter, Globe } from 'lucide-react';
import TeamLogo from './TeamLogo';

const MatchCard = ({ match, index,getScoreDisplay, getStatusColor, formatStatus, isLiveMatch }) => {
    const scores = getScoreDisplay(match.score);
    const isLive = isLiveMatch(match.matchStatus);
    
    return (
      <div 
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border overflow-hidden ${
          isLive ? 'border-red-200 shadow-red-100' : 'border-gray-100'
        }`}
        style={{ 
          animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
        }}
      >
        {/* Competition Header */}
        <div className={`px-6 py-3 text-white relative overflow-hidden ${
          isLive 
            ? 'bg-gradient-to-r from-red-500 to-red-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          {isLive && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 animate-pulse opacity-20"></div>
          )}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="font-medium text-sm truncate">
                {match.competition?.name || 'Unknown Competition'}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.matchStatus)} text-white flex items-center space-x-1`}>
              {isLive && <Activity className="w-3 h-3" />}
              <span>{formatStatus(match.matchStatus, match.matchTime)}</span>
            </div>
          </div>
          
          {match.country?.name && (
            <div className="mt-1 text-xs opacity-80 flex items-center space-x-1">
              <span>{match.country.name}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Teams and Score */}
          <div className="space-y-4">
            {/* Home Team */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamLogo team={match.homeTeam} side="home" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 truncate block">
                    {match.homeTeam?.name || 'Unknown Team'}
                  </span>
                </div>
              </div>
              <div className={`text-3xl font-bold min-w-[3rem] text-center transition-colors ${
                isLive ? 'text-red-600' : 'text-gray-800'
              }`}>
                {scores[0] || '0'}
              </div>
            </div>

            {/* Score Divider with Animation */}
            <div className="flex justify-center">
              <div className={`transition-all duration-500 ${
                isLive 
                  ? 'w-12 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse' 
                  : 'w-8 h-0.5 bg-gray-300 rounded-full'
              }`}></div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <TeamLogo team={match.awayTeam} side="away" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 truncate block">
                    {match.awayTeam?.name || 'Unknown Team'}
                  </span>
                </div>
              </div>
              <div className={`text-3xl font-bold min-w-[3rem] text-center transition-colors ${
                isLive ? 'text-red-600' : 'text-gray-800'
              }`}>
                {scores[1] || '0'}
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {match.scheduledTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="truncate">
                    {new Date(match.scheduledTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {match.venue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{match.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Scores */}
          {(match.score?.halfTime || match.score?.fullTime) && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {match.score.halfTime && match.score.halfTime !== '0 - 0' && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-500">HT:</span>
                    <span className="ml-2 font-medium text-gray-700">{match.score.halfTime}</span>
                  </div>
                )}
                {match.score.fullTime && match.score.fullTime !== '0 - 0' && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
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
