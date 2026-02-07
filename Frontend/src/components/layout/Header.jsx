import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import { mockUsers } from '../../data/demoData';

const Header = () => {
  const { logout, user, login } = useAuth();

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - can add breadcrumbs or page title here if needed */}
        <div className="flex items-center gap-4">
          {/* Empty for now, can be used for breadcrumbs */}
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-4">
          {/* Role Switcher (Demo Only) */}
          <div className="hidden lg:flex items-center gap-2 mr-4 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-200">
            <span className="text-xs font-semibold text-primary-700 uppercase">Demo Role:</span>
            <select
              className="text-sm bg-transparent border-none focus:ring-0 text-primary-900 font-medium cursor-pointer"
              value={user?.email || ''}
              onChange={(e) => {
                const email = e.target.value;
                if (email) login(email, 'password'); // Password ignored for mock
              }}
            >
              {mockUsers.map(u => (
                <option key={u.id} value={u.email}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          {/* Notifications - placeholder */}
          <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-secondary-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-secondary-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-700" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-secondary-900">
                {user?.email || 'Officer'}
              </div>
              <div className="text-xs text-secondary-600">{(user?.role || 'SWM Supervisor').replace('_', ' ')}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-secondary-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
