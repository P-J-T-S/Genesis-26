import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  MapPin,
  Users,
  AlertCircle,
  Clock,
  TrendingUp,
  Truck,
  Calendar
} from 'lucide-react';
import {
  selectSelectedWard,
  clearSelectedWard
} from '../../store/slices/waste/wasteSlice';
import { getWPILevel, formatNumber } from '../../utils/helpers';

const WardDetailModal = () => {
  const dispatch = useDispatch();
  const ward = useSelector(selectSelectedWard);

  if (!ward) return null;

  const wpiLevel = getWPILevel(ward.wpi);

  const handleClose = () => {
    dispatch(clearSelectedWard());
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const wpiColorClass = {
    low: 'bg-success-500',
    medium: 'bg-warning-500',
    high: 'bg-orange-500',
    critical: 'bg-danger-500'
  }[wpiLevel.level];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                {ward.name}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                {ward.id} • {ward.zone} Zone
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* WPI Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50">
                Waste Pressure Index
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-secondary-900 dark:text-secondary-50">
                  {ward.wpi}
                </span>
                <span className={`badge badge-${wpiLevel.color}`}>
                  {wpiLevel.label}
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${wpiColorClass} transition-all duration-300`}
                style={{ width: `${ward.wpi}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  Population
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                {formatNumber(ward.population)}
              </p>
            </div>

            <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-danger-600" />
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  Complaints
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                {ward.complaints || 0}
              </p>
            </div>

            <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-success-600" />
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  Vehicles
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                {ward.resources?.vehicles || 0}
              </p>
            </div>

            <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-info-600" />
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  Personnel
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900 dark:text-secondary-50">
                {ward.resources?.personnel || 0}
              </p>
            </div>
          </div>

          {/* Collection Schedule */}
          <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-3">
              Collection Schedule
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Last Collection
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                  {ward.lastCollection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Next Scheduled
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                  {ward.nextScheduled}
                </span>
              </div>
            </div>
          </div>

          {/* Contributing Factors */}
          {ward.factors && (
            <div>
              <h4 className="font-semibold text-secondary-900 dark:text-secondary-50 mb-3">
                Contributing Factors
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                      Complaints
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {ward.factors.complaints} active complaints
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                      Event Impact
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {ward.factors.eventImpact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                      Weather Risk
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {ward.factors.weatherRisk}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-success-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
                      Historical Trend
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {ward.factors.historicalTrend}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="card-compact bg-secondary-50 dark:bg-secondary-900">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-danger-600" />
              <h4 className="font-semibold text-secondary-900 dark:text-secondary-50">
                Location
              </h4>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Lat: {ward.coordinates?.lat ? ward.coordinates.lat.toFixed(4) : 'N/A'},
              &nbsp;Lng: {ward.coordinates?.lng ? ward.coordinates.lng.toFixed(4) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700 p-6">
          <button
            onClick={handleClose}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardDetailModal;
