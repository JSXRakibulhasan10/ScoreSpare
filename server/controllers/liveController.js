import { fetchFromAPI } from "../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

const LIVE_API_BASE = "https://live-score-api.com/api-client";

export const getLiveMatches = async (req, res) => {
  try {
    const apiKey = process.env.LIVE_SCORES_API_KEY;
    const apiSecret = process.env.LIVE_SCORES_API_SECRET;

    // Check if API credentials exist
    if (!apiKey || !apiSecret) {
      return res.status(500).json({ 
        message: "API credentials not configured properly" 
      });
    }

    // Live Score API endpoint for live matches
    const data = await fetchFromAPI(`${LIVE_API_BASE}/matches/scores/live.json`, {
      key: apiKey,
      secret: apiSecret,
    });

    // Log the raw response to debug
    console.log('Raw API Response:', JSON.stringify(data, null, 2));

    // Check if API response is successful
    if (!data || !data.success) {
      return res.status(500).json({ 
        message: "API request failed",
        error: data?.error || "Unknown error"
      });
    }

    // Check if matches exist - Live Score API structure
    if (!data.data || !data.data.match || !Array.isArray(data.data.match)) {
      return res.status(200).json({ 
        matches: [],
        message: "No live matches available" 
      });
    }

    // Map the fields for Live Score API structure
    const matches = data.data.match.map((match) => ({
      id: match.id,
      fixture_id: match.fixture_id,
      homeTeam: {
        id: match.home_id,
        name: match.home_name || "N/A",
        logo: match.home_image || "", // Live Score API might have images
      },
      awayTeam: {
        id: match.away_id,
        name: match.away_name || "N/A",
        logo: match.away_image || "", // Live Score API might have images
      },
      score: match.score || "0 - 0",
      status: match.status || "",
      time: match.time || "",
      minute: match.minute || "",
      scheduled: match.scheduled || "",
      location: match.location || "",
      competition: {
        id: match.competition_id,
        name: match.competition_name || "",
        country: match.country_name || ""
      },
      country: match.country_name || "",
      league: match.league_name || "",
      season: match.season || "",
      round: match.round || "",
      lastChanged: match.last_changed,
      added: match.added,
      stats: match.stats || null
    }));

    res.json({ 
      success: true,
      count: matches.length,
      matches 
    });

  } catch (error) {
    console.error("Error fetching live matches:", error);
    
    // More specific error handling
    if (error.response) {
      return res.status(error.response.status).json({
        message: "API request failed",
        error: error.response.data || error.message
      });
    }
    
    res.status(500).json({ 
      message: "Failed to fetch live matches",
      error: error.message 
    });
  }
};