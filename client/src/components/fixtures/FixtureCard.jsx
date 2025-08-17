// Fixture Card Component
const FixtureCard = ({ fixture }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Competition Badge */}
      {fixture.competition && (
        <div className="px-4 pt-4 pb-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            {fixture.competition.emblem && (
              <img 
                src={fixture.competition.emblem} 
                alt={fixture.competition.name}
                className="w-4 h-4"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <span className="text-xs font-medium text-gray-600">
              {fixture.leagueName || fixture.competition.name}
            </span>
          </div>
        </div>
      )}

      {/* Main Match Info */}
      <div className="px-4 pb-4">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1">
            {fixture.homeTeam.crest && (
              <img 
                src={fixture.homeTeam.crest} 
                alt={fixture.homeTeam.name}
                className="w-8 h-8 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {fixture.homeTeam.shortName || fixture.homeTeam.name}
              </p>
            </div>
          </div>

          {/* VS */}
          <div className="px-4 text-gray-400 font-medium">VS</div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="min-w-0 text-right">
              <p className="font-semibold text-gray-800 truncate">
                {fixture.awayTeam.shortName || fixture.awayTeam.name}
              </p>
            </div>
            {fixture.awayTeam.crest && (
              <img 
                src={fixture.awayTeam.crest} 
                alt={fixture.awayTeam.name}
                className="w-8 h-8 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="text-center bg-gray-50 rounded-xl py-3">
          <p className="text-sm font-medium text-gray-600">
            {formatDate(fixture.utcDate)}
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatTime(fixture.utcDate)}
          </p>
          {fixture.matchday && (
            <p className="text-xs text-gray-500 mt-1">
              Matchday {fixture.matchday}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixtureCard