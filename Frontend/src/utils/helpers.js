// Utility helper functions for BMC SWM Dashboard

export const ZONES = {
  SOUTH: 'South',
  NORTH: 'North',
  EAST: 'East',
  WEST: 'West',
  CENTRAL: 'Central',
  ISLAND_CITY: 'Island City',
};

/**
 * Format timestamp to readable format
 * @param {string|Date} timestamp
 * @param {boolean} includeTime
 * @returns {string}
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };

  return date.toLocaleDateString('en-IN', options);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} timestamp
 * @returns {string}
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatTimestamp(timestamp, false);
};

/**
 * Get WPI level classification
 * @param {number} wpi
 * @param {string} mode
 * @returns {object}
 */
export const getWPIThresholds = (mode = 'normal') => {
  const thresholds = {
    normal: { low: 30, medium: 55, high: 80 },
    event: { low: 25, medium: 50, high: 75 },
    emergency: { low: 20, medium: 45, high: 70 }
  };

  return thresholds[mode] || thresholds.normal;
};

export const getWPILevel = (wpi, mode = 'normal') => {
  const { low, medium, high } = getWPIThresholds(mode);

  if (wpi < low) return { level: 'low', label: 'Normal', color: 'success' };
  if (wpi < medium) return { level: 'medium', label: 'Medium', color: 'warning' };
  if (wpi < high) return { level: 'high', label: 'High', color: 'orange' };
  return { level: 'critical', label: 'Critical', color: 'danger' };
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/**
 * Calculate WPI based on explainable signal inputs
 * @param {object} signals
 * @returns {{ wpi: number, breakdown: Array }}
 */
export const calculateWPIFromSignals = (signals = {}) => {
  const {
    complaintIntensity = 0, // 0-100
    eventPresence = 'none', // none | low | medium | high | critical
    hotspotHistory = 'none', // none | seasonal | recurring | chronic
    weatherAlert = 'none', // none | low | medium | high | severe
    complaintSpike = false, // boolean flag
  } = signals;

  const weights = {
    complaintIntensity: 0.35,
    eventPresence: 0.2,
    hotspotHistory: 0.15,
    weatherAlert: 0.15,
    complaintSpike: 0.15,
  };

  const eventScores = { none: 0, low: 25, medium: 50, high: 75, critical: 100 };
  const hotspotScores = { none: 0, seasonal: 40, recurring: 70, chronic: 90 };
  const weatherScores = { none: 0, low: 25, medium: 55, high: 85, severe: 100 };

  const breakdown = [
    {
      key: 'complaintIntensity',
      label: 'Complaint intensity',
      score: clamp(complaintIntensity),
      weight: weights.complaintIntensity,
    },
    {
      key: 'eventPresence',
      label: 'Event presence',
      score: eventScores[eventPresence] ?? 0,
      weight: weights.eventPresence,
    },
    {
      key: 'hotspotHistory',
      label: 'Hotspot history',
      score: hotspotScores[hotspotHistory] ?? 0,
      weight: weights.hotspotHistory,
    },
    {
      key: 'weatherAlert',
      label: 'Weather or emergency alerts',
      score: weatherScores[weatherAlert] ?? 0,
      weight: weights.weatherAlert,
    },
    {
      key: 'complaintSpike',
      label: 'Complaint spike flag',
      score: complaintSpike ? 80 : 0,
      weight: weights.complaintSpike,
    },
  ].map((item) => ({
    ...item,
    contribution: Math.round(item.score * item.weight),
  }));

  const wpi = Math.min(
    100,
    Math.round(breakdown.reduce((sum, item) => sum + item.contribution, 0))
  );

  return { wpi, breakdown };
};

/**
 * Get priority urgency level
 * @param {string} pressureLevel
 * @returns {object}
 */
export const getUrgencyLevel = (pressureLevel) => {
  const levels = {
    low: { label: 'Routine', color: 'success', priority: 1 },
    medium: { label: 'Moderate', color: 'warning', priority: 2 },
    high: { label: 'High', color: 'orange', priority: 3 },
    critical: { label: 'Critical', color: 'danger', priority: 4 }
  };

  return levels[pressureLevel] || levels.low;
};

/**
 * Get mode configuration
 * @param {string} mode
 * @returns {object}
 */
export const getModeConfig = (mode) => {
  const configs = {
    normal: {
      name: 'Normal Operations',
      icon: '🟢',
      color: 'success',
      description: 'Standard daily waste collection and management',
      bgClass: 'bg-success-50',
      textClass: 'text-success-900',
      borderClass: 'border-success-200'
    },
    event: {
      name: 'Event Mode',
      icon: '🟡',
      color: 'warning',
      description: 'Enhanced operations for festivals and planned events',
      bgClass: 'bg-warning-50',
      textClass: 'text-warning-900',
      borderClass: 'border-warning-200'
    },
    emergency: {
      name: 'Emergency Mode',
      icon: '🔴',
      color: 'danger',
      description: 'Rapid response for critical situations',
      bgClass: 'bg-danger-50',
      textClass: 'text-danger-900',
      borderClass: 'border-danger-200'
    }
  };

  return configs[mode] || configs.normal;
};

/**
 * Calculate WPI based on factors (simplified calculation)
 * @param {object} factors
 * @returns {number}
 */
export const calculateWPI = (factors) => {
  const {
    complaints = 0,
    population = 0,
    lastCollectionHours = 0,
    eventImpact = 'none',
    weatherRisk = 'low'
  } = factors;

  let wpi = 0;

  // Complaints factor (0-30 points)
  wpi += Math.min(complaints * 1.5, 30);

  // Population factor (0-20 points)
  wpi += Math.min((population / 10000) * 2, 20);

  // Time since last collection (0-25 points)
  wpi += Math.min(lastCollectionHours * 2, 25);

  // Event impact (0-15 points)
  const eventPoints = { none: 0, low: 5, medium: 10, high: 15, critical: 15 };
  wpi += eventPoints[eventImpact] || 0;

  // Weather risk (0-10 points)
  const weatherPoints = { low: 0, medium: 5, high: 10 };
  wpi += weatherPoints[weatherRisk] || 0;

  return Math.min(Math.round(wpi), 100);
};

/**
 * Format number with commas
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return num.toLocaleString('en-IN');
};

/**
 * Get alert severity config
 * @param {string} severity
 * @returns {object}
 */
export const getAlertSeverity = (severity) => {
  const severities = {
    info: {
      color: 'info',
      icon: 'ℹ️',
      bgClass: 'bg-info-50',
      textClass: 'text-info-900',
      borderClass: 'border-info-200'
    },
    warning: {
      color: 'warning',
      icon: '⚠️',
      bgClass: 'bg-warning-50',
      textClass: 'text-warning-900',
      borderClass: 'border-warning-200'
    },
    critical: {
      color: 'danger',
      icon: '🚨',
      bgClass: 'bg-danger-50',
      textClass: 'text-danger-900',
      borderClass: 'border-danger-200'
    }
  };

  return severities[severity] || severities.info;
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate ward data
 * @param {object} ward
 * @returns {boolean}
 */
export const isValidWard = (ward) => {
  return ward &&
    ward.id &&
    ward.name &&
    typeof ward.wpi === 'number' &&
    ward.coordinates &&
    typeof ward.coordinates.lat === 'number' &&
    typeof ward.coordinates.lng === 'number';
};

/**
 * Sort wards by priority
 * @param {array} wards
 * @param {string} mode
 * @returns {array}
 */
export const sortWardsByPriority = (wards, mode = 'normal') => {
  return [...wards].sort((a, b) => {
    // First sort by WPI (descending)
    if (b.wpi !== a.wpi) return b.wpi - a.wpi;

    // Then by complaints (descending)
    return (b.complaints || 0) - (a.complaints || 0);
  });
};

/**
 * Filter wards by criteria
 * @param {array} wards
 * @param {object} filters
 * @returns {array}
 */
export const filterWards = (wards, filters) => {
  return wards.filter(ward => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        ward.name.toLowerCase().includes(query) ||
        ward.id.toLowerCase().includes(query) ||
        ward.zone.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Pressure level filter
    if (filters.pressureLevel && filters.pressureLevel !== 'all') {
      if (ward.pressureLevel !== filters.pressureLevel) return false;
    }

    // Zone filter
    if (filters.zone && filters.zone !== 'all') {
      if (ward.zone !== filters.zone) return false;
    }

    return true;
  });
};

/**
 * Get recommendation priority class
 * @param {string} priority
 * @returns {string}
 */
export const getRecommendationPriorityClass = (priority) => {
  const classes = {
    critical: 'border-l-4 border-danger-500 bg-danger-50',
    high: 'border-l-4 border-warning-600 bg-warning-50',
    medium: 'border-l-4 border-info-500 bg-info-50',
    low: 'border-l-4 border-success-500 bg-success-50'
  };

  return classes[priority] || classes.low;
};

/**
 * Calculate percentage
 * @param {number} value
 * @param {number} total
 * @returns {number}
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Debounce function
 * @param {function} func
 * @param {number} wait
 * @returns {function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone object
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if time is within range
 * @param {Date} time
 * @param {number} rangeHours
 * @returns {boolean}
 */
export const isWithinTimeRange = (time, rangeHours) => {
  const now = new Date();
  const diffMs = now - new Date(time);
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= rangeHours;
};

/**
 * Export data to CSV
 * @param {array} data
 * @param {string} filename
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header =>
        JSON.stringify(row[header] ?? '')
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Group array by key
 * @param {array} array
 * @param {string} key
 * @returns {object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};
