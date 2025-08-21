import React, { useState, useEffect } from 'react';
import { getBPLFixtures } from '../services/footballApi';
import { getBPLStandings } from '../services/footballApi';

// BPL Fixture Card Component
const BPLFixtureCard = ({ fixture }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-3 sm:p-4">
        {/* Teams */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Home Team */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <img 
              src={fixture.homeTeam.logo} 
              alt={fixture.homeTeam.name}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="font-semibold text-gray-800 truncate text-sm sm:text-base">
              {fixture.homeTeam.name}
            </span>
          </div>

          <div className="px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm flex-shrink-0">VS</div>

          {/* Away Team */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
            <span className="font-semibold text-gray-800 truncate text-sm sm:text-base">
              {fixture.awayTeam.name}
            </span>
            <img 
              src={fixture.awayTeam.logo} 
              alt={fixture.awayTeam.name}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        {/* Match Details */}
        <div className="text-center bg-green-50 rounded-lg py-2 sm:py-3">
          <p className="text-xs sm:text-sm font-medium text-green-700">
            {formatDate(fixture.date)}
          </p>
          <p className="text-base sm:text-lg font-bold text-green-800">
            {fixture.time}
          </p>
          {fixture.venue && (
            <p className="text-xs text-green-600 mt-1">
              {fixture.venue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// BPL Standings Table Component
const BPLStandingsTable = ({ standings }) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">POS</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold min-w-[120px]">TEAM</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">P</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">W</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">D</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">L</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell">GF</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell">GA</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">GD</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team.name} className={`
                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                hover:bg-green-50 transition-colors duration-200
                ${team.position <= 3 ? 'border-l-2 sm:border-l-4 border-l-green-500' : ''}
              `}>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-gray-800 text-xs sm:text-sm">
                  {team.position}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img 
                      src={team.team.logo} 
                      alt={team.team.name}
                      className="w-4 h-4 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <span className="font-semibold text-gray-800 truncate text-xs sm:text-sm">
                      {team.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">{team.matchesPlayed}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">{team.won}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">{team.drawn}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">{team.lost}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm hidden sm:table-cell">{team.goalsFor}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-700 text-xs sm:text-sm hidden sm:table-cell">{team.goalsAgainst}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-800 text-xs sm:text-sm">
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-green-600 text-sm sm:text-lg">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BPL = () => {
  const [activeSection, setActiveSection] = useState('fixtures');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sections = [
    { key: 'fixtures', label: 'Fixtures', icon: '📅', color: 'from-green-500 to-green-600' },
    { key: 'standings', label: 'Standings', icon: '🏆', color: 'from-blue-500 to-blue-600' },
    { key: 'history', label: 'Results', icon: '📊', color: 'from-purple-500 to-purple-600' }
  ];

  const fetchData = async (section) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      switch (section) {
        case 'fixtures':
          result = await getBPLFixtures(15);
          break;
        case 'standings':
          result = await getBPLStandings();
          break;
        default:
          throw new Error('Invalid section');
      }
      setData(result);
    } catch (err) {
      console.error(`Error fetching BPL ${section}:`, err);
      setError(`Failed to load ${section}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeSection);
  }, [activeSection]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-3 sm:border-4 border-green-500 border-t-transparent mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Loading BPL {activeSection}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md mx-auto">
            <div className="text-red-600 text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">⚠️</div>
            <h3 className="text-red-800 font-bold text-base sm:text-lg mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => fetchData(activeSection)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!data) return null;

    switch (activeSection) {
      case 'fixtures':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Upcoming Fixtures</h2>
              <p className="text-gray-600 text-sm sm:text-base">{data.count} upcoming matches</p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.fixtures?.map((fixture) => (
                <BPLFixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </div>
        );

      case 'standings':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">League Table</h2>
              <p className="text-gray-600 text-sm sm:text-base">Current Bangladesh Premier League standings</p>
            </div>
            <BPLStandingsTable standings={data.standings || []} />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Recent Results</h2>
              <p className="text-gray-600 text-sm sm:text-base">{data.count} recent matches</p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.history?.map((match) => (
                <BPLHistoryCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="text-3xl sm:text-4xl lg:text-6xl">🇧🇩</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight">
              Bangladesh Premier League
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
            Stay updated with Bangladesh's premier football competition
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-1 sm:p-2 flex gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => handleSectionChange(section.key)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0
                  ${activeSection === section.key
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
              >
                <span className="text-sm sm:text-base lg:text-lg">{section.icon}</span>
                <span className="hidden xs:inline sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BPL;