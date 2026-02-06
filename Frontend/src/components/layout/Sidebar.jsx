import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  ListOrdered,
  Lightbulb,
  Home,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    // { path: '/home', icon: Home, label: 'Home' },
    // { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/wards', icon: Map, label: 'Ward Management' },
    { path: '/priorities', icon: ListOrdered, label: 'Priority Rankings' },
    { path: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  ];

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-secondary-700 hover:bg-secondary-100'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white 
          border-r border-secondary-200
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <h2 className="font-bold text-lg text-secondary-900">
              BMC SWM
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-secondary-600 hover:text-secondary-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-secondary-200">
            <div className="bg-secondary-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-secondary-900 mb-1">
                Decision Support System
              </p>
              <p className="text-xs text-secondary-600">
                Brihanmumbai Municipal Corporation
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
