import { COMPETITION_START_YEARS } from "../utils/competitionStartYears.js";

export const getSeasons = async (req, res) => {
  try {
    const { competitionCode } = req.params;

    // Get start year based on competition
    const startYear = COMPETITION_START_YEARS[competitionCode] || 2000;
    const currentYear = new Date().getFullYear();

    // Generate descending seasons
    const seasons = [];
    for (let year = currentYear; year >= startYear; year--) {
      seasons.push(year);
    }

    res.json({ competition: competitionCode, seasons });
  } catch (error) {
    console.error("Error generating seasons:", error.message);
    res.status(500).json({ message: "Failed to generate seasons" });
  }
};
