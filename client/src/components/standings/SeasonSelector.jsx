import React from 'react'

const SeasonSelector = ({ selectedSeason, handleSeasonChange, AVAILABLE_SEASONS}) => {
  return (
    <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
              <label htmlFor="season" className="text-gray-700 font-semibold">
                Season:
              </label>
              <select
                id="season"
                value={selectedSeason}
                onChange={handleSeasonChange}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
              >
                {AVAILABLE_SEASONS.map((season) => (
                  <option key={season.value} value={season.value}>
                    {season.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
  )
}

export default SeasonSelector
