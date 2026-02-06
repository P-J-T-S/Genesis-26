import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map, List, Search, Filter, Download, AlertTriangle, Sparkles } from 'lucide-react';
import { recommendationsAPI } from '../services/api';
import {
  setWards,
  setFilter,
  resetFilters,
  selectFilteredWards,
  selectViewMode,
  setViewMode,
  selectFilters,
  selectCurrentMode,
  selectSelectedWard,
  setRecommendations,
  setAlerts,
  selectRecommendations,
  selectWard,
  selectWards
} from '../store/slices/waste/wasteSlice';
import { demoAPI, ZONES } from '../data/demoData';
import WardMap from '../components/waste/WardMap';
import WardCard from '../components/waste/WardCard';
import WardDetailModal from '../components/waste/WardDetailModal';
import ModeToggle from '../components/waste/ModeToggle';
import WardDecisionPanel from '../components/waste/WardDecisionPanel';
import { exportToCSV, getWPILevel } from '../utils/helpers';

const Wards = () => {
  const dispatch = useDispatch();
  const wards = useSelector(selectFilteredWards);
  const allWards = useSelector(selectWards);
  const viewMode = useSelector(selectViewMode);
  const filters = useSelector(selectFilters);
  const currentMode = useSelector(selectCurrentMode);
  const selectedWard = useSelector(selectSelectedWard);
  const recommendations = useSelector(selectRecommendations);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [signals, setSignals] = useState([]);
  const [activeSignalId, setActiveSignalId] = useState(null);
  const [highlightedWards, setHighlightedWards] = useState([]);

  useEffect(() => {
  loadWards();
}, [currentMode]);

useEffect(() => {
  if (selectedWard) {
    loadRecommendations(selectedWard.id);
  }
}, [selectedWard, currentMode]);

const loadRecommendations = async (zoneId) => {
  try {
    const res = await recommendationsAPI.getRecommendations(zoneId, currentMode);
    if (res.data && res.status === 200 && res.data.data && Array.isArray(res.data.data.recommendations)) {
      dispatch(setRecommendations(res.data.data.recommendations));
    } else {
      // fallback to demo
      const recsRes = await demoAPI.getRecommendations(currentMode);
      if (recsRes.success) dispatch(setRecommendations(recsRes.data));
    }
  } catch (error) {
    // fallback to demo
    const recsRes = await demoAPI.getRecommendations(currentMode);
    if (recsRes.success) dispatch(setRecommendations(recsRes.data));
  }
};




  useEffect(() => {
    loadWards();
  }, [currentMode]);

const loadWards = async () => {
  setLoading(true);
  try {
    const wardsRes = await demoAPI.getWards(currentMode);
    if (wardsRes.success) dispatch(setWards(wardsRes.data));
    // recommendations now handled separately
    const alertsRes = await demoAPI.getAlerts();
    if (alertsRes.success) {
      dispatch(setAlerts(alertsRes.data));
      setSignals(alertsRes.data);
    }
  } catch (error) {
    console.error('Error loading wards:', error);
  } finally {
    setLoading(false);
  }
};

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleExport = () => {
    const exportData = wards.map(ward => ({
      'Ward ID': ward.id,
      'Ward Name': ward.name,
      'Zone': ward.zone,
      'WPI': ward.wpi,
      'Pressure Level': ward.pressureLevel,
      'Population': ward.population,
      'Complaints': ward.complaints,
      'Last Collection': ward.lastCollection,
      'Next Scheduled': ward.nextScheduled
    }));
    exportToCSV(exportData, `wards-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const hasActiveFilters = filters.searchQuery ||
    filters.pressureLevel !== 'all' ||
    filters.zone !== 'all';

  const topPriorities = useMemo(() => {
    const sorted = [...allWards].sort((a, b) => b.wpi - a.wpi);
    return sorted.slice(0, 5);
  }, [allWards]);

  const handleSignalClick = (signal) => {
    if (activeSignalId === signal.id) {
      setActiveSignalId(null);
      setHighlightedWards([]);
      return;
    }
    setActiveSignalId(signal.id);
    setHighlightedWards(signal.affectedWards || []);
  };

  if (loading) {
    return (
      <div className="container-fluid py-6">
        <div className="skeleton h-10 w-64 mb-6"></div>
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 ">
            Ward Management
          </h1>
          <p className="text-secondary-600  mt-1">
            {wards.length} wards monitored
            {hasActiveFilters && ` (filtered from ${allWards.length} total)`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <ModeToggle />

          <div className="flex items-center gap-2 bg-secondary-100  rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode('map'))}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'map'
                ? 'bg-white  text-primary-600 shadow-sm'
                : 'text-secondary-600 '
                }`}
            >
              <Map className="w-4 h-4 inline mr-1" />
              Map
            </button>
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'list'
                ? 'bg-white  text-primary-600 shadow-sm'
                : 'text-secondary-600 '
                }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-secondary-900 ">
            Filters & Search
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-sm btn-secondary lg:hidden"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters || 'hidden lg:grid'}`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search wards..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Zone Filter */}
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="select"
          >
            <option value="all">All Zones</option>
            {Object.values(ZONES).map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>

          {/* Pressure Level Filter */}
          <select
            value={filters.pressureLevel}
            onChange={(e) => handleFilterChange('pressureLevel', e.target.value)}
            className="select"
          >
            <option value="all">All Pressure Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Normal</option>
          </select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <div className="card p-0 overflow-hidden min-h-[520px]">
              <WardMap
                wards={wards}
                currentMode={currentMode}
                highlightedWardIds={highlightedWards}
                selectedWardId={selectedWard?.id}
              />
            </div>
          </div>
          <div className="xl:col-span-4 space-y-4">
            <WardDecisionPanel
              ward={selectedWard}
              recommendations={recommendations}
              currentMode={currentMode}
            />

            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary-900 ">
                    Top Priority Zones
                  </p>
                  <p className="text-xs text-secondary-600 ">
                    Auto-ranked by urgency
                  </p>
                </div>
                <AlertTriangle className="w-4 h-4 text-warning-600" />
              </div>
              <div className="space-y-2">
                {topPriorities.map((ward) => {
                  const level = getWPILevel(ward.wpi, currentMode);
                  return (
                    <button
                      key={ward.id}
                      className="w-full text-left px-3 py-2 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50/40 transition-colors"
                      onClick={() => dispatch(selectWard(ward))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-secondary-900 ">
                            {ward.name}
                          </p>
                          <p className="text-xs text-secondary-600 ">
                            {ward.zone} zone
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary-900 ">
                            {ward.wpi}
                          </p>
                          <span className={`badge badge-${level.color}`}>
                            {level.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary-900 ">
                    Signal Context
                  </p>
                  <p className="text-xs text-secondary-600 ">
                    Alerts and events impacting zones
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <div className="space-y-2">
                {signals.length === 0 && (
                  <div className="text-sm text-secondary-600 ">
                    No active signals.
                  </div>
                )}
                {signals.map((signal) => (
                  <button
                    key={signal.id}
                    onClick={() => handleSignalClick(signal)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${activeSignalId === signal.id
                      ? 'border-primary-400 bg-primary-50/60'
                      : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-50/40'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-secondary-900 ">
                          {signal.title}
                        </p>
                        <p className="text-xs text-secondary-600 ">
                          {signal.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          Affects {signal.affectedWards?.length || 0} zones
                        </p>
                      </div>
                      <span
                        className={`badge ${signal.severity === 'critical'
                          ? 'badge-danger'
                          : signal.severity === 'warning'
                            ? 'badge-warning'
                            : 'badge-info'
                          }`}
                      >
                        {signal.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wards.length > 0 ? (
            wards.map(ward => (
              <WardCard key={ward.id} ward={ward} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <p className="text-secondary-600  text-lg">
                  No wards found matching your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary mt-4"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ward Detail Modal */}
      {viewMode === 'list' && selectedWard && <WardDetailModal />}
    </div>
  );
};

export default Wards;
