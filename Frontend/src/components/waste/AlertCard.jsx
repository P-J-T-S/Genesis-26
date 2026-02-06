import React from 'react';
import { X } from 'lucide-react';
import { getAlertSeverity, formatRelativeTime } from '../../utils/helpers';

const AlertCard = ({ alert, onDismiss }) => {
  const severity = getAlertSeverity(alert.severity);

  return (
    <div className={`card ${severity.bgClass} border ${severity.borderClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">
          {severity.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`font-semibold ${severity.textClass}`}>
                {alert.title}
              </h4>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mt-1">
                {alert.message}
              </p>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-secondary-600 dark:text-secondary-400">
            <span>{formatRelativeTime(alert.timestamp)}</span>
            {alert.affectedWards && alert.affectedWards.length > 0 && (
              <span>
                Affects: {alert.affectedWards.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
