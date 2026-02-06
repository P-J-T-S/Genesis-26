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
    primary: 'bg-primary-50 border-primary-200  text-primary-900 ',
    danger: 'bg-danger-50 border-danger-200  text-danger-900 ',
    warning: 'bg-warning-50 border-warning-200  text-warning-900 ',
    success: 'bg-success-50 border-success-200  text-success-900 ',
    info: 'bg-info-50 border-info-200  text-info-900 ',
  };

  return (
    <div className={`card ${colorClasses[color]} border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2">
            {title}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">
              {value}
            </p>
            {trend && (
              <span className={`flex items-center gap-1 text-sm mb-1 ${trendUp ? 'text-success-600' : 'text-danger-600'
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
            <p className="text-xs font-medium mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
