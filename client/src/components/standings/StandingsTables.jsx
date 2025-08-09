// Separate StandingsTable component



const TABLE_THEMES = {
  purple: {
    header: 'bg-gradient-to-r from-purple-500 to-purple-600',
    champion: 'border-l-purple-500 bg-purple-50',
    europa: 'border-l-blue-500 bg-blue-50',
    relegation: 'border-l-red-500 bg-red-50'
  },
  orange: {
    header: 'bg-gradient-to-r from-orange-500 to-orange-600',
    champion: 'border-l-orange-500 bg-orange-50',
    europa: 'border-l-blue-500 bg-blue-50',
    relegation: 'border-l-red-500 bg-red-50'
  },
  blue: {
    header: 'bg-gradient-to-r from-blue-500 to-blue-600',
    champion: 'border-l-blue-500 bg-blue-50',
    europa: 'border-l-green-500 bg-green-50',
    relegation: 'border-l-red-500 bg-red-50'
  },
  red: {
    header: 'bg-gradient-to-r from-red-500 to-red-600',
    champion: 'border-l-red-500 bg-red-50',
    europa: 'border-l-blue-500 bg-blue-50',
    relegation: 'border-l-orange-500 bg-orange-50'
  },
  green: {
    header: 'bg-gradient-to-r from-green-500 to-green-600',
    champion: 'border-l-green-500 bg-green-50',
    europa: 'border-l-blue-500 bg-blue-50',
    relegation: 'border-l-red-500 bg-red-50'
  }
};

const StandingsTable = ({ standings, competition, season, theme }) => {
  const tableTheme = TABLE_THEMES[theme] || TABLE_THEMES.purple;

  // Define table headers
  const headers = [
    { key: 'position', label: 'Pos', align: 'left' },
    { key: 'team', label: 'Team', align: 'left' },
    { key: 'playedGames', label: 'P', align: 'center' },
    { key: 'won', label: 'W', align: 'center' },
    { key: 'draw', label: 'D', align: 'center' },
    { key: 'lost', label: 'L', align: 'center' },
    { key: 'goalDifference', label: 'GD', align: 'center' },
    { key: 'points', label: 'Pts', align: 'center' }
  ];

  // Function to determine row styling based on position
  const getRowStyling = (position, totalTeams) => {
    if (position <= 4) return `${tableTheme.champion} border-l-4`;
    if (position <= 6) return `${tableTheme.europa} border-l-4`;
    if (position > totalTeams - 3) return `${tableTheme.relegation} border-l-4`;
    return 'hover:bg-gray-50';
  };

  // Function to render cell content
  const renderCellContent = (team, header) => {
    switch (header.key) {
      case 'team':
        return team.team.name;
      case 'goalDifference':
        return team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference;
      default:
        return team[header.key];
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Table Header Info */}
      <div className={`${tableTheme.header} px-6 py-4 text-white`}>
        <h2 className="text-xl font-bold">{competition}</h2>
        <p className="text-white/90 text-sm">{season}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header) => (
                <th 
                  key={header.key}
                  className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    header.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standings.map((team) => (
              <tr 
                key={team.position}
                className={`transition-all duration-200 ${getRowStyling(team.position, standings.length)}`}
              >
                {headers.map((header) => (
                  <td 
                    key={header.key}
                    className={`px-4 py-4 whitespace-nowrap text-sm ${
                      header.key === 'position' || header.key === 'points' 
                        ? 'font-bold text-gray-900' 
                        : header.key === 'team'
                        ? 'font-medium text-gray-900'
                        : 'text-gray-600'
                    } ${header.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {renderCellContent(team, header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 border-l-4 ${tableTheme.champion.split(' ')[0]}`}></div>
            <span className="text-gray-600">Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 border-l-4 ${tableTheme.europa.split(' ')[0]}`}></div>
            <span className="text-gray-600">Europa League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 border-l-4 ${tableTheme.relegation.split(' ')[0]}`}></div>
            <span className="text-gray-600">Relegation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;