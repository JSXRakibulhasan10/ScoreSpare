import React from 'react'
import { RefreshCw, Wifi, WifiOff, Clock, MapPin, Trophy, Users, Activity, Zap, Filter, Globe } from 'lucide-react';

const Header = ({ lastUpdated,fetchMatches, refreshing }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Live Sports
                </h1>
                <p className="mt-1 text-gray-600">Real-time match scores and updates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="hidden sm:block text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  Updated: {lastUpdated}
                </div>
              )}
              <button
                onClick={() => fetchMatches(true)}
                disabled={refreshing}
                className={`inline-flex items-center px-6 py-3 rounded-xl border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${
                  refreshing ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

  )
}

export default Header
