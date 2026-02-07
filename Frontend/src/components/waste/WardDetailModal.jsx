import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  MapPin,
  Users,
  AlertCircle,
  Clock,
  TrendingUp,
  Truck,
  Calendar,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import {
  selectSelectedWard,
  clearSelectedWard,
  selectCurrentMode,
  selectRecommendations
} from '../../store/slices/waste/wasteSlice';
import { getWPILevel, formatNumber } from '../../utils/helpers';

const WardDetailModal = () => {
  const dispatch = useDispatch();
  const ward = useSelector(selectSelectedWard);
  const currentMode = useSelector(selectCurrentMode);
  const recommendations = useSelector(selectRecommendations);

  if (!ward) return null;

  const wardId = ward.id || ward.zone_id || ward._id;
  const wpiLevel = getWPILevel(ward.wpi, currentMode);

  const wardRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const recWardId = rec.wardId || rec.zone_id?.zone_id || rec.zone_id?._id || rec.zone_id;
      return recWardId === wardId;
    }).slice(0, 2);
  }, [recommendations, wardId]);

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
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {ward.name}
              </h2>
              <p className="text-secondary-600 mt-1">
                {ward.id} - {ward.zone} Zone
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
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
              <h3 className="text-lg font-semibold text-secondary-900">
                Waste Pressure Index
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-secondary-900">
                  {ward.wpi}
                </span>
                <span className={`badge badge-${wpiLevel.color}`}>
                  {wpiLevel.label}
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-secondary-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${wpiColorClass} transition-all duration-300`}
                style={{ width: `${ward.wpi}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-compact bg-secondary-50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-secondary-600">
                  Population
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {formatNumber(ward.population)}
              </p>
            </div>

            <div className="card-compact bg-secondary-50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-danger-600" />
                <span className="text-xs text-secondary-600">
                  Complaints
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {ward.complaints || 0}
              </p>
            </div>

            <div className="card-compact bg-secondary-50">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-success-600" />
                <span className="text-xs text-secondary-600">
                  Vehicles
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {ward.resources?.vehicles || 0}
              </p>
            </div>

            <div className="card-compact bg-secondary-50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-info-600" />
                <span className="text-xs text-secondary-600">
                  Personnel
                </span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {ward.resources?.personnel || 0}
              </p>
            </div>
          </div>

          {/* Collection Schedule */}
          <div className="card-compact bg-secondary-50">
            <h4 className="font-semibold text-secondary-900 mb-3">
              Collection Schedule
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">
                    Last Collection
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-900">
                  {ward.lastCollection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">
                    Next Scheduled
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-900">
                  {ward.nextScheduled}
                </span>
              </div>
            </div>
          </div>

          {/* Contributing Factors */}
          {ward.factors && (
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">
                Contributing Factors
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Complaints
                    </p>
                    <p className="text-sm text-secondary-600">
                      {ward.factors.complaints} active complaints
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Event Impact
                    </p>
                    <p className="text-sm text-secondary-600">
                      {ward.factors.eventImpact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Weather Risk
                    </p>
                    <p className="text-sm text-secondary-600">
                      {ward.factors.weatherRisk}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-success-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Historical Trend
                    </p>
                    <p className="text-sm text-secondary-600">
                      {ward.factors.historicalTrend}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decision Support */}
          <div>
            <h4 className="font-semibold text-secondary-900 mb-3">
              Decision Support
            </h4>
            <div className="space-y-4">
              <div className="card-compact bg-secondary-50">
                <p className="text-sm font-medium text-secondary-900 mb-2">
                  WPI signal breakdown
                </p>
                <div className="space-y-2">
                  {Array.isArray(ward.wpiBreakdown) && ward.wpiBreakdown.map((signal) => (
                    <div key={signal.key} className="flex items-center justify-between text-xs">
                      <span className="text-secondary-600">
                        {signal.label}
                      </span>
                      <span className="text-secondary-900 font-semibold">
                        +{signal.contribution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-compact bg-secondary-50">
                <p className="text-sm font-medium text-secondary-900 mb-2">
                  Recommended actions
                </p>
                <div className="space-y-2">
                  {(wardRecommendations.length > 0
                    ? wardRecommendations.flatMap((rec) => rec.actions).slice(0, 3)
                    : ['Increase pickup frequency', 'Deploy additional personnel', 'Monitor complaint spikes']
                  ).map((action, index) => (
                    <div key={`${action}-${index}`} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5" />
                      <p className="text-sm text-secondary-700">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {wpiLevel.level === 'critical' && (
                <div className="flex items-center gap-2 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
                  <ShieldAlert className="w-4 h-4 text-danger-600" />
                  <p className="text-xs text-danger-700">
                    Critical condition. Escalate to rapid response team.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="card-compact bg-secondary-50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-danger-600" />
              <h4 className="font-semibold text-secondary-900">
                Location
              </h4>
            </div>
            <p className="text-sm text-secondary-600">
              Lat: {ward.coordinates?.lat ? ward.coordinates.lat.toFixed(4) : 'N/A'},
              &nbsp;Lng: {ward.coordinates?.lng ? ward.coordinates.lng.toFixed(4) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary-50 border-t border-secondary-200 p-6">
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
