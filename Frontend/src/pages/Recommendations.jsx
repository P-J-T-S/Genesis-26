import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Users,
  Truck,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  setRecommendations,
  selectRecommendations,
  selectCurrentMode
} from '../store/slices/waste/wasteSlice';
import { demoAPI } from '../data/demoData';
import { getRecommendationPriorityClass } from '../utils/helpers';

const RecommendationCard = ({ recommendation, expanded, onToggle }) => {
  const priorityClass = getRecommendationPriorityClass(recommendation.priority);
  
  const priorityConfig = {
    critical: { icon: <AlertCircle className="w-5 h-5" />, label: 'Critical', color: 'text-danger-700' },
    high: { icon: <AlertCircle className="w-5 h-5" />, label: 'High Priority', color: 'text-warning-700' },
    medium: { icon: <Lightbulb className="w-5 h-5" />, label: 'Moderate', color: 'text-info-700' },
    low: { icon: <CheckCircle className="w-5 h-5" />, label: 'Routine', color: 'text-success-700' }
  };

  const config = priorityConfig[recommendation.priority] || priorityConfig.medium;

  return (
    <div className={`card ${priorityClass} transition-all duration-200`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={config.color}>
                {config.icon}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
                {config.label}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 ">
              {recommendation.title}
            </h3>
            <p className="text-sm text-secondary-700   mt-1">
              Ward: <span className="font-medium">{recommendation.wardName}</span> ({recommendation.wardId})
            </p>
          </div>
          <button
            onClick={onToggle}
            className="btn btn-sm btn-secondary"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Description */}
        <p className="text-secondary-700  ">
          {recommendation.description}
        </p>

        {/* Quick Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-secondary-600 ">
            <Clock className="w-4 h-4" />
            <span>{recommendation.timeframe}</span>
          </div>
          {recommendation.resources.vehicles > 0 && (
            <div className="flex items-center gap-2 text-secondary-600 ">
              <Truck className="w-4 h-4" />
              <span>{recommendation.resources.vehicles} vehicles</span>
            </div>
          )}
          {recommendation.resources.personnel > 0 && (
            <div className="flex items-center gap-2 text-secondary-600 ">
              <Users className="w-4 h-4" />
              <span>{recommendation.resources.personnel} personnel</span>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t border-secondary-200 animate-fade-in">
            {/* Action Items */}
            <div>
              <h4 className="font-semibold text-secondary-900  mb-2">
                Action Items
              </h4>
              <ul className="space-y-2">
                {recommendation.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-secondary-700  ">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Required */}
            {(recommendation.resources.vehicles > 0 || 
              recommendation.resources.personnel > 0 || 
              recommendation.resources.equipment?.length > 0) && (
              <div>
                <h4 className="font-semibold text-secondary-900  mb-2">
                  Resources Required
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recommendation.resources.vehicles > 0 && (
                    <div className="bg-secondary-50  rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-secondary-900 ">
                          Vehicles
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">
                        {recommendation.resources.vehicles}
                      </p>
                    </div>
                  )}
                  {recommendation.resources.personnel > 0 && (
                    <div className="bg-secondary-50  rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-secondary-900 ">
                          Personnel
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">
                        {recommendation.resources.personnel}
                      </p>
                    </div>
                  )}
                  {recommendation.resources.equipment?.length > 0 && (
                    <div className="bg-secondary-50  rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-secondary-900 ">
                          Equipment
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 ">
                        {recommendation.resources.equipment.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expected Impact */}
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <h4 className="font-semibold text-success-900 mb-1">
                Expected Impact
              </h4>
              <p className="text-sm text-success-700">
                {recommendation.estimatedImpact}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Recommendations = () => {
  const dispatch = useDispatch();
  const recommendations = useSelector(selectRecommendations);
  const currentMode = useSelector(selectCurrentMode);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    loadRecommendations();
  }, [currentMode]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await demoAPI.getRecommendations(currentMode);
      if (res.success) {
        dispatch(setRecommendations(res.data));
        // Auto-expand critical recommendations
        const criticalIds = res.data
          .filter(r => r.priority === 'critical')
          .map(r => r.id);
        setExpandedIds(new Set(criticalIds));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredRecommendations.map(r => r.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesType = filterType === 'all' || rec.type === filterType;
    const matchesPriority = filterPriority === 'all' || rec.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const hasActiveFilters = filterType !== 'all' || filterPriority !== 'all';

  if (loading) {
    return (
      <div className="container-fluid py-6">
        <div className="skeleton h-10 w-64 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 ">
            Action Recommendations
          </h1>
          <p className="text-secondary-600  mt-1">
            {filteredRecommendations.length} recommendations generated based on current conditions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={expandAll}
            className="btn btn-sm btn-secondary"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="btn btn-sm btn-secondary"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-danger-50  border-danger-200 ">
          <p className="text-sm text-danger-600  font-medium mb-1">
            Critical Actions
          </p>
          <p className="text-3xl font-bold text-danger-700 ">
            {recommendations.filter(r => r.priority === 'critical').length}
          </p>
        </div>

        <div className="card bg-warning-50 border-warning-200">
          <p className="text-sm text-warning-600 font-medium mb-1">
            High Priority
          </p>
          <p className="text-3xl font-bold text-warning-700">
            {recommendations.filter(r => r.priority === 'high').length}
          </p>
        </div>

        <div className="card bg-info-50 border-info-200">
          <p className="text-sm text-info-600 font-medium mb-1">
            Preventive
          </p>
          <p className="text-3xl font-bold text-info-700">
            {recommendations.filter(r => r.type === 'preventive').length}
          </p>
        </div>

        <div className="card bg-success-50 border-success-200">
          <p className="text-sm text-success-600 font-medium mb-1">
            Routine
          </p>
          <p className="text-3xl font-bold text-success-700">
            {recommendations.filter(r => r.type === 'routine').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary-500" />
            <span className="text-sm font-medium text-secondary-700  ">
              Filters:
            </span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select max-w-xs"
          >
            <option value="all">All Types</option>
            <option value="urgent">Urgent</option>
            <option value="preventive">Preventive</option>
            <option value="event">Event</option>
            <option value="routine">Routine</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="select max-w-xs"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilterType('all');
                setFilterPriority('all');
              }}
              className="btn btn-sm btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map(recommendation => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              expanded={expandedIds.has(recommendation.id)}
              onToggle={() => toggleExpanded(recommendation.id)}
            />
          ))
        ) : (
          <div className="card text-center py-12">
            <Lightbulb className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600  text-lg">
              No recommendations found matching your filters.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setFilterPriority('all');
              }}
              className="btn btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
