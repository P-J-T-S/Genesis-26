import React, { useMemo } from 'react';
import { CheckCircle2, Activity, ShieldAlert } from 'lucide-react';
import { getWPILevel } from '../../utils/helpers';

const WardDecisionPanel = ({ ward, recommendations = [], currentMode }) => {
  const wardRecommendations = useMemo(() => {
    if (!ward) return [];
    return recommendations.filter((rec) => rec.wardId === ward.id).slice(0, 2);
  }, [ward, recommendations]);

  if (!ward) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-secondary-900">
              Decision Panel
            </p>
            <p className="text-xs text-secondary-800 font-medium">
              Select a zone on the map to view actions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const wpiLevel = getWPILevel(ward.wpi, currentMode);
  const wpiColorClass = {
    low: 'bg-success-500',
    medium: 'bg-warning-500',
    high: 'bg-orange-500',
    critical: 'bg-danger-500'
  }[wpiLevel.level];

  const topSignals = (ward.wpiBreakdown || [])
    .slice()
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);

  const actionFallback = {
    critical: [
      'Dispatch extra collection vehicles within 1 hour',
      'Set up temporary pickup points at hotspots',
      'Deploy immediate response team for spillovers'
    ],
    high: [
      'Increase collection frequency for 6 hours',
      'Add one supplementary vehicle for peak period',
      'Monitor complaint clusters every 2 hours'
    ],
    medium: [
      'Maintain schedule with additional spot checks',
      'Coordinate with ward supervisors for overflow bins'
    ],
    low: [
      'Continue routine schedule and monitoring'
    ]
  };

  const actions = wardRecommendations.length > 0
    ? wardRecommendations.flatMap((rec) => rec.actions).slice(0, 3)
    : actionFallback[wpiLevel.level];

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-secondary-500">
            Decision Panel
          </p>
          <h3 className="text-lg font-semibold text-secondary-900">
            {ward.name}
          </h3>
          <p className="text-xs text-secondary-800 font-medium">
            {ward.zone} zone
          </p>
        </div>
        <span className={`badge badge-${wpiLevel.color}`}>
          {wpiLevel.label}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-secondary-900">
            Current status and WPI
          </p>
          <p className="text-2xl font-bold text-secondary-900">
            {ward.wpi}
          </p>
        </div>
        <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
          <div className={`h-full ${wpiColorClass}`} style={{ width: `${ward.wpi}%` }} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-secondary-900 mb-2">
          Why this zone is {wpiLevel.label.toLowerCase()}
        </p>
        <div className="space-y-2">
          {topSignals.map((signal) => (
            <div key={signal.key} className="flex items-center justify-between text-xs">
              <span className="text-secondary-800 font-medium">
                {signal.label}
              </span>
              <span className="text-secondary-900 font-semibold">
                +{signal.contribution}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-secondary-500 mt-2">
          Rule-based WPI from complaints, events, hotspots, and weather signals.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ward.signals?.hotspotHistory && ward.signals.hotspotHistory !== 'none' && (
          <span className="badge badge-warning">
            {{
              seasonal: 'Seasonal hotspot',
              recurring: 'Recurring hotspot',
              chronic: 'Chronic hotspot',
            }[ward.signals.hotspotHistory] || 'Hotspot'}
          </span>
        )}
        {ward.signals?.complaintSpike && (
          <span className="badge badge-danger">Complaint spike</span>
        )}
        {ward.signals?.eventPresence && ward.signals.eventPresence !== 'none' && (
          <span className="badge badge-info">Event pressure</span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-secondary-900 mb-2">
          Recommended operational actions
        </p>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div key={`${action}-${index}`} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5" />
              <p className="text-sm text-secondary-900">
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {wpiLevel.level === 'critical' && (
        <div className="flex items-center gap-2 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
          <ShieldAlert className="w-4 h-4 text-danger-600" />
          <p className="text-xs text-danger-900 font-semibold">
            Immediate response required. Escalate to zone supervisor.
          </p>
        </div>
      )}
    </div>
  );
};

export default WardDecisionPanel;
