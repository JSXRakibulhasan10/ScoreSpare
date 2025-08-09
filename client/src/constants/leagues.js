

export const LEAGUE_CODES = {
  PREMIER_LEAGUE: 'PL',
  LA_LIGA: 'PD', // Update with your actual codes
  SERIE_A: 'SA',
  BUNDESLIGA: 'BL1',
  LIGUE_1: 'FL1'
};

export const LEAGUES = [
  {
    code: "PL",
    name: "Premier League",
    shortName: "EPL",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    gradient: "from-purple-500 to-pink-600",
    tableTheme: "purple",
  },
  {
    code: "PD",
    name: "La Liga",
    shortName: "La Liga",
    country: "Spain",
    flag: "🇪🇸",
    gradient: "from-orange-500 to-red-600",
    tableTheme: "orange",
  },
  {
    code: "SA",
    name: "Serie A",
    shortName: "Serie A",
    country: "Italy",
    flag: "🇮🇹",
    gradient: "from-blue-500 to-cyan-600",
    tableTheme: "blue",
  },
  {
    code: "BL1",
    name: "Bundesliga",
    shortName: "Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
    gradient: "from-red-500 to-rose-600",
    tableTheme: "red",
  },
  {
    code: "FL1",
    name: "Ligue 1",
    shortName: "Ligue 1",
    country: "France",
    flag: "🇫🇷",
    gradient: "from-green-500 to-emerald-600",
    tableTheme: "green",
  },
];

// Available seasons for dropdown
export const AVAILABLE_SEASONS = [
    {value:'2025', label: '2025/26'},
  { value: '2024', label: '2024/25' },
  { value: '2023', label: '2023/24' },
];

// Default selections
export const DEFAULT_LEAGUE = 'PL';
export const DEFAULT_SEASON = '2025';