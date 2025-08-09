import axios from 'axios';

// Create axios client for LiveScore API
const liveScoreClient = axios.create({
    baseURL: 'https://livescore-api.com/api-client',
    // Remove headers from here - we'll pass them as query params
});

class BPLController {
    // Get Bangladesh Premier League fixtures
    async getBPLFixtures(req, res) {
        try {
            const { limit = 10, date } = req.query;

            const params = {
                competition_id: 432, // BPL competition ID
                key: process.env.LIVE_SCORES_API_KEY,
                secret: process.env.LIVE_SCORES_API_SECRET
            };
            
            if (date) params.date = date; // Format: YYYY-MM-DD

            // Use the correct endpoint path
            const response = await liveScoreClient.get('/fixtures/matches.json', {
                params
            });

            // Handle potential different response structures
            let fixtures = response.data?.data?.fixtures || response.data?.fixtures || response.data || [];

            // Apply limit
            if (limit && !isNaN(parseInt(limit))) {
                fixtures = fixtures.slice(0, parseInt(limit));
            }

            // Transform BPL data to match your app structure
            const transformedFixtures = fixtures.map(match => ({
                id: match.id,
                competition: {
                    name: "Bangladesh Premier League",
                    country: "Bangladesh",
                    season: match.season
                },
                date: match.date,
                time: match.time,
                status: match.status,
                homeTeam: {
                    id: match.home_team?.id || match.homeTeam?.id,
                    name: match.home_team?.name || match.homeTeam?.name,
                    logo: match.home_team?.logo || match.homeTeam?.logo
                },
                awayTeam: {
                    id: match.away_team?.id || match.awayTeam?.id,
                    name: match.away_team?.name || match.awayTeam?.name,
                    logo: match.away_team?.logo || match.awayTeam?.logo
                },
                venue: match.venue,
                round: match.round
            }));

            res.json({
                competition: "Bangladesh Premier League",
                count: transformedFixtures.length,
                fixtures: transformedFixtures
            });

        } catch (error) {
            console.error('Error fetching BPL fixtures:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                return res.status(401).json({
                    error: 'API Authentication Failed',
                    message: 'Check your LiveScore API key and secret'
                });
            }

            if (error.response?.status === 403) {
                return res.status(403).json({
                    error: 'API Access Forbidden',
                    message: 'Your API subscription may not include this endpoint'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch BPL fixtures',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get BPL standings
    async getBPLStandings(req, res) {
        try {
            const params = {
                competition_id: 432, // BPL competition ID
                key: process.env.LIVE_SCORES_API_KEY,
                secret: process.env.LIVE_SCORES_API_SECRET
            };

            const response = await liveScoreClient.get('/leagues/table.json', {
                params
            });

            // Handle potential different response structures
            const standings = response.data?.data?.table || response.data?.table || response.data || [];

            const transformedStandings = standings.map(team => ({
                position: team.position,
                team: {
                    id: team.team_id || team.id,
                    name: team.name || team.team_name,
                    logo: team.logo || team.team_logo
                },
                matchesPlayed: team.matches || team.played,
                won: team.won || team.wins,
                drawn: team.drawn || team.draws,
                lost: team.lost || team.losses,
                goalsFor: team.goals_for || team.goalsFor,
                goalsAgainst: team.goals_against || team.goalsAgainst,
                goalDifference: team.goal_difference || team.goalDifference,
                points: team.points,
                form: team.form
            }));

            res.json({
                competition: "Bangladesh Premier League",
                standings: transformedStandings
            });

        } catch (error) {
            console.error('Error fetching BPL standings:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                return res.status(401).json({
                    error: 'API Authentication Failed',
                    message: 'Check your LiveScore API key and secret'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch BPL standings',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get BPL live matches
    async getBPLLiveMatches(req, res) {
        try {
            const params = {
                competition_id: 432, // BPL competition ID
                key: process.env.LIVE_SCORES_API_KEY,
                secret: process.env.LIVE_SCORES_API_SECRET
            };

            // Use the correct endpoint for live matches
            const response = await liveScoreClient.get('/matches/live.json', {
                params
            });

            // Handle potential different response structures
            const liveMatches = response.data?.data?.matches || response.data?.matches || response.data || [];

            const transformedMatches = liveMatches.map(match => ({
                id: match.id,
                date: match.date,
                time: match.time,
                status: match.status,
                minute: match.minute || match.elapsed,
                homeTeam: {
                    id: match.home_team?.id || match.homeTeam?.id,
                    name: match.home_team?.name || match.homeTeam?.name,
                    logo: match.home_team?.logo || match.homeTeam?.logo
                },
                awayTeam: {
                    id: match.away_team?.id || match.awayTeam?.id,
                    name: match.away_team?.name || match.awayTeam?.name,
                    logo: match.away_team?.logo || match.awayTeam?.logo
                },
                score: {
                    home: match.home_score || match.homeScore || match.score?.home,
                    away: match.away_score || match.awayScore || match.score?.away
                },
                events: match.events || [] // Goals, cards, etc.
            }));

            res.json({
                competition: "Bangladesh Premier League",
                count: transformedMatches.length,
                liveMatches: transformedMatches
            });

        } catch (error) {
            console.error('Error fetching BPL live matches:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                return res.status(401).json({
                    error: 'API Authentication Failed',
                    message: 'Check your LiveScore API key and secret'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch BPL live matches',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }


    // Get BPL match history
    async getBPLHistory(req, res) {
        try {
            const { from_date, to_date } = req.query;
            
            const params = {
                competition_id: 432, // BPL competition ID
                key: process.env.LIVE_SCORES_API_KEY,
                secret: process.env.LIVE_SCORES_API_SECRET
            };

            if (from_date) params.from_date = from_date;
            if (to_date) params.to_date = to_date;

            const response = await liveScoreClient.get('/scores/history.json', {
                params
            });

            // Handle potential different response structures
            const history = response.data?.data?.matches || response.data?.matches || response.data || [];

            const transformedHistory = history.map(match => ({
                id: match.id,
                date: match.date,
                time: match.time,
                status: match.status,
                homeTeam: {
                    id: match.home_team?.id || match.homeTeam?.id,
                    name: match.home_team?.name || match.homeTeam?.name,
                    logo: match.home_team?.logo || match.homeTeam?.logo
                },
                awayTeam: {
                    id: match.away_team?.id || match.awayTeam?.id,
                    name: match.away_team?.name || match.awayTeam?.name,
                    logo: match.away_team?.logo || match.awayTeam?.logo
                },
                score: {
                    home: match.home_score || match.homeScore || match.score?.home,
                    away: match.away_score || match.awayScore || match.score?.away
                },
                venue: match.venue,
                round: match.round
            }));

            res.json({
                competition: "Bangladesh Premier League",
                count: transformedHistory.length,
                history: transformedHistory
            });

        } catch (error) {
            console.error('Error fetching BPL history:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                return res.status(401).json({
                    error: 'API Authentication Failed',
                    message: 'Check your LiveScore API key and secret'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch BPL history',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new BPLController();