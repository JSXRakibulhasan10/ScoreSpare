import React from 'react'

const StatusBar = ({liveMatches, finishedMatches, allMatches}) => {
  return (
   <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      {liveMatches.length} live matches
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {finishedMatches.length} finished matches
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {allMatches.length} total matches
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Auto-refresh every 60s
                </div>
              </div>
            </div>
  )
}

export default StatusBar