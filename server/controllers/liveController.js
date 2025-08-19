// controllers/liveController.js
import axios from 'axios';

// Competition IDs for European top 5 leagues and UCL
const COMPETITION_IDS = {
  // Premier League (England)
  PREMIER_LEAGUE: 2, 
  // La Liga (Spain) 
  LA_LIGA: 8,
  // Serie A (Italy)
  SERIE_A: 23,
  // Bundesliga (Germany)
  BUNDESLIGA: 35,
  // Ligue 1 (France)
  LIGUE_1: 34,
  // UEFA Champions League
  CHAMPIONS_LEAGUE: 244
};

// Array of all supported competition IDs
const TOP_COMPETITIONS = Object.values(COMPETITION_IDS);

export const getLiveScores = async (req, res) => {
  try {
    // Get API credentials from environment
    const apiKey = process.env.LIVE_SCORES_API_KEY;
    const apiSecret = process.env.LIVE_SCORES_API_SECRET;

    // Validate API credentials
    if (!apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        message: 'API credentials missing. Please check your environment variables.'
      });
    }

    // Get competition parameter from query (optional)
    const { competition } = req.query;
    let competitionIds = [];
    
    if (competition) {
      if (competition === 'top5') {
        // Fetch only top 5 leagues
        competitionIds = [
          COMPETITION_IDS.PREMIER_LEAGUE,
          COMPETITION_IDS.LA_LIGA, 
          COMPETITION_IDS.SERIE_A,
          COMPETITION_IDS.BUNDESLIGA,
          COMPETITION_IDS.LIGUE_1
        ];
      } else if (competition === 'ucl') {
        // Fetch only Champions League
        competitionIds = [COMPETITION_IDS.CHAMPIONS_LEAGUE];
      } else if (competition === 'elite') {
        // Fetch top 5 leagues + Champions League
        competitionIds = TOP_COMPETITIONS;
      } else {
        // Custom competition ID provided
        const customId = parseInt(competition);
        if (!isNaN(customId)) {
          competitionIds = [customId];
        }
      }
    }

    // Build request URL and parameters
    const baseUrl = 'https://livescore-api.com/api-client/matches/live.json';
    const params = {
      key: apiKey,
      secret: apiSecret
    };

    // Add competition filter if specified
    if (competitionIds.length > 0) {
      params.competition_id = competitionIds.join(',');
    }
    
    console.log('Making request to Live Score API...');
    console.log(`URL: ${baseUrl}`);
    console.log(`Competition IDs: ${competitionIds.length > 0 ? competitionIds.join(',') : 'All competitions'}`);
    console.log(`Params: key=${apiKey.substring(0, 8)}..., secret=${apiSecret.substring(0, 8)}..., competition_id=${params.competition_id || 'none'}`);
    
    // Make API request
    const response = await axios.get(baseUrl, {
      params,
      timeout: 15000, // 15 second timeout
      headers: {
        'User-Agent': 'ScoreSpare-App/1.0',
        'Accept': 'application/json'
      }
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));

    // Check if we got a response
    if (!response.data) {
      return res.status(500).json({
        success: false,
        message: 'No data received from API'
      });
    }

    // Handle API error responses
    if (response.data.success === false) {
      return res.status(400).json({
        success: false,
        message: 'API returned error',
        error: response.data.error || 'Unknown API error'
      });
    }

    // Extract matches from response
    let matches = [];
    
    if (response.data.data && response.data.data.match) {
      const rawMatches = Array.isArray(response.data.data.match) 
        ? response.data.data.match 
        : [response.data.data.match];

      // Transform matches to our format based on Live Score API structure
      matches = rawMatches.map(match => {
        try {
          return {
            matchId: match?.id || null,
            fixtureId: match?.fixture_id || null,
            homeTeam: {
              id: match?.home?.id || null,
              name: match?.home?.name || 'Unknown Team',
              logo: match?.home?.logo || null,
              stadium: match?.home?.stadium || null,
              countryId: match?.home?.country_id || null
            },
            awayTeam: {
              id: match?.away?.id || null,
              name: match?.away?.name || 'Unknown Team', 
              logo: match?.away?.logo || null,
              stadium: match?.away?.stadium || null,
              countryId: match?.away?.country_id || null
            },
            score: {
              current: match?.scores?.score || '0 - 0',
              halfTime: match?.scores?.ht_score || '',
              fullTime: match?.scores?.ft_score || '',
              extraTime: match?.scores?.et_score || '',
              penalties: match?.scores?.ps_score || ''
            },
            outcomes: {
              halfTime: match?.outcomes?.half_time || null,
              fullTime: match?.outcomes?.full_time || null,
              extraTime: match?.outcomes?.extra_time || null,
              penaltyShootout: match?.outcomes?.penalty_shootout || null
            },
            matchStatus: match?.status || 'unknown',
            matchTime: match?.time || '',
            scheduledTime: match?.scheduled || null,
            competition: {
              id: match?.competition?.id || null,
              name: match?.competition?.name || 'Unknown Competition',
              tier: match?.competition?.tier || null,
              isLeague: match?.competition?.is_league || false,
              isCup: match?.competition?.is_cup || false,
              hasGroups: match?.competition?.has_groups || false,
              nationalTeamsOnly: match?.competition?.national_teams_only || false,
              active: match?.competition?.active || false
            },
            country: {
              id: match?.country?.id || null,
              name: match?.country?.name || null,
              flag: match?.country?.flag || null,
              uefaCode: match?.country?.uefa_code || null,
              fifaCode: match?.country?.fifa_code || null,
              isReal: match?.country?.is_real || false
            },
            venue: match?.location || null,
            lastUpdated: match?.last_changed || null,
            added: match?.added || null,
            federation: match?.federation || null,
            odds: {
              live: {
                home: match?.odds?.live?.['1'] || null,
                draw: match?.odds?.live?.['X'] || null,
                away: match?.odds?.live?.['2'] || null
              },
              pre: {
                home: match?.odds?.pre?.['1'] || null,
                draw: match?.odds?.pre?.['X'] || null,
                away: match?.odds?.pre?.['2'] || null
              }
            },
            urls: {
              events: match?.urls?.events || null,
              statistics: match?.urls?.statistics || null,
              lineups: match?.urls?.lineups || null,
              head2head: match?.urls?.head2head || null
            }
          };
        } catch (error) {
          console.error('Error processing match data:', error.message, match);
          return null;
        }
      }).filter(match => match !== null); // Remove any null matches from processing errors
    }

    // Group matches by competition for better organization
    const matchesByCompetition = matches.reduce((acc, match) => {
      const competitionName = match.competition.name;
      if (!acc[competitionName]) {
        acc[competitionName] = [];
      }
      acc[competitionName].push(match);
      return acc;
    }, {});

    // Send successful response
    res.json({
      success: true,
      totalMatches: matches.length,
      competitionsCount: Object.keys(matchesByCompetition).length,
      filter: {
        applied: competitionIds.length > 0,
        competitions: competitionIds.length > 0 ? competitionIds : 'all',
        type: competition || 'all'
      },
      matches: matches,
      matchesByCompetition: matchesByCompetition,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Live Score API Error:', error.message);
    
    // Handle different types of errors
    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to Live Score API. Please check your internet connection.'
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Request timeout. Live Score API is taking too long to respond.'
      });
    }
    
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      const errorData = error.response.data;
      
      return res.status(status).json({
        success: false,
        message: `Live Score API error (${status})`,
        error: errorData || error.message
      });
    }
    
    // Generic error fallback
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live matches',
      error: error.message
    });
  }
};

// Get all available competitions
export const getCompetitions = (req, res) => {
  res.json({
    success: true,
    competitions: {
      PREMIER_LEAGUE: { id: COMPETITION_IDS.PREMIER_LEAGUE, name: 'Premier League', country: 'England' },
      LA_LIGA: { id: COMPETITION_IDS.LA_LIGA, name: 'La Liga', country: 'Spain' },
      SERIE_A: { id: COMPETITION_IDS.SERIE_A, name: 'Serie A', country: 'Italy' },
      BUNDESLIGA: { id: COMPETITION_IDS.BUNDESLIGA, name: 'Bundesliga', country: 'Germany' },
      LIGUE_1: { id: COMPETITION_IDS.LIGUE_1, name: 'Ligue 1', country: 'France' },
      CHAMPIONS_LEAGUE: { id: COMPETITION_IDS.CHAMPIONS_LEAGUE, name: 'UEFA Champions League', country: 'Europe' }
    },
    usage: {
      all: 'No competition parameter - fetches all live matches',
      top5: '?competition=top5 - fetches only top 5 European leagues',
      ucl: '?competition=ucl - fetches only Champions League',
      elite: '?competition=elite - fetches top 5 leagues + Champions League',
      custom: '?competition=ID - fetches specific competition by ID'
    }
  });
};

// Get live scores for a specific competition
export const getLiveScoresByCompetition = async (req, res) => {
  try {
    const { competitionId } = req.params;
    
    // Validate competition ID
    if (!competitionId || isNaN(parseInt(competitionId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid competition ID is required'
      });
    }

    // Set the competition parameter in the request query
    req.query.competition = competitionId;
    
    // Call the main getLiveScores function
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get live scores by competition error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live scores for competition',
      error: error.message
    });
  }
};

// Get Premier League live scores
export const getPremierLeagueLiveScores = async (req, res) => {
  try {
    req.query.competition = COMPETITION_IDS.PREMIER_LEAGUE;
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get Premier League live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Premier League live scores',
      error: error.message
    });
  }
};

// Get La Liga live scores
export const getLaLigaLiveScores = async (req, res) => {
  try {
    req.query.competition = COMPETITION_IDS.LA_LIGA;
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get La Liga live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch La Liga live scores',
      error: error.message
    });
  }
};

// Get Serie A live scores
export const getSerieALiveScores = async (req, res) => {
  try {
    req.query.competition = COMPETITION_IDS.SERIE_A;
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get Serie A live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Serie A live scores',
      error: error.message
    });
  }
};

// Get Bundesliga live scores
export const getBundesligaLiveScores = async (req, res) => {
  try {
    req.query.competition = COMPETITION_IDS.BUNDESLIGA;
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get Bundesliga live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Bundesliga live scores',
      error: error.message
    });
  }
};

// Get Ligue 1 live scores
export const getLigue1LiveScores = async (req, res) => {
  try {
    req.query.competition = COMPETITION_IDS.LIGUE_1;
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get Ligue 1 live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Ligue 1 live scores',
      error: error.message
    });
  }
};

// Get top 5 leagues live scores (keeping for backward compatibility)
export const getTop5LiveScores = async (req, res) => {
  try {
    req.query.competition = 'top5';
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get top 5 live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top 5 leagues live scores',
      error: error.message
    });
  }
};

// Get live scores for Champions League only
export const getUCLLiveScores = async (req, res) => {
  try {
    // Set the competition parameter to ucl
    req.query.competition = 'ucl';
    
    // Call the main getLiveScores function
    return getLiveScores(req, res);
  } catch (error) {
    console.error('Get UCL live scores error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Champions League live scores',
      error: error.message
    });
  }
};

