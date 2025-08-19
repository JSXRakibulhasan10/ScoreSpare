import React, { useState } from 'react'



const TeamLogo = ({ team, side }) => {
    const [imageError, setImageError] = useState(false);
    const fallbackColor = side === 'home' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600';
    
    if (!team?.logo || imageError) {
      return (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-white font-bold text-sm border-2 border-gray-100`}>
          {team?.name?.charAt(0)?.toUpperCase() || (side === 'home' ? 'H' : 'A')}
        </div>
      );
    }

    return (
      <img 
        src={team.logo} 
        alt={team.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-300 transition-colors"
        onError={() => setImageError(true)}
      />
    );
  };

export default TeamLogo
