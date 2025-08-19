import React from 'react'
import { RefreshCw, Wifi, WifiOff, Clock, MapPin, Trophy, Users, Activity, Zap, Filter, Globe } from 'lucide-react';

const LeagueSelector = ({allMatches, leagues, handleLeagueChange, activeLeague, }) => (
    <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Select League</h2>
        </div>
        <div className="text-sm text-gray-500">
          {allMatches.length} matches found
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => handleLeagueChange(league.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 group ${
              activeLeague === league.id
                ? 'border-blue-500 shadow-lg shadow-blue-100'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${league.color} opacity-0 group-hover:opacity-5 transition-opacity ${
              activeLeague === league.id ? 'opacity-10' : ''
            }`}></div>
            
            <div className="relative z-10 text-center">
              <div className="text-2xl mb-2">{league.icon}</div>
              <div className={`text-xs font-medium transition-colors ${
                activeLeague === league.id ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'
              }`}>
                {league.name}
              </div>
            </div>
            
            {activeLeague === league.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

export default LeagueSelector
