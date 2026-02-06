import React from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, Users, AlertCircle, Clock } from 'lucide-react';
import { selectWard as selectWardAction } from '../../store/slices/waste/wasteSlice';
import { getWPILevel, formatNumber } from '../../utils/helpers';

const WardCard = ({ ward }) => {
  const dispatch = useDispatch();
  const wpiLevel = getWPILevel(ward.wpi);

  const handleViewDetails = () => {
    dispatch(selectWardAction(ward));
  };

  const wpiColorClass = {
    low: 'bg-success-500',
    medium: 'bg-warning-500',
    high: 'bg-orange-500',
    critical: 'bg-danger-500'
  }[wpiLevel.level];

  const borderColorClass = {
    low: 'border-success-200',
    medium: 'border-warning-200',
    high: 'border-orange-200',
    critical: 'border-danger-200'
  }[wpiLevel.level];

  return (
    <div 
      className={`card hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${borderColorClass}`}
      onClick={handleViewDetails}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50">
              {ward.name}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {ward.id} • {ward.zone}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">
              {ward.wpi}
            </div>
            <span className={`badge badge-${wpiLevel.color} text-xs`}>
              {wpiLevel.label}
            </span>
          </div>
        </div>

        {/* WPI Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-secondary-600 dark:text-secondary-400 mb-1">
            <span>Waste Pressure Index</span>
            <span>{ward.wpi}/100</span>
          </div>
          <div className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${wpiColorClass} transition-all duration-300`}
              style={{ width: `${ward.wpi}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary-500" />
            <div>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">Population</p>
              <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
                {formatNumber(ward.population)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-secondary-500" />
            <div>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">Complaints</p>
              <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
                {ward.complaints || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Collection Info */}
        <div className="flex items-center justify-between text-xs text-secondary-600 dark:text-secondary-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last: {ward.lastCollection}</span>
          </div>
          <div>
            Next: {ward.nextScheduled}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardCard;
