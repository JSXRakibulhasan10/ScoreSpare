import React from "react";

const LeagueSelector = ({
  leagueOptions,
  handleLeagueChange,
  selectedLeague,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {leagueOptions.map((league) => (
          <button
            key={league.code}
            onClick={() => handleLeagueChange(league.code)}
            className={`
                  group relative px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 
                  shadow-lg hover:shadow-2xl transform hover:-translate-y-4 hover:scale-105
                  bg-gradient-to-r ${league.gradient}
                  hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
                  ${
                    selectedLeague === league.code
                      ? "ring-4 ring-white ring-opacity-60 scale-105 -translate-y-2"
                      : "opacity-80 hover:opacity-100"
                  }
                `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{league.flag}</span>
              <div className="text-left">
                <div className="text-lg font-bold text-white drop-shadow-lg">
                  {league.shortName}
                </div>
                <div className="text-sm text-white/90 drop-shadow-lg">
                  {league.country}
                </div>
              </div>
            </div>
            {selectedLeague === league.code && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeagueSelector;
