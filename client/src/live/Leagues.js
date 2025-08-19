export const leagues = [
    {
      id: "all",
      name: "All Leagues",
      endpoint: "/api/live-matches/scores",
      icon: "🌍",
      color: "from-blue-600 to-purple-600",
    },
    {
      id: "premier-league",
      name: "Premier League",
      endpoint: "/api/live-matches/premier-league",
      icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      color: "from-purple-600 to-purple-700",
    },
    {
      id: "la-liga",
      name: "La Liga",
      endpoint: "/api/live-matches/la-liga",
      icon: "🇪🇸",
      color: "from-red-500 to-yellow-500",
    },
    {
      id: "serie-a",
      name: "Serie A",
      endpoint: "/api/live-matches/serie-a",
      icon: "🇮🇹",
      color: "from-green-600 to-red-600",
    },
    {
      id: "bundesliga",
      name: "Bundesliga",
      endpoint: "/api/live-matches/bundesliga",
      icon: "🇩🇪",
      color: "from-red-600 to-yellow-500",
    },
    {
      id: "ligue-1",
      name: "Ligue 1",
      endpoint: "/api/live-matches/ligue-1",
      icon: "🇫🇷",
      color: "from-blue-600 to-red-500",
    },
    {
      id: "champions-league",
      name: "Champions League",
      endpoint: "/api/live-matches/champions-league",
      icon: "🏆",
      color: "from-blue-800 to-blue-900",
    },
  ];

  export const MATCH_STATUS_COLORS = {
  live: "bg-red-500 animate-pulse",
  in_play: "bg-red-500 animate-pulse",
  finished: "bg-gray-500",
  // ...other statuses
};