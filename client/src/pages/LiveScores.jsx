import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock, MapPin, Trophy, Users, Activity, Zap, Filter, Globe } from 'lucide-react';
import { getLiveMatches } from '../services/footballApi';

const LiveScores = () => {
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeLeague, setActiveLeague] = useState('all');

  // Available leagues based on your backend
  const leagues = [
    { id: 'all', name: 'All Leagues', endpoint: '/api/live-matches/scores', icon: '🌍', color: 'from-blue-600 to-purple-600' },
    { id: 'premier-league', name: 'Premier League', endpoint: '/api/live-matches/premier-league', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'from-purple-600 to-purple-700' },
    { id: 'la-liga', name: 'La Liga', endpoint: '/api/live-matches/la-liga', icon: '🇪🇸', color: 'from-red-500 to-yellow-500' },
    { id: 'serie-a', name: 'Serie A', endpoint: '/api/live-matches/serie-a', icon: '🇮🇹', color: 'from-green-600 to-red-600' },
    { id: 'bundesliga', name: 'Bundesliga', endpoint: '/api/live-matches/bundesliga', icon: '🇩🇪', color: 'from-red-600 to-yellow-500' },
    { id: 'ligue-1', name: 'Ligue 1', endpoint: '/api/live-matches/ligue-1', icon: '🇫🇷', color: 'from-blue-600 to-red-500' },
    { id: 'champions-league', name: 'Champions League', endpoint: '/api/live-matches/champions-league', icon: '🏆', color: 'from-blue-800 to-blue-900' }
  ];

const fetchMatches = async (isRefresh = false, leagueId = activeLeague) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

  
    const data = await getLiveMatches();

    console.log("API Response data:", data);

    if (data.success) {
      const matches = data.matches || [];
      console.log("Processed matches:", matches);
      setAllMatches(matches);
      setLastUpdated(new Date().toLocaleTimeString());
    } else {
      throw new Error(data.message || "API returned success: false");
    }
  } catch (err) {
    console.error("Error fetching matches:", err);
    setError(`Failed to load matches: ${err.message}`);
    setAllMatches([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    fetchMatches();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchMatches(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [activeLeague]);

  const handleLeagueChange = (leagueId) => {
    setActiveLeague(leagueId);
    fetchMatches(false, leagueId);
  };

  // Separate matches into live and finished based on your backend data structure
  const liveMatches = allMatches.filter(match => 
    ['live', 'in_play', 'half_time', 'ht'].includes(match.matchStatus?.toLowerCase())
  );
  
  const finishedMatches = allMatches.filter(match => 
    ['finished', 'ft', 'full_time'].includes(match.matchStatus?.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'in_play':
        return 'bg-red-500 animate-pulse';
      case 'finished':
      case 'ft':
      case 'full_time':
        return 'bg-gray-500';
      case 'half_time':
      case 'ht':
        return 'bg-orange-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'postponed':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatStatus = (status, time) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'in_play':
        return time ? `${time}'` : 'LIVE';
      case 'finished':
      case 'ft':
      case 'full_time':
        return 'FT';
      case 'half_time':
      case 'ht':
        return 'HT';
      case 'scheduled':
        return 'Scheduled';
      case 'postponed':
        return 'Postponed';
      default:
        return status || 'Unknown';
    }
  };

  const getScoreDisplay = (score) => {
    // Handle your backend's score structure
    if (score?.current && typeof score.current === 'string') {
      // Format: "2 - 1" 
      const parts = score.current.split(' - ');
      if (parts.length === 2) {
        return [parts[0].trim(), parts[1].trim()];
      }
    }
    
    // Handle object format
    if (score?.home !== undefined && score?.away !== undefined) {
      return [score.home.toString(), score.away.toString()];
    }
    
    return ['0', '0'];
  };

  const isLiveMatch = (status) => {
    return ['live', 'in_play', 'half_time', 'ht'].includes(status?.toLowerCase());
  };

  const TeamLogo = ({ team, side }) => {
    const [imageError, setImageError] = useState(false);
    const fallbackColor = side === 'home' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600';
    
    if (!team?.logo || imageError) {
      return (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-white font-bold text-sm border-2 border-gray-100`}>
          {team?.name?.charAt(0)?.toUpperCase() || (side === 'home' ? 'H' : 'A')}
        </div>
      );
    }

    return (
      <img 
        src={team.logo} 
        alt={team.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-300 transition-colors"
        onError={() => setImageError(true)}
      />
    );
  };

  const LeagueSelector = () => (
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

  const MatchCard = ({ match, index }) => {
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

  const MatchSection = ({ matches, title, emptyMessage, isLiveSection }) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${isLiveSection ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {matches.length}
        </span>
        {activeLeague !== 'all' && (
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {leagues.find(l => l.id === activeLeague)?.name}
          </span>
        )}
      </div>
      
      {matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className={`w-16 h-16 ${isLiveSection ? 'bg-red-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isLiveSection ? (
              <Activity className={`w-8 h-8 ${isLiveSection ? 'text-red-400' : 'text-gray-400'}`} />
            ) : (
              <Trophy className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-gray-600">{emptyMessage}</p>
          {activeLeague !== 'all' && (
            <p className="text-gray-500 text-sm mt-2">
              Try selecting "All Leagues" to see more matches
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <MatchCard key={match.matchId || match.fixtureId || index} match={match} index={index} />
          ))}
        </div>
      )}
    </div>
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
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Live Sports
                </h1>
                <p className="mt-1 text-gray-600">Real-time match scores and updates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="hidden sm:block text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  Updated: {lastUpdated}
                </div>
              )}
              <button
                onClick={() => fetchMatches(true)}
                disabled={refreshing}
                className={`inline-flex items-center px-6 py-3 rounded-xl border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${
                  refreshing ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !refreshing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0" style={{
                clipPath: 'inset(0 50% 0 0)',
                animationDirection: 'reverse',
                animationDuration: '1s'
              }}></div>
            </div>
            <p className="text-gray-600 font-medium mt-6 animate-pulse">Loading live matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 shadow-lg">
              <WifiOff className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connection Error</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
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
            <LeagueSelector />

            {/* Stats Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      {liveMatches.length} live matches
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {finishedMatches.length} finished matches
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {allMatches.length} total matches
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Auto-refresh every 60s
                </div>
              </div>
            </div>

            {/* Live Matches Section */}
            <MatchSection 
              matches={liveMatches}
              title="Live Matches"
              emptyMessage="No live matches at the moment. Check back later!"
              isLiveSection={true}
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
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LiveScores;