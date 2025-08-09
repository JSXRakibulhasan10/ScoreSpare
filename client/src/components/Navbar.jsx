import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Standings', path: '/standings' },
  { name: 'Fixtures', path: '/fixtures' },
  { name: 'Live Scores', path: '/live' },
  { name: 'UCL', path: '/ucl' },
  { name: 'BPL', path: '/bpl' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          <Link to="/" onClick={closeMenu}>ScoreSphere</Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {navItems.map(({ name, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:text-yellow-400 transition-colors duration-200 ${
                  location.pathname === path ? 'text-yellow-400' : ''
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="md:hidden bg-gray-800 text-sm px-4 pb-4 space-y-2">
          {navItems.map(({ name, path }) => (
            <li key={path}>
              <Link
                to={path}
                onClick={closeMenu}
                className={`block py-1 ${
                  location.pathname === path ? 'text-yellow-400' : ''
                } hover:text-yellow-400`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
