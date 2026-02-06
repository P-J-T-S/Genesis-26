import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import {
  setPriorities,
  setWards,
  selectWard,
  selectPriorities,
  selectCurrentMode,
  selectWards,
  selectSelectedWard
} from '../store/slices/waste/wasteSlice';
import { priorityAPI, zonesAPI } from '../services/api';
import { getWPILevel, formatNumber, exportToCSV } from '../utils/helpers';
import WardDetailModal from '../components/waste/WardDetailModal';

const Priorities = () => {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);
  const wards = useSelector(selectWards);
  const currentMode = useSelector(selectCurrentMode);
  const selectedWard = useSelector(selectSelectedWard);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('wpi'); // wpi, complaints, name
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    loadPriorities();
  }, [currentMode]);

  const loadPriorities = async () => {
    setLoading(true);
    try {
      const [prioritiesRes, wardsRes] = await Promise.all([
        priorityAPI.getPriorities(currentMode),
        zonesAPI.getWards(currentMode)
      ]);

      if (prioritiesRes.data && prioritiesRes.status === 200) dispatch(setPriorities(prioritiesRes.data.data));
      if (wardsRes.data && wardsRes.status === 200) dispatch(setWards(wardsRes.data.data));
    } catch (error) {
      console.error('Error loading priorities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWardDetails = (wardId) => {
    return wards.find(w => w.id === wardId);
  };

  const handleViewWard = (wardId) => {
    const ward = getWardDetails(wardId);
    if (ward) {
      dispatch(selectWard(ward));
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    const exportData = sortedPriorities.map(priority => {
      const ward = getWardDetails(priority.wardId);
      return {
        'Rank': priority.rank,
        'Ward ID': priority.wardId,
        'Ward Name': priority.wardName,
        'WPI': priority.wpi,
        'Urgency': priority.urgency,
        'Zone': ward?.zone || 'N/A',
        'Population': ward?.population || 'N/A',
        'Complaints': ward?.complaints || 0,
        'Last Collection': ward?.lastCollection || 'N/A'
      };
    });
    exportToCSV(exportData, `priorities-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Sort and filter priorities
  const sortedPriorities = [...priorities]
    .filter(p => {
      if (filterLevel === 'all') return true;
      const wpiLevel = getWPILevel(p.wpi, currentMode).level;
      return wpiLevel === filterLevel;
    })
    .sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'name':
          compareA = a.wardName.toLowerCase();
          compareB = b.wardName.toLowerCase();
          break;
        case 'complaints':
          const wardA = getWardDetails(a.wardId);
          const wardB = getWardDetails(b.wardId);
          compareA = wardA?.complaints || 0;
          compareB = wardB?.complaints || 0;
          break;
        case 'wpi':
        default:
          compareA = a.wpi;
          compareB = b.wpi;
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 inline ml-1" />
    );
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
            Priority Rankings
          </h1>
          <p className="text-secondary-600  mt-1">
            Wards ranked by Waste Pressure Index (WPI)
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-danger-50  border-danger-200 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-danger-600  font-medium">
                Critical Priority
              </p>
              <p className="text-3xl font-bold text-danger-700  mt-1">
                {priorities.filter(p => getWPILevel(p.wpi, currentMode).level === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-500" />
          </div>
        </div>

        <div className="card bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">
                High Priority
              </p>
              <p className="text-3xl font-bold text-orange-700 mt-1">
                {priorities.filter(p => getWPILevel(p.wpi, currentMode).level === 'high').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning-700 font-medium">
                Medium Priority
              </p>
              <p className="text-3xl font-bold text-warning-700 mt-1">
                {priorities.filter(p => getWPILevel(p.wpi, currentMode).level === 'medium').length}
              </p>
            </div>
            <Filter className="w-8 h-8 text-warning-500" />
          </div>
        </div>

        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success-600 font-medium">
                Normal Priority
              </p>
              <p className="text-3xl font-bold text-success-700 mt-1">
                {priorities.filter(p => getWPILevel(p.wpi, currentMode).level === 'low').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center text-white font-bold">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-secondary-700  ">
            Filter by level:
          </span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="select max-w-xs"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Normal</option>
          </select>
          {filterLevel !== 'all' && (
            <button
              onClick={() => setFilterLevel('all')}
              className="btn btn-sm btn-secondary"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Priority Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 ">
                  Rank
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-secondary-900  cursor-pointer hover:bg-secondary-100"
                  onClick={() => handleSort('name')}
                >
                  Ward {getSortIcon('name')}
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-secondary-900  cursor-pointer hover:bg-secondary-100"
                  onClick={() => handleSort('wpi')}
                >
                  WPI {getSortIcon('wpi')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 ">
                  Urgency
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-secondary-900  cursor-pointer hover:bg-secondary-100"
                  onClick={() => handleSort('complaints')}
                >
                  Complaints {getSortIcon('complaints')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 ">
                  Population
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-900 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {sortedPriorities.map((priority, index) => {
                const ward = getWardDetails(priority.wardId);
                const wpiLevel = getWPILevel(priority.wpi, currentMode);

                return (
                  <tr
                    key={priority.wardId}
                    className="hover:bg-secondary-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-secondary-900 ">
                          {index + 1}
                        </span>
                        {index === 0 && <span className="text-xl">🏆</span>}
                        {index === 1 && <span className="text-xl">🥈</span>}
                        {index === 2 && <span className="text-xl">🥉</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary-900 ">
                          {priority.wardName}
                        </p>
                        <p className="text-sm text-secondary-600 ">
                          {priority.wardId} • {ward?.zone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-secondary-900 ">
                          {priority.wpi}
                        </span>
                        <div
                          className="h-2 w-24 bg-secondary-200  rounded-full overflow-hidden"
                        >
                          <div
                            className={`h-full transition-all duration-300 ${wpiLevel.level === 'critical' ? 'bg-danger-500' :
                              wpiLevel.level === 'high' ? 'bg-orange-500' :
                                  wpiLevel.level === 'medium' ? 'bg-warning-500' :
                                    'bg-success-500'
                              }`}
                            style={{ width: `${priority.wpi}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${wpiLevel.color}`}>
                        {wpiLevel.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-secondary-900  font-medium">
                        {ward?.complaints || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-secondary-600 ">
                        {ward ? formatNumber(ward.population) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewWard(priority.wardId)}
                        className="btn btn-sm btn-secondary"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ward Detail Modal */}
      {selectedWard && <WardDetailModal />}
    </div>
  );
};

export default Priorities;
