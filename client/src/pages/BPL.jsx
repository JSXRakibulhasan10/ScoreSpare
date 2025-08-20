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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-4">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1">
            <img 
              src={fixture.homeTeam.logo} 
              alt={fixture.homeTeam.name}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="font-semibold text-gray-800 truncate">
              {fixture.homeTeam.name}
            </span>
          </div>

          <div className="px-4 text-gray-400 font-medium">VS</div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="font-semibold text-gray-800 truncate">
              {fixture.awayTeam.name}
            </span>
            <img 
              src={fixture.awayTeam.logo} 
              alt={fixture.awayTeam.name}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        {/* Match Details */}
        <div className="text-center bg-green-50 rounded-lg py-3">
          <p className="text-sm font-medium text-green-700">
            {formatDate(fixture.date)}
          </p>
          <p className="text-lg font-bold text-green-800">
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">POS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">TEAM</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">P</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">W</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">D</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">L</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">GF</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">GA</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">GD</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team.name} className={`
                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                hover:bg-green-50 transition-colors duration-200
                ${team.position <= 3 ? 'border-l-4 border-l-green-500' : ''}
              `}>
                <td className="px-4 py-3 text-center font-bold text-gray-800">
                  {team.position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={team.team.logo} 
                      alt={team.team.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <span className="font-semibold text-gray-800">
                      {team.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{team.matchesPlayed}</td>
                <td className="px-4 py-3 text-center text-gray-700">{team.won}</td>
                <td className="px-4 py-3 text-center text-gray-700">{team.drawn}</td>
                <td className="px-4 py-3 text-center text-gray-700">{team.lost}</td>
                <td className="px-4 py-3 text-center text-gray-700">{team.goalsFor}</td>
                <td className="px-4 py-3 text-center text-gray-700">{team.goalsAgainst}</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-800">
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-600 text-lg">
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
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading BPL {activeSection}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-red-800 font-bold text-lg mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchData(activeSection)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
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
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upcoming Fixtures</h2>
              <p className="text-gray-600">{data.count} upcoming matches</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.fixtures?.map((fixture) => (
                <BPLFixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </div>
        );

      case 'standings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">League Table</h2>
              <p className="text-gray-600">Current Bangladesh Premier League standings</p>
            </div>
            <BPLStandingsTable standings={data.standings || []} />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Recent Results</h2>
              <p className="text-gray-600">{data.count} recent matches</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">🇧🇩</span>
            <h1 className="text-5xl font-black text-gray-900">
              Bangladesh Premier League
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with Bangladesh's premier football competition
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => handleSectionChange(section.key)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${activeSection === section.key
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
              >
                <span className="text-lg">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BPL;