import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const QuickActionCard = ({ title, description, icon, link, action, color = 'primary' }) => {
  const navigate = useNavigate();

  const colorClasses = {
    primary: 'hover:border-primary-300 hover:shadow-primary-100',
    success: 'hover:border-success-300 hover:shadow-success-100',
    warning: 'hover:border-warning-300 hover:shadow-warning-100',
    danger: 'hover:border-danger-300 hover:shadow-danger-100',
    secondary: 'hover:border-secondary-300 hover:shadow-secondary-100',
  };

  const handleClick = () => {
    if (action) {
      action();
    } else if (link) {
      navigate(link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        card text-left w-full transition-all duration-200 cursor-pointer
        ${colorClasses[color]}
        hover:scale-105 hover:shadow-lg
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-3xl mb-3">{icon}</div>
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-1">
            {title}
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {description}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
};

export default QuickActionCard;
