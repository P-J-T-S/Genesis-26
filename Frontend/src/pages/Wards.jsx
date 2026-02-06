import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map, List, Search, Filter, Download } from 'lucide-react';
import {
  setWards,
  setFilter,
  resetFilters,
  selectFilteredWards,
  selectViewMode,
  setViewMode,
  selectFilters,
  selectCurrentMode,
  selectWard
} from '../store/slices/waste/wasteSlice';
import { demoAPI, ZONES } from '../data/demoData';
import WardMap from '../components/waste/WardMap';
import WardCard from '../components/waste/WardCard';
import WardDetailModal from '../components/waste/WardDetailModal';
import { exportToCSV } from '../utils/helpers';

const Wards = () => {
  const dispatch = useDispatch();
  const wards = useSelector(selectFilteredWards);
  const viewMode = useSelector(selectViewMode);
  const filters = useSelector(selectFilters);
  const currentMode = useSelector(selectCurrentMode);
  const selectedWard = useSelector(selectWard);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWards();
  }, [currentMode]);

  const loadWards = async () => {
    setLoading(true);
    try {
      const res = await demoAPI.getWards(currentMode);
      if (res.success) {
        dispatch(setWards(res.data));
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
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50">
            Ward Management
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            {wards.length} wards monitored
            {hasActiveFilters && ` (filtered from ${wards.length} total)`}
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
          
          <div className="flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode('map'))}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-secondary-700 text-primary-600 shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
            >
              <Map className="w-4 h-4 inline mr-1" />
              Map
            </button>
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-secondary-700 text-primary-600 shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-400'
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
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">
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
            <option value="low">Low</option>
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
        <div className="card p-0 overflow-hidden" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
          <WardMap wards={wards} />
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
                <p className="text-secondary-600 dark:text-secondary-400 text-lg">
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
      {selectedWard && <WardDetailModal />}
    </div>
  );
};

export default Wards;
