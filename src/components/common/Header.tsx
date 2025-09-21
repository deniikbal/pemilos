import React from 'react';
import { LogOut, Users, Vote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, userType, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Vote className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                Pemilihan Ketua OSIS
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">SMAN 1 Bantarujeg</p>
            </div>
          </div>

          {/* User Info & Logout Section */}
          <div className="flex items-center space-x-1 sm:space-x-3 ml-2">
            {/* User Info - Hidden on small screens, visible on medium+ */}
            <div className="hidden md:flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate max-w-32">
                {userType === 'admin' ? 'Admin' : 'Voter'}: {
                  userType === 'admin' 
                    ? (user as any)?.username 
                    : (user as any)?.nama
                }
              </span>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 text-red-600 hover:text-red-800 transition-colors p-1.5 sm:p-2 rounded-md hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;