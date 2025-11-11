import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LuLogOut } from 'react-icons/lu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-700 bg-gray-900 px-6">
      <div className="flex-1">
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">
          Welcome, {user?.name}
        </span>
        <button
          onClick={logout}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          title="Logout"
        >
          <LuLogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;