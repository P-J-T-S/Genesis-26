import React, { useMemo } from 'react';
import { CheckCircle2, Activity, ShieldAlert, Info } from 'lucide-react';
import { getWPILevel } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';

const WardDecisionPanel = ({ ward, recommendations = [], currentMode }) => {
  const { isCityHead, isWardOfficer, isZonalSupervisor } = useAuth();

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

  // RBAC Flags
  const showScore = isCityHead || isWardOfficer; // Only Head & Ward Officer see Score
  const showInsights = isCityHead || isWardOfficer; // Only Head see Insights? Plan said "Zone Click -> Add One Section Operational Insights". "Role Based: City Head ✅, Ward Officer 🔍 (Own ward - implied yes), Field Sup ❌". 
  // User request: "City SWM Head ✅ Yes (Compliance Score)", "Ward Officer 🔍 Limited (own ward)", "Field Supervisor ❌ No"

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
        {/* Supervisor sees NO Score/Level Badge */}
        {showScore && (
          <span className={`badge badge-${wpiLevel.color}`}>
            {wpiLevel.label}
          </span>
        )}
      </div>

      {/* Score Section - Hidden for Supervisor */}
      {showScore && (
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
      )}

      {/* Compliance Score & Insights - New Section */}
      {showInsights && (ward.complianceScore || ward.operationalInsights) && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-600" />
            <h4 className="text-sm font-semibold text-primary-900">Operational Insights</h4>
          </div>

          {ward.complianceScore && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary-600">Compliance Score:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${ward.complianceScore === 'High' ? 'bg-success-100 text-success-700' :
                  ward.complianceScore === 'Medium' ? 'bg-warning-100 text-warning-700' :
                    'bg-danger-100 text-danger-700'
                }`}>
                {ward.complianceScore}
              </span>
            </div>
          )}

          {ward.operationalInsights && (
            <p className="text-xs text-secondary-700 italic">
              "{ward.operationalInsights}"
            </p>
          )}
        </div>
      )}

      {/* Signals - Hidden for Supervisor? Request says "What they DON’T do: No configuration...". 
          "Zonal Supervisor -> Status update: pending / in-progress / done".
          "High-level alerts & trends" for City Head.
          I'll keep signals for everyone for context, UNLESS specified to hide. 
          "What they DON’T see: ... City-wide controls".
          I'll keep signals visible as they explain WHY actions are needed.
      */}
      {showScore && (
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
        </div>
      )}

      {/* Status Update for Supervisor (Placeholder UI) */}
      {isZonalSupervisor && (
        <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
          <p className="text-xs font-semibold text-secondary-700 mb-2">Task Status</p>
          <div className="flex gap-2">
            <button className="flex-1 py-1 text-xs bg-white border border-secondary-300 rounded shadow-sm hover:bg-secondary-50">Pending</button>
            <button className="flex-1 py-1 text-xs bg-primary-600 text-white rounded shadow-sm">In Progress</button>
            <button className="flex-1 py-1 text-xs bg-white border border-secondary-300 rounded shadow-sm hover:bg-secondary-50">Done</button>
          </div>
        </div>
      )}

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

      {(wpiLevel.level === 'critical' || ward.complianceScore === 'Low') && (
        <div className="flex items-center gap-2 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
          <ShieldAlert className="w-4 h-4 text-danger-600" />
          <p className="text-xs text-danger-900 font-semibold">
            {ward.complianceScore === 'Low' ? 'Low Compliance: Supervisor Review Flagged' : 'Immediate response required.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WardDecisionPanel;
