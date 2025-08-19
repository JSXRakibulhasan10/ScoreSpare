import React from 'react'
import FixtureCard from './FixtureCard'

const FixtureHeaderGrid = ({currentLeague, fixturesData}) => {
  return (
    <div className="space-y-6">
              {/* Fixtures Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentLeague?.name} Fixtures
                </h2>
                <p className="text-gray-600">
                  {fixturesData.count} upcoming matches
                </p>
              </div>

              {/* Fixtures Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fixturesData.fixtures?.map((fixture) => (
                  <FixtureCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            </div>
  )
}

export default FixtureHeaderGrid

