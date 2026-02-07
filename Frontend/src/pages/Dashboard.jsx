import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import {
  setWards,
  setPriorities,
  setRecommendations,
  setAlerts,
  setStats,
  selectWard,
  selectCurrentMode,
  selectWards,
  selectStats,
  selectActiveAlerts,
  selectLastUpdated,
  selectSelectedWard
} from '../store/slices/waste/wasteSlice';
import { feedAPI, zonesAPI, priorityAPI, recommendationsAPI } from '../services/api';
import AlertCard from '../components/waste/AlertCard';
import ModeToggle from '../components/waste/ModeToggle';
import LiveWastePressureMap from '../components/waste/LiveWastePressureMap';
import WardDecisionPanel from '../components/waste/WardDecisionPanel';
import { formatRelativeTime, getModeConfig, getWPIThresholds } from '../utils/helpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectCurrentMode);
  const wards = useSelector(selectWards);
  const stats = useSelector(selectStats);
  const alerts = useSelector(selectActiveAlerts);
  const lastUpdated = useSelector(selectLastUpdated);
  const selectedWard = useSelector(selectSelectedWard);
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
      const [wardsRes, prioritiesRes, recommendationsRes, feedRes] = await Promise.all([
        zonesAPI.getWards(currentMode),
        priorityAPI.getPriorities(currentMode),
        recommendationsAPI.getRecommendations('all'), // Replace 'all' with actual zoneId if needed
        feedAPI.getFeed(currentMode)
      ]);

      // Wards
      if (wardsRes?.data?.data) dispatch(setWards(wardsRes.data.data));
      // Priorities
      if (prioritiesRes?.data?.data) dispatch(setPriorities(prioritiesRes.data.data));
      // Recommendations
      if (recommendationsRes?.data?.data) dispatch(setRecommendations(recommendationsRes.data.data));
      // Alerts (from feed)
      if (feedRes?.data?.feed) {
        const alerts = feedRes.data.feed.filter(item => item.type === 'alert').map(item => ({ ...item.data, id: item.data._id || item.data.id }));
        dispatch(setAlerts(alerts));
      }
      // Stats (optional, if available from backend)
      // if (statsRes?.data?.data) dispatch(setStats(statsRes.data.data));
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

  const handleWardSelect = (ward) => {
    dispatch(selectWard(ward));
  };

  // Calculate summary stats
  const { high: highThreshold } = getWPIThresholds(currentMode);
  const highPriorityWards = wards.filter(w => w.wpi >= highThreshold).length;
  const avgWPI = wards.length > 0
    ? Math.round(wards.reduce((sum, w) => sum + w.wpi, 0) / wards.length)
    : 0;

  if (loading) {
    return (
      <div className="h-full flex flex-col py-4 space-y-4">
        <div className="skeleton h-16 w-full opacity-50 shrink-0"></div>
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          <div className="col-span-8 skeleton h-full"></div>
          <div className="col-span-4 space-y-4">
            <div className="skeleton h-1/3"></div>
            <div className="skeleton h-1/3"></div>
            <div className="skeleton h-1/3"></div>
          </div>
        </div>
        <div className="skeleton h-24 shrink-0"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 bg-secondary-50">

      {/* Header Section - Fixed Height */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 h-auto lg:h-16 shrink-0 mb-4 px-1">

        {/* Title Area */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-secondary-900">
            Decision Support Dashboard
          </h1>
          <p className="text-xs text-secondary-600">
            Real-time intelligence for BMC SWM operations
          </p>
        </div>

        {/* Mode & Controls - Stacked Right */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-secondary-200 shadow-sm">
          {/* Mode Select */}
          <div className="flex-shrink-0">
            <ModeToggle />
          </div>

          <div className="w-px h-8 bg-secondary-200 mx-2"></div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
              {lastUpdated && (
                <div className="text-[10px] font-medium text-secondary-500 uppercase tracking-wide">
                  Updated {formatRelativeTime(lastUpdated)}
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-secondary btn-sm h-9 w-9 p-0 rounded-full flex items-center justify-center hover:bg-secondary-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Map & Sidebar - Flexible Height */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">


        {/* Left Column: Map (75% Width) */}
        <div className="lg:col-span-9 h-full relative rounded-xl overflow-hidden border border-secondary-200 shadow-md bg-white">
          <LiveWastePressureMap
            wardsData={wards}
            currentMode={currentMode}
            selectedWardId={selectedWard?.id}
            onWardSelect={handleWardSelect}
          />
        </div>


        {/* Right Column: Ward Intel & Alerts (25% Width) */}
        <div className="lg:col-span-3 h-full flex flex-col gap-4 overflow-hidden">

          {/* 1. Ward Decision Panel */}
          <div className="shrink-0 max-h-[45%] overflow-y-auto pr-1 scrollbar-thin">
            {selectedWard ? (
              <WardDecisionPanel
                ward={selectedWard}
                currentMode={currentMode}
              />
            ) : (
              <div className="card bg-info-50 border-info-200 p-6 flex flex-col items-center text-center justify-center h-full border-dashed min-h-40">
                <div className="p-3 bg-info-100 rounded-full mb-3 text-info-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-info-900">No Zone Selected</h4>
                <p className="text-sm text-info-700 mt-1 max-w-50">
                  Click on any zone marker to view details.
                </p>
              </div>
            )}
          </div>

          {/* 2. Active Alerts */}
          <div className="flex-1 flex flex-col min-h-0 card bg-white border-secondary-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
              <h3 className="text-sm font-semibold text-secondary-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                Active Alerts
              </h3>
              <span className="badge badge-secondary text-xs">{alerts.length}</span>
            </div>
            <div className="p-2 overflow-y-auto flex-1 scrollbar-thin">
              {alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-secondary-400 text-sm italic p-4">
                  <CheckCircle2 className="w-6 h-6 mb-2 opacity-20" />
                  No active alerts
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Operational Summary - Fixed Height */}
      <div className="h-20 shrink-0 card bg-secondary-900 text-white border-secondary-800 flex items-center px-6 relative overflow-hidden shadow-lg mt-auto">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 h-full w-96 bg-linear-to-l from-white/10 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-8 w-full z-10">
          <div className="flex-shrink-0 border-r border-secondary-700 pr-6 mr-2">
            <h2 className="text-sm font-bold tracking-tight text-secondary-100 leading-tight">
              OPERATIONAL<br />SUMMARY
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-secondary-800 border border-secondary-700">
                <TrendingUp className="w-4 h-4 text-success-400" />
              </div>
              <div>
                <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-semibold">Collection Eff.</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-white">{stats.collectionEfficiency || 87}%</span>
                  <span className="text-[10px] text-success-400 font-medium">+2%</span>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-secondary-800 border border-secondary-700">
                <Clock className="w-4 h-4 text-info-400" />
              </div>
              <div>
                <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-semibold">Avg Response</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-white">{stats.avgResponseTime || 2.3}</span>
                  <span className="text-[10px] text-secondary-400">hours</span>
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-secondary-800 border border-secondary-700">
                <MapPin className="w-4 h-4 text-warning-400" />
              </div>
              <div>
                <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-semibold">Coverage</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-white">{wards.length}</span>
                  <span className="text-[10px] text-secondary-400">wards</span>
                </div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-secondary-800 border border-secondary-700">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-semibold">Resolved</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-white">{stats.resolvedToday || 67}</span>
                  <span className="text-[10px] text-secondary-400">today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
