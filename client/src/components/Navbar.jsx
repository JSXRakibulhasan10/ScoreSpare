import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Standings', path: '/standings' },
  { name: 'Fixtures', path: '/fixtures' },
  { name: 'Live Scores', path: '/live' },
  { name: 'BPL', path: '/bpl', special: 'bpl' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-yellow-400 hover:text-yellow-300 transition-all duration-300 transform hover:scale-105"
          >
            ScoreSphere
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-2 text-sm font-medium">
          {navItems.map(({ name, path, special }) => {
            const isActive = location.pathname === path;

            if (special === 'bpl') {
              return (
                <li key={path} className="relative group">
                  <Link
                    to={path}
                    onClick={closeMenu}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-red-500 hover:from-green-400 hover:to-red-400 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,128,0,0.7)]"
                  >
                    {name}
                  </Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-red-400 transition-all duration-300 group-hover:w-full"></span>
                </li>
              );
            }

            // Regular nav items with underline hover
            return (
              <li key={path} className="relative group">
                <Link
                  to={path}
                  onClick={closeMenu}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-gray-300 hover:text-yellow-300 hover:bg-gray-700/30'
                  }`}
                >
                  {name}
                </Link>
                {!special && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="p-2 text-gray-300 hover:text-yellow-300 transition-colors duration-300 rounded-lg hover:bg-gray-700/50"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-850 text-sm px-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 py-3' : 'max-h-0'
        }`}
      >
        <ul className="space-y-2">
          {navItems.map(({ name, path, special }) => {
            const isActive = location.pathname === path;

            let gradientClasses = '';
            
            if (special === 'bpl') gradientClasses = 'bg-gradient-to-r from-green-500 to-red-500 hover:from-green-400 hover:to-red-400';

            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold ${gradientClasses} ${
                    !special && isActive
                      ? 'bg-yellow-400 text-gray-900'
                      : !special
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-yellow-300'
                      : ''
                  }`}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
