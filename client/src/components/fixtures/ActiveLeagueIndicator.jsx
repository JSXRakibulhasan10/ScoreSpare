import React from 'react'

const ActiveLeagueIndicator = ({currentLeague}) => {
  return (
    <div className="text-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">
              Showing fixtures for: <span className="text-gray-900 font-bold">
                {currentLeague?.shortName}
              </span>
            </span>
          </div>
        </div>
  )
}

export default ActiveLeagueIndicator