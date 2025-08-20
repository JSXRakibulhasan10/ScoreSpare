import axios from 'axios';

// Create axios client outside the class
const apiClient = axios.create({
    baseURL: 'https://api.football-data.org/v4',
    headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
    }
});

class FixturesController {
    // Get upcoming fixtures for a specific competition
    async getUpcomingFixtures(req, res) {
        try {
            const { competitionId, matchday, dateFrom, dateTo, limit } = req.query;
            
            if (!competitionId) {
                return res.status(400).json({
                    error: 'Competition ID is required',
                    message: 'Please provide a competitionId query parameter'
                });
            }

            // Build query parameters
            const params = {
                status: 'SCHEDULED'
            };

            if (matchday) params.matchday = matchday;
            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;

            const response = await apiClient.get(`/competitions/${competitionId}/matches`, {
                params
            });

            let fixtures = response.data.matches || [];

            // Apply limit if specified
            if (limit && !isNaN(parseInt(limit))) {
                fixtures = fixtures.slice(0, parseInt(limit));
            }

            // Transform the data to match your app's structure
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
                stage: match.stage,
                group: match.group,
                utcDate: match.utcDate,
                status: match.status,
                minute: match.minute,
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
                
            }));

            res.json({
                count: transformedFixtures.length,
                competition: response.data.competition,
                filters: response.data.filters,
                fixtures: transformedFixtures
            });

        } catch (error) {
            console.error('Error fetching upcoming fixtures:', error.response?.data || error.message);
            
            if (error.response?.status === 403) {
                return res.status(403).json({
                    error: 'API Access Forbidden',
                    message: 'Check your API key or subscription plan'
                });
            }

            if (error.response?.status === 404) {
                return res.status(404).json({
                    error: 'Competition not found',
                    message: 'The specified competition ID does not exist'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch upcoming fixtures'
            });
        }
    }

    // Get upcoming fixtures for multiple competitions (Top 5 European leagues)
    async getUpcomingFixturesAllLeagues(req, res) {
        try {
            const { dateFrom, dateTo, limit = 20 } = req.query;
            
            // Top 5 European league IDs
            const competitionIds = {
                'Premier League': 'PL',
                'La Liga': 'PD', 
                'Serie A': 'SA',
                'Bundesliga': 'BL1',
                'Ligue 1': 'FL1'
            };

            const promises = Object.entries(competitionIds).map(async ([leagueName, code]) => {
                try {
                    const params = {
                        status: 'SCHEDULED'
                    };

                    if (dateFrom) params.dateFrom = dateFrom;
                    if (dateTo) params.dateTo = dateTo;

                    const response = await apiClient.get(`/competitions/${code}/matches`, {
                        params
                    });

                    return {
                        league: leagueName,
                        code: code,
                        fixtures: response.data.matches || []
                    };
                } catch (error) {
                    console.error(`Error fetching ${leagueName} fixtures:`, error.message);
                    return {
                        league: leagueName,
                        code: code,
                        fixtures: [],
                        error: error.message
                    };
                }
            });

            const results = await Promise.all(promises);
            
            // Flatten all fixtures and sort by date
            let allFixtures = [];
            results.forEach(result => {
                if (result.fixtures.length > 0) {
                    const leagueFixtures = result.fixtures.map(match => ({
                        ...match,
                        leagueName: result.league,
                        leagueCode: result.code
                    }));
                    allFixtures = allFixtures.concat(leagueFixtures);
                }
            });

            // Sort by UTC date
            allFixtures.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

            // Apply limit
            allFixtures = allFixtures.slice(0, parseInt(limit));

            // Transform the data
            const transformedFixtures = allFixtures.map(match => ({
                id: match.id,
                leagueName: match.leagueName,
                leagueCode: match.leagueCode,
                competition: {
                    id: match.competition.id,
                    name: match.competition.name,
                    code: match.competition.code,
                    emblem: match.competition.emblem
                },
                matchday: match.matchday,
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
                }
            }));

            res.json({
                count: transformedFixtures.length,
                totalAvailable: allFixtures.length,
                fixtures: transformedFixtures,
                leagues: results.map(r => ({
                    name: r.league,
                    code: r.code,
                    fixtureCount: r.fixtures.length,
                    hasError: !!r.error
                }))
            });

        } catch (error) {
            console.error('Error fetching all league fixtures:', error.message);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch upcoming fixtures for all leagues'
            });
        }
    }

    // Get upcoming fixtures for a specific team
    async getUpcomingFixturesByTeam(req, res) {
        try {
            const { teamId } = req.params;
            const { limit = 10 } = req.query;

            if (!teamId) {
                return res.status(400).json({
                    error: 'Team ID is required',
                    message: 'Please provide a teamId parameter'
                });
            }

            const response = await apiClient.get(`/teams/${teamId}/matches`, {
                params: {
                    status: 'SCHEDULED'
                }
            });

            let fixtures = response.data.matches || [];
            
            // Apply limit
            fixtures = fixtures.slice(0, parseInt(limit));

            const transformedFixtures = fixtures.map(match => ({
                id: match.id,
                competition: {
                    id: match.competition.id,
                    name: match.competition.name,
                    code: match.competition.code,
                    emblem: match.competition.emblem
                },
                matchday: match.matchday,
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
                }
            }));

            res.json({
                count: transformedFixtures.length,
                teamId: parseInt(teamId),
                fixtures: transformedFixtures
            });

        } catch (error) {
            console.error('Error fetching team fixtures:', error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                return res.status(404).json({
                    error: 'Team not found',
                    message: 'The specified team ID does not exist'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch team fixtures'
            });
        }
    }
}

export default new FixturesController();