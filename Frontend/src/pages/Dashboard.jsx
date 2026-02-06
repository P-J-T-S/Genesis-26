import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AlertTriangle,
  TrendingUp,
  Building2,
  Activity,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react';
import {
  setWards,
  setPriorities,
  setRecommendations,
  setAlerts,
  setStats,
  selectCurrentMode,
  selectWards,
  selectStats,
  selectActiveAlerts,
  selectLastUpdated
} from '../store/slices/waste/wasteSlice';
import { demoAPI } from '../data/demoData';
import StatCard from '../components/waste/StatCard';
import AlertCard from '../components/waste/AlertCard';
import ModeToggle from '../components/waste/ModeToggle';
import QuickActionCard from '../components/waste/QuickActionCard';
import { formatRelativeTime, getModeConfig, getWPIThresholds } from '../utils/helpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectCurrentMode);
  const wards = useSelector(selectWards);
  const stats = useSelector(selectStats);
  const alerts = useSelector(selectActiveAlerts);
  const lastUpdated = useSelector(selectLastUpdated);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const modeConfig = getModeConfig(currentMode);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, [currentMode]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [wardsRes, prioritiesRes, recommendationsRes, alertsRes, statsRes] =
        await Promise.all([
          demoAPI.getWards(currentMode),
          demoAPI.getPriorities(currentMode),
          demoAPI.getRecommendations(currentMode),
          demoAPI.getAlerts(),
          demoAPI.getStats()
        ]);

      if (wardsRes.success) dispatch(setWards(wardsRes.data));
      if (prioritiesRes.success) dispatch(setPriorities(prioritiesRes.data));
      if (recommendationsRes.success) dispatch(setRecommendations(recommendationsRes.data));
      if (alertsRes.success) dispatch(setAlerts(alertsRes.data));
      if (statsRes.success) dispatch(setStats(statsRes.data));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  // Calculate summary stats
  const { high: highThreshold } = getWPIThresholds(currentMode);
  const highPriorityWards = wards.filter(w => w.wpi >= highThreshold).length;
  const totalComplaints = wards.reduce((sum, w) => sum + (w.complaints || 0), 0);
  const avgWPI = wards.length > 0
    ? Math.round(wards.reduce((sum, w) => sum + w.wpi, 0) / wards.length)
    : 0;

  if (loading) {
    return (
      <div className="container-fluid py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-10 w-64"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card skeleton h-32"></div>
          ))}
        </div>
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Decision Support Dashboard
          </h1>
          <p className="text-secondary-800 mt-1 font-medium">
            Real-time waste management intelligence for BMC operations
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <ModeToggle />
        </div>
      </div>

      {/* Mode Indicator Banner */}
      <div className={`card ${modeConfig.bgClass} border ${modeConfig.borderClass}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{modeConfig.icon}</span>
          <div className="flex-1">
            <h3 className={`font-semibold ${modeConfig.textClass}`}>
              {modeConfig.name}
            </h3>
            <p className={`text-sm ${modeConfig.textClass} font-medium`}>
              {modeConfig.description}
            </p>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-secondary-800   font-medium">
              <Clock className="w-4 h-4" />
              <span>Updated {formatRelativeTime(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Wards"
          value={stats.totalWards || wards.length}
          icon={<MapPin className="w-6 h-6" />}
          trend="+0%"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="High Priority"
          value={highPriorityWards}
          subtitle={`${Math.round((highPriorityWards / wards.length) * 100)}% of total`}
          icon={<AlertTriangle className="w-6 h-6" />}
          trend="+12%"
          trendUp={true}
          color="danger"
        />
        <StatCard
          title="Active Complaints"
          value={totalComplaints}
          subtitle={`${stats.resolvedToday || 67} resolved today`}
          icon={<Building2 className="w-6 h-6" />}
          trend="-5%"
          trendUp={false}
          color="warning"
        />
        <StatCard
          title="Avg WPI"
          value={avgWPI}
          subtitle="Across all wards"
          icon={<Activity className="w-6 h-6" />}
          trend="+3%"
          trendUp={true}
          color="info"
        />
      </div>

      {/* Active Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-secondary-900 ">
            Active Alerts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {alerts.slice(0, 4).map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-secondary-900 ">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="View Ward Map"
            description="Geographic view of all wards"
            icon="🗺️"
            link="/wards"
            color="primary"
          />
          <QuickActionCard
            title="Priority List"
            description="Ranked by Waste Pressure Index"
            icon="📊"
            link="/priorities"
            color="warning"
          />
          <QuickActionCard
            title="Recommendations"
            description="Action items & resource allocation"
            icon="💡"
            link="/recommendations"
            color="success"
          />
          <QuickActionCard
            title="Generate Report"
            description="Export current status"
            icon="📄"
            color="secondary"
            action={() => alert('Report generation coming soon!')}
          />
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900  mb-4">
          Operational Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-secondary-600 ">
              Collection Efficiency
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-secondary-900 ">
                {stats.collectionEfficiency || 87}%
              </span>
              <span className="text-success-600 text-sm mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +2%
              </span>
            </div>
            <div className="w-full bg-secondary-200  rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.collectionEfficiency || 87}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-secondary-600 ">
              Avg Response Time
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-secondary-900 ">
                {stats.avgResponseTime || '2.3'}
              </span>
              <span className="text-sm text-secondary-600  mb-1">
                hours
              </span>
            </div>
            <p className="text-sm text-success-600">
              Within target SLA
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-secondary-600 ">
              Emergency Zones
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-secondary-900 ">
                {stats.emergencyZones || 1}
              </span>
              <span className="text-sm text-secondary-600  mb-1">
                active
              </span>
            </div>
            <p className="text-sm text-danger-600">
              Requires immediate attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
