// controllers/liveController.js
import axios from "axios";

// Configuration
const COMPETITION_IDS = {
  PREMIER_LEAGUE: 2,
  LA_LIGA: 8,
  SERIE_A: 23,
  BUNDESLIGA: 35,
  LIGUE_1: 34,
  CHAMPIONS_LEAGUE: 244,
};

const COMPETITION_GROUPS = {
  top5: [
    COMPETITION_IDS.PREMIER_LEAGUE,
    COMPETITION_IDS.LA_LIGA,
    COMPETITION_IDS.SERIE_A,
    COMPETITION_IDS.BUNDESLIGA,
    COMPETITION_IDS.LIGUE_1,
  ],
  ucl: [COMPETITION_IDS.CHAMPIONS_LEAGUE],
  elite: Object.values(COMPETITION_IDS),
};

// Utility Functions
const validateCredentials = (apiKey, apiSecret) => {
  if (!apiKey || !apiSecret) {
    throw new Error("API credentials missing. Please check your environment variables.");
  }
};

const parseCompetitionIds = (competition) => {
  if (!competition) return [];
  
  if (COMPETITION_GROUPS[competition]) {
    return COMPETITION_GROUPS[competition];
  }
  
  const customId = parseInt(competition);
  return !isNaN(customId) ? [customId] : [];
};

const transformMatch = (match) => {
  try {
    return {
      matchId: match?.id || null,
      fixtureId: match?.fixture_id || null,
      homeTeam: {
        id: match?.home?.id || null,
        name: match?.home?.name || "Unknown Team",
        logo: match?.home?.logo || null,
        stadium: match?.home?.stadium || null,
        countryId: match?.home?.country_id || null,
      },
      awayTeam: {
        id: match?.away?.id || null,
        name: match?.away?.name || "Unknown Team",
        logo: match?.away?.logo || null,
        stadium: match?.away?.stadium || null,
        countryId: match?.away?.country_id || null,
      },
      score: {
        current: match?.scores?.score || "0 - 0",
        halfTime: match?.scores?.ht_score || "",
        fullTime: match?.scores?.ft_score || "",
        extraTime: match?.scores?.et_score || "",
        penalties: match?.scores?.ps_score || "",
      },
      outcomes: {
        halfTime: match?.outcomes?.half_time || null,
        fullTime: match?.outcomes?.full_time || null,
        extraTime: match?.outcomes?.extra_time || null,
        penaltyShootout: match?.outcomes?.penalty_shootout || null,
      },
      matchStatus: match?.status || "unknown",
      matchTime: match?.time || "",
      scheduledTime: match?.scheduled || null,
      competition: {
        id: match?.competition?.id || null,
        name: match?.competition?.name || "Unknown Competition",
        tier: match?.competition?.tier || null,
        isLeague: match?.competition?.is_league || false,
        isCup: match?.competition?.is_cup || false,
        hasGroups: match?.competition?.has_groups || false,
        nationalTeamsOnly: match?.competition?.national_teams_only || false,
        active: match?.competition?.active || false,
      },
      country: {
        id: match?.country?.id || null,
        name: match?.country?.name || null,
        flag: match?.country?.flag || null,
        uefaCode: match?.country?.uefa_code || null,
        fifaCode: match?.country?.fifa_code || null,
        isReal: match?.country?.is_real || false,
      },
      venue: match?.location || null,
      lastUpdated: match?.last_changed || null,
      added: match?.added || null,
      federation: match?.federation || null,
      
      
    };
  } catch (error) {
    console.error("Error processing match data:", error.message, match);
    return null;
  }
};

const groupMatchesByCompetition = (matches) => {
  return matches.reduce((acc, match) => {
    const competitionName = match.competition.name;
    if (!acc[competitionName]) {
      acc[competitionName] = [];
    }
    acc[competitionName].push(match);
    return acc;
  }, {});
};

const handleApiError = (error, res) => {
  console.error("Live Score API Error:", error.message);

  if (error.code === "ENOTFOUND") {
    return res.status(503).json({
      success: false,
      message: "Unable to connect to Live Score API. Please check your internet connection.",
    });
  }

  if (error.code === "ECONNABORTED") {
    return res.status(408).json({
      success: false,
      message: "Request timeout. Live Score API is taking too long to respond.",
    });
  }

  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;
    return res.status(status).json({
      success: false,
      message: `Live Score API error (${status})`,
      error: errorData || error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to fetch live matches",
    error: error.message,
  });
};

// Core API Service
const fetchLiveScoresFromApi = async (competitionIds) => {
  const apiKey = process.env.LIVE_SCORES_API_KEY;
  const apiSecret = process.env.LIVE_SCORES_API_SECRET;
  
  validateCredentials(apiKey, apiSecret);

  const params = { key: apiKey, secret: apiSecret };
  if (competitionIds.length > 0) {
    params.competition_id = competitionIds.join(",");
  }

  const response = await axios.get("https://livescore-api.com/api-client/matches/live.json", {
    params,
    timeout: 15000,
    headers: {
      "User-Agent": "ScoreSpare-App/1.0",
      Accept: "application/json",
    },
  });

  if (!response.data) {
    throw new Error("No data received from API");
  }

  if (response.data.success === false) {
    throw new Error(response.data.error || "Unknown API error");
  }

  return response.data;
};

// Main Controller
export const getLiveScores = async (req, res) => {
  try {
    const { competition } = req.query;
    const competitionIds = parseCompetitionIds(competition);
    
    const apiData = await fetchLiveScoresFromApi(competitionIds);
    
    let matches = [];
    if (apiData.data?.match) {
      const rawMatches = Array.isArray(apiData.data.match) 
        ? apiData.data.match 
        : [apiData.data.match];
      
      matches = rawMatches
        .map(transformMatch)
        .filter(match => match !== null);
    }

    const matchesByCompetition = groupMatchesByCompetition(matches);

    res.json({
      success: true,
      totalMatches: matches.length,
      competitionsCount: Object.keys(matchesByCompetition).length,
      filter: {
        applied: competitionIds.length > 0,
        competitions: competitionIds.length > 0 ? competitionIds : "all",
        type: competition || "all",
      },
      matches,
      matchesByCompetition,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error.message.includes("credentials")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return handleApiError(error, res);
  }
};

// Generic competition handler
const createCompetitionHandler = (competitionKey) => async (req, res) => {
  try {
    req.query.competition = competitionKey;
    return getLiveScores(req, res);
  } catch (error) {
    console.error(`Get ${competitionKey} live scores error:`, error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${competitionKey} live scores`,
      error: error.message,
    });
  }
};

// Specific competition endpoints (generated dynamically)
export const getLiveScoresByCompetition = async (req, res) => {
  const { competitionId } = req.params;
  
  if (!competitionId || isNaN(parseInt(competitionId))) {
    return res.status(400).json({
      success: false,
      message: "Valid competition ID is required",
    });
  }
  
  req.query.competition = competitionId;
  return getLiveScores(req, res);
};

// League-specific handlers
export const getPremierLeagueLiveScores = createCompetitionHandler(COMPETITION_IDS.PREMIER_LEAGUE);
export const getLaLigaLiveScores = createCompetitionHandler(COMPETITION_IDS.LA_LIGA);
export const getSerieALiveScores = createCompetitionHandler(COMPETITION_IDS.SERIE_A);
export const getBundesligaLiveScores = createCompetitionHandler(COMPETITION_IDS.BUNDESLIGA);
export const getLigue1LiveScores = createCompetitionHandler(COMPETITION_IDS.LIGUE_1);
export const getTop5LiveScores = createCompetitionHandler("top5");
export const getUCLLiveScores = createCompetitionHandler("ucl");

// Competitions info endpoint
export const getCompetitions = (req, res) => {
  const competitions = {
    PREMIER_LEAGUE: { id: COMPETITION_IDS.PREMIER_LEAGUE, name: "Premier League", country: "England" },
    LA_LIGA: { id: COMPETITION_IDS.LA_LIGA, name: "La Liga", country: "Spain" },
    SERIE_A: { id: COMPETITION_IDS.SERIE_A, name: "Serie A", country: "Italy" },
    BUNDESLIGA: { id: COMPETITION_IDS.BUNDESLIGA, name: "Bundesliga", country: "Germany" },
    LIGUE_1: { id: COMPETITION_IDS.LIGUE_1, name: "Ligue 1", country: "France" },
    CHAMPIONS_LEAGUE: { id: COMPETITION_IDS.CHAMPIONS_LEAGUE, name: "UEFA Champions League", country: "Europe" },
  };

  const usage = {
    all: "No competition parameter - fetches all live matches",
    top5: "?competition=top5 - fetches only top 5 European leagues",
    ucl: "?competition=ucl - fetches only Champions League",
    elite: "?competition=elite - fetches top 5 leagues + Champions League",
    custom: "?competition=ID - fetches specific competition by ID",
  };

  res.json({ success: true, competitions, usage });
};