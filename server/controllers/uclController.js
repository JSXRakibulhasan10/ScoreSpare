import axios from 'axios';

// Create axios client for Football Data API
const footballDataClient = axios.create({
    baseURL: 'https://api.football-data.org/v4',
    headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
    }
});

class UCLController {
    // Get UCL upcoming fixtures
    async getUCLFixtures(req, res) {
        try {
            const { limit = 10, dateFrom, dateTo, stage } = req.query;

            const params = {
                status: 'SCHEDULED'
            };

            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;
            if (stage) params.stage = stage; // GROUP_STAGE, LAST_16, QUARTER_FINALS, SEMI_FINALS, FINAL

            const response = await footballDataClient.get('/competitions/CL/matches', {
                params
            });

            let fixtures = response.data.matches || [];

            // Apply limit
            if (limit && !isNaN(parseInt(limit))) {
                fixtures = fixtures.slice(0, parseInt(limit));
            }

            // Transform UCL specific data
            const transformedFixtures = fixtures.map(match => ({
                id: match.id,
                competition: {
                    id: match.competition.id,
                    name: match.competition.name,
                    code: match.competition.code,
                    emblem: match.competition.emblem
                },
                season: {
                    id: match.season.id,
                    startDate: match.season.startDate,
                    endDate: match.season.endDate,
                    currentMatchday: match.season.currentMatchday
                },
                matchday: match.matchday,
                stage: match.stage, // Important for UCL (Group Stage, Knockout, etc.)
                group: match.group, // Group A, B, C, etc.
                utcDate: match.utcDate,
                status: match.status,
                homeTeam: {
                    id: match.homeTeam.id,
                    name: match.homeTeam.name,
                    shortName: match.homeTeam.shortName,
                    tla: match.homeTeam.tla,
                    crest: match.homeTeam.crest
                },
                awayTeam: {
                    id: match.awayTeam.id,
                    name: match.awayTeam.name,
                    shortName: match.awayTeam.shortName,
                    tla: match.awayTeam.tla,
                    crest: match.awayTeam.crest
                },
                score: match.score,
                venue: match.venue
            }));

            res.json({
                competition: "UEFA Champions League",
                count: transformedFixtures.length,
                stage: response.data.filters?.stage || 'ALL',
                fixtures: transformedFixtures
            });

        } catch (error) {
            console.error('Error fetching UCL fixtures:', error.response?.data || error.message);
            
            if (error.response?.status === 403) {
                return res.status(403).json({
                    error: 'API Access Forbidden',
                    message: 'Check your Football Data API key or subscription plan'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch UCL fixtures'
            });
        }
    }

    // Get UCL standings/groups
    async getUCLStandings(req, res) {
        try {
            const response = await footballDataClient.get('/competitions/CL/standings');

            const standings = response.data.standings || [];

            // Group standings for UCL
            const transformedStandings = standings.map(group => ({
                stage: group.stage,
                type: group.type,
                group: group.group, // Group A, B, C, etc.
                table: group.table.map(team => ({
                    position: team.position,
                    team: {
                        id: team.team.id,
                        name: team.team.name,
                        shortName: team.team.shortName,
                        tla: team.team.tla,
                        crest: team.team.crest
                    },
                    playedGames: team.playedGames,
                    won: team.won,
                    draw: team.draw,
                    lost: team.lost,
                    points: team.points,
                    goalsFor: team.goalsFor,
                    goalsAgainst: team.goalsAgainst,
                    goalDifference: team.goalDifference,
                    form: team.form
                }))
            }));

            res.json({
                competition: "UEFA Champions League",
                season: response.data.season,
                standings: transformedStandings
            });

        } catch (error) {
            console.error('Error fetching UCL standings:', error.response?.data || error.message);
            
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch UCL standings'
            });
        }
    }

    // Get UCL live matches
    async getUCLLiveMatches(req, res) {
        try {
            const response = await footballDataClient.get('/competitions/CL/matches', {
                params: {
                    status: 'IN_PLAY'
                }
            });

            const liveMatches = response.data.matches || [];

            const transformedMatches = liveMatches.map(match => ({
                id: match.id,
                stage: match.stage,
                group: match.group,
                utcDate: match.utcDate,
                status: match.status,
                minute: match.minute,
                homeTeam: {
                    id: match.homeTeam.id,
                    name: match.homeTeam.name,
                    shortName: match.homeTeam.shortName,
                    crest: match.homeTeam.crest
                },
                awayTeam: {
                    id: match.awayTeam.id,
                    name: match.awayTeam.name,
                    shortName: match.awayTeam.shortName,
                    crest: match.awayTeam.crest
                },
                score: {
                    winner: match.score.winner,
                    duration: match.score.duration,
                    fullTime: match.score.fullTime,
                    halfTime: match.score.halfTime
                }
            }));

            res.json({
                competition: "UEFA Champions League",
                count: transformedMatches.length,
                liveMatches: transformedMatches
            });

        } catch (error) {
            console.error('Error fetching UCL live matches:', error.response?.data || error.message);
            
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch UCL live matches'
            });
        }
    }
}

export default new UCLController();