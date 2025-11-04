import React from 'react';
import { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  onAddClick: () => void;
}

const NavItem: React.FC<{
  label: string;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, onAddClick }) => {
  const HomeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const StatsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
      <div className="relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 shadow-top">
        <NavItem label="Home" icon={HomeIcon} isActive={activeScreen === 'home'} onClick={() => setActiveScreen('home')} />
        
        <div className="w-16 h-16 flex items-center justify-center">
            <button
                onClick={onAddClick}
                className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform -translate-y-4 hover:bg-blue-700 transition-transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>

        <NavItem label="Stats" icon={StatsIcon} isActive={activeScreen === 'stats'} onClick={() => setActiveScreen('stats')} />
      </div>
    </div>
  );
};

export default BottomNav;