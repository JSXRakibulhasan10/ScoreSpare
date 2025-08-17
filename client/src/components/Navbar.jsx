// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// const navItems = [
//   { name: 'Home', path: '/' },
//   { name: 'Standings', path: '/standings' },
//   { name: 'Fixtures', path: '/fixtures' },
//   { name: 'Live Scores', path: '/live' },
//   { name: 'UCL', path: '/ucl' },
//   { name: 'BPL', path: '/bpl' },
// ];

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const closeMenu = () => setIsOpen(false);

//   return (
//     <nav className="bg-gray-900 text-white shadow-md fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="text-2xl font-bold tracking-tight">
//           <Link to="/" onClick={closeMenu}>ScoreSphere</Link>
//         </div>

//         {/* Desktop nav */}
//         <ul className="hidden md:flex space-x-6 text-sm font-medium">
//           {navItems.map(({ name, path }) => (
//             <li key={path}>
//               <Link
//                 to={path}
//                 className={`hover:text-yellow-400 transition-colors duration-200 ${
//                   location.pathname === path ? 'text-yellow-400' : ''
//                 }`}
//               >
//                 {name}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         {/* Mobile Hamburger */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu}>
//             {isOpen ? (
//               <XMarkIcon className="w-6 h-6" />
//             ) : (
//               <Bars3Icon className="w-6 h-6" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <ul className="md:hidden bg-gray-800 text-sm px-4 pb-4 space-y-2">
//           {navItems.map(({ name, path }) => (
//             <li key={path}>
//               <Link
//                 to={path}
//                 onClick={closeMenu}
//                 className={`block py-1 ${
//                   location.pathname === path ? 'text-yellow-400' : ''
//                 } hover:text-yellow-400`}
//               >
//                 {name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </nav>
//   );
// }















import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Standings', path: '/standings' },
  { name: 'Fixtures', path: '/fixtures' },
  { name: 'Live Scores', path: '/live' },
  { name: 'UCL', path: '/ucl', special: 'ucl' },
  { name: 'BPL', path: '/bpl', special: 'bpl' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight">
          <Link
            to="/"
            onClick={closeMenu}
            className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 hover:opacity-90 transition-opacity"
          >
            ScoreSphere
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {navItems.map(({ name, path, special }) => {
            const isActive = location.pathname === path;

            // Special styles for UCL and BPL
            let specialStyles = '';
            if (special === 'ucl') {
              specialStyles = `px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                hover:shadow-[0_0_10px_rgba(138,43,226,0.7)] text-white font-semibold`;
            }
            if (special === 'bpl') {
              specialStyles = `px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-red-500 
                hover:shadow-[0_0_10px_rgba(0,128,0,0.7)] text-white font-semibold`;
            }

            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`relative transition-all duration-200 ${
                    special
                      ? specialStyles
                      : isActive
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                  onClick={closeMenu}
                >
                  {name}
                  {!special && isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-yellow-300 transition-colors">
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
          isOpen ? 'max-h-96 py-2' : 'max-h-0'
        }`}
      >
        <ul className="space-y-2">
          {navItems.map(({ name, path, special }) => {
            const isActive = location.pathname === path;

            let specialStyles = '';
            if (special === 'ucl') {
              specialStyles = `px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 
                hover:shadow-[0_0_10px_rgba(138,43,226,0.7)] text-white font-semibold`;
            }
            if (special === 'bpl') {
              specialStyles = `px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-red-500 
                hover:shadow-[0_0_10px_rgba(0,128,0,0.7)] text-white font-semibold`;
            }

            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={closeMenu}
                  className={`block transition-colors duration-200 ${
                    special
                      ? specialStyles
                      : isActive
                      ? 'bg-yellow-400 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-300 px-2 py-2 rounded-lg'
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
