import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const VALID_LEAGUE_CODES = ['PL', 'BL1', 'SA', 'FL1', 'PD']; // Top 5 leagues

export const getLeagueStandings = async (req, res) => {
  const { leagueCode } = req.params;
  const { season } = req.query;

  if (!VALID_LEAGUE_CODES.includes(leagueCode)) {
    return res.status(400).json({ error: "Invalid league code." });
  }

  try {
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueCode}/standings`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
        params: season ? { season } : {}, // If season is given, include it
      }
    );

    const standings = response.data.standings?.[0]?.table || [];

    res.status(200).json({
      competition: response.data.competition.name,
      season: response.data.season.startDate + " to " + response.data.season.endDate,
      standings,
    });
  } catch (error) {
    console.error("Error fetching standings:", error.message);
    res.status(500).json({ error: "Failed to fetch standings" });
  }
};
