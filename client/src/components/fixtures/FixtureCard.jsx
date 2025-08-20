import React from 'react';
import { Calendar, Clock, Trophy } from 'lucide-react';

// Fixture Card Component
 const FixtureCard = ({ fixture, index = 0 }) => {
  const formatDate = (utcDate) => {
    const date = new Date(utcDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
         
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
         
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
         
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
 
  const formatTime = (utcDate) => {
    return new Date(utcDate).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const isToday = new Date(fixture.utcDate).toDateString() === new Date().toDateString();
  const isTomorrow = new Date(fixture.utcDate).toDateString() === new Date(Date.now() + 86400000).toDateString();
 
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-200 overflow-hidden"
      style={{ 
        animation: `fadeInUp 0.5s ease-out ${index * 80}ms both`
      }}
    >
      {/* Competition Header */}
      {fixture.competition && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2">
          <div className="flex items-center space-x-2 text-white">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium truncate">
              {fixture.leagueName || fixture.competition.name}
            </span>
            {fixture.matchday && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-auto">
                MD {fixture.matchday}
              </span>
            )}
          </div>
        </div>
      )}
 
      <div className="p-5">
        {/* Teams Section */}
        <div className="space-y-4 mb-5">
          {/* Home Team */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {fixture.homeTeam.crest ? (
                <img 
                  src={fixture.homeTeam.crest}
                  alt={fixture.homeTeam.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ display: fixture.homeTeam.crest ? 'none' : 'flex' }}>
                {fixture.homeTeam.name?.charAt(0) || 'H'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {fixture.homeTeam.shortName || fixture.homeTeam.name}
              </p>
              <p className="text-sm text-gray-500">Home</p>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
          </div>

          {/* Away Team */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {fixture.awayTeam.crest ? (
                <img 
                  src={fixture.awayTeam.crest}
                  alt={fixture.awayTeam.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ display: fixture.awayTeam.crest ? 'none' : 'flex' }}>
                {fixture.awayTeam.name?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {fixture.awayTeam.shortName || fixture.awayTeam.name}
              </p>
              <p className="text-sm text-gray-500">Away</p>
            </div>
          </div>
        </div>
         
        {/* Date & Time */}
        <div className={`rounded-xl p-4 text-center border-2 ${
          isToday 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : isTomorrow 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calendar className={`w-4 h-4 ${
              isToday 
                ? 'text-green-600' 
                : isTomorrow 
                  ? 'text-blue-600'
                  : 'text-gray-600'
            }`} />
            <p className={`text-sm font-medium ${
              isToday 
                ? 'text-green-700' 
                : isTomorrow 
                  ? 'text-blue-700'
                  : 'text-gray-700'
            }`}>
              {formatDate(fixture.utcDate)}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className={`w-4 h-4 ${
              isToday 
                ? 'text-green-600' 
                : isTomorrow 
                  ? 'text-blue-600'
                  : 'text-gray-600'
            }`} />
            <p className={`text-lg font-bold ${
              isToday 
                ? 'text-green-800' 
                : isTomorrow 
                  ? 'text-blue-800'
                  : 'text-gray-800'
            }`}>
              {formatTime(fixture.utcDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FixtureCard;