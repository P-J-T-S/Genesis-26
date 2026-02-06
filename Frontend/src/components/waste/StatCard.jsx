import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendUp, 
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400',
    danger: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-600 dark:text-danger-400',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-600 dark:text-warning-400',
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-600 dark:text-success-400',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800 text-info-600 dark:text-info-400',
  };

  return (
    <div className={`card ${colorClasses[color]} border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-2">
            {title}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">
              {value}
            </p>
            {trend && (
              <span className={`flex items-center gap-1 text-sm mb-1 ${
                trendUp ? 'text-success-600' : 'text-danger-600'
              }`}>
                {trendUp ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs opacity-70 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
