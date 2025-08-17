// controllers/liveController.js
import axios from 'axios';

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

    // Build request URL and parameters
    const baseUrl = 'https://livescore-api.com/api-client/matches/live.json';
    
    console.log('Making request to Live Score API...');
    console.log(`URL: ${baseUrl}?&key=${apiKey.substring(0, 8)}...&secret=${apiSecret.substring(0, 8)}...`);
    
    // Make API request
    const response = await axios.get(baseUrl, {
      params: {
        key: apiKey,
        secret: apiSecret
      },
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

    // Send successful response
    res.json({
      success: true,
      totalMatches: matches.length,
      matches: matches,
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