import React, { useState } from 'react';
import { LogOut, Users, Vote, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen = false }) => {
  const { user, userType, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Side - Mobile Toggle Button, Desktop Logo */}
          <div className="flex items-center">
            {/* Sidebar Toggle Button - Only for Admin Mobile */}
            {userType === 'admin' && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="sm:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-2"
                title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Desktop Logo and Title */}
            <div className="hidden sm:flex items-center space-x-2">
              <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-navy-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Pemilihan OSIS
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  SMAN 1 Bantarujeg
                </p>
              </div>
            </div>
          </div>

          {/* Center - Mobile Logo and Title */}
          <div className="flex items-center">
            {/* Mobile Logo and Title */}
            <div className="sm:hidden flex items-center space-x-2">
              <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-navy-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 text-center tracking-tight">
                  Pemilihan OSIS
                </h1>
                <p className="text-xs text-gray-600 text-center hidden">
                  SMAN 1 Bantarujeg
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - User Info and Logout */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {userType === 'admin' ? 'Admin' : 'Voter'}: {
                  userType === 'admin'
                    ? (user as any)?.username
                    : (user as any)?.nama
                }
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Right Side - Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            {/* Main Menu Button */}
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-3">
            <div className="space-y-3">
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-navy-50 to-navy-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Users className="h-4 w-4 text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                      {userType === 'admin' ? 'Administrator' : 'Pemilih'}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">
                      {userType === 'admin'
                        ? (user as any)?.username
                        : (user as any)?.nama
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {/* Sidebar Toggle Button - Only for Admin */}
                {userType === 'admin' && onToggleSidebar && (
                  <button
                    onClick={() => {
                      onToggleSidebar();
                      setIsMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-navy-600 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {sidebarOpen ? "Sembunyikan" : "Sidebar"}
                    </span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Keluar</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Sistem Voting</span>
                  <span>SMAN 1 Bantarujeg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;