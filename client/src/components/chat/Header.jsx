import React from 'react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">⚽</div>
        <div>
          <h1 className="text-xl font-bold">ScoreSpar Football Bot</h1>
          <p className="text-green-100 text-sm">Your expert football companion</p>
        </div>
      </div>
    </div>
  );
};

export default Header;