import axios from 'axios';

// Configuration
const BPL_COMPETITION_ID = 432;
const BASE_URL = 'https://livescore-api.com/api-client';

// Create reusable axios client
const liveScoreClient = axios.create({
    baseURL: BASE_URL,
});

// Utility Functions
const validateCredentials = () => {
    const apiKey = process.env.LIVE_SCORES_API_KEY;
    const apiSecret = process.env.LIVE_SCORES_API_SECRET;
    
    if (!apiKey || !apiSecret) {
        throw new Error('API credentials missing');
    }
    
    return { apiKey, apiSecret };
};

const createBaseParams = () => {
    const { apiKey, apiSecret } = validateCredentials();
    return {
        competition_id: BPL_COMPETITION_ID,
        key: apiKey,
        secret: apiSecret
    };
};

const handleApiError = (error, res, operation) => {
    console.error(`Error ${operation}:`, error.response?.data || error.message);
    
    const statusMap = {
        401: { error: 'API Authentication Failed', message: 'Check your LiveScore API key and secret' },
        403: { error: 'API Access Forbidden', message: 'Your API subscription may not include this endpoint' }
    };
    
    const status = error.response?.status;
    if (statusMap[status]) {
        return res.status(status).json(statusMap[status]);
    }
    
    return res.status(500).json({
        error: 'Internal Server Error',
        message: `Failed to ${operation}`,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

// Generic API caller
const callApi = async (endpoint, additionalParams = {}) => {
    const params = { ...createBaseParams(), ...additionalParams };
    const response = await liveScoreClient.get(endpoint, { params });
    return response.data;
};

// Transform functions (only essential data)
const transformTeam = (team) => ({
    id: team?.id || team?.team_id,
    name: team?.name || team?.team_name,
    logo: team?.logo || team?.team_logo
});

const transformMatch = (match) => ({
    id: match.id,
    date: match.date,
    time: match.time,
    status: match.status,
    homeTeam: transformTeam(match.home_team || match.homeTeam),
    awayTeam: transformTeam(match.away_team || match.awayTeam),
    score: {
        home: match.home_score || match.homeScore || match.score?.home || 0,
        away: match.away_score || match.awayScore || match.score?.away || 0
    },
    venue: match.venue,
    round: match.round
});

const transformFixture = (match) => ({
    ...transformMatch(match),
    season: match.season
});

const transformLiveMatch = (match) => ({
    ...transformMatch(match),
    minute: match.minute || match.elapsed,
    events: match.events || []
});

const transformStanding = (team) => ({
    position: team.position,
    team: transformTeam(team),
    matchesPlayed: team.matches || team.played,
    won: team.won || team.wins,
    drawn: team.drawn || team.draws,
    lost: team.lost || team.losses,
    goalsFor: team.goals_for || team.goalsFor,
    goalsAgainst: team.goals_against || team.goalsAgainst,
    goalDifference: team.goal_difference || team.goalDifference,
    points: team.points,
    form: team.form
});

// Generic controller function
const createBPLHandler = (endpoint, dataKey, transformFn, responseName) => {
    return async (req, res) => {
        try {
            const additionalParams = {};
            
            // Handle common query parameters
            if (req.query.limit) additionalParams.limit = req.query.limit;
            if (req.query.date) additionalParams.date = req.query.date;
            if (req.query.from_date) additionalParams.from_date = req.query.from_date;
            if (req.query.to_date) additionalParams.to_date = req.query.to_date;
            
            const data = await callApi(endpoint, additionalParams);
            
            // Extract data from various possible response structures
            let items = data?.data?.[dataKey] || data?.[dataKey] || data || [];
            
            // Apply limit if specified and not handled by API
            const { limit } = req.query;
            if (limit && !isNaN(parseInt(limit))) {
                items = items.slice(0, parseInt(limit));
            }
            
            // Transform data
            const transformedItems = items.map(transformFn);
            
            res.json({
                competition: "Bangladesh Premier League",
                count: transformedItems.length,
                [responseName]: transformedItems
            });
            
        } catch (error) {
            return handleApiError(error, res, `fetch BPL ${responseName}`);
        }
    };
};

class BPLController {
    // Create all handlers using the generic function
    getBPLFixtures = createBPLHandler('/fixtures/matches.json', 'fixtures', transformFixture, 'fixtures');
    getBPLLiveMatches = createBPLHandler('/matches/live.json', 'matches', transformLiveMatch, 'liveMatches');
    getBPLHistory = createBPLHandler('/scores/history.json', 'matches', transformMatch, 'history');
    
    // Standings needs special handling due to different response structure
    async getBPLStandings(req, res) {
        try {
            const data = await callApi('/leagues/table.json');
            const standings = data?.data?.table || data?.table || data || [];
            
            const transformedStandings = standings.map(transformStanding);
            
            res.json({
                competition: "Bangladesh Premier League",
                standings: transformedStandings
            });
            
        } catch (error) {
            return handleApiError(error, res, 'fetch BPL standings');
        }
    }
}

export default new BPLController();