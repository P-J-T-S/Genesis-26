// Demo data for BMC Solid Waste Management Decision Support System
// This simulates API responses and will be easy to replace with actual backend integration

import { calculateWPIFromSignals, getWPILevel } from '../utils/helpers';

export const ZONES = {
  SOUTH: 'South',
  NORTH: 'North',
  EAST: 'East',
  WEST: 'West',
  CENTRAL: 'Central',
  ISLAND_CITY: 'Island City',
};

export const MODES = {
  NORMAL: 'normal',
  EVENT: 'event',
  EMERGENCY: 'emergency',
};

// Simulated ward data with WPI (Waste Pressure Index)
export const wardsData = [
  {
    id: 'W001',
    name: 'Colaba',
    zone: ZONES.SOUTH,
    coordinates: { lat: 18.9067, lng: 72.8147 },
    population: 65000,
    complaints: 12,
    lastCollection: '2 hours ago',
    nextScheduled: '4 hours',
    signals: {
      complaintIntensity: 62,
      eventPresence: 'high',
      hotspotHistory: 'recurring',
      weatherAlert: 'low',
      complaintSpike: true,
    },
    factors: {
      complaints: 12,
      eventImpact: 'High - Festival gathering',
      weatherRisk: 'Low',
      historicalTrend: 'Increasing',
    },
    resources: {
      vehicles: 3,
      personnel: 8,
    },
  },
  {
    id: 'W002',
    name: 'Bandra West',
    zone: ZONES.WEST,
    coordinates: { lat: 19.0596, lng: 72.8295 },
    population: 120000,
    complaints: 18,
    lastCollection: '1 hour ago',
    nextScheduled: '2 hours',
    signals: {
      complaintIntensity: 70,
      eventPresence: 'medium',
      hotspotHistory: 'seasonal',
      weatherAlert: 'medium',
      complaintSpike: false,
    },
    factors: {
      complaints: 18,
      eventImpact: 'High - Commercial area weekend',
      weatherRisk: 'Medium',
      historicalTrend: 'Stable',
    },
    resources: {
      vehicles: 5,
      personnel: 12,
    },
  },
  {
    id: 'W003',
    name: 'Andheri East',
    zone: ZONES.WEST,
    coordinates: { lat: 19.1136, lng: 72.8697 },
    population: 180000,
    complaints: 25,
    lastCollection: '30 mins ago',
    nextScheduled: '1 hour',
    signals: {
      complaintIntensity: 88,
      eventPresence: 'critical',
      hotspotHistory: 'chronic',
      weatherAlert: 'high',
      complaintSpike: true,
    },
    factors: {
      complaints: 25,
      eventImpact: 'Critical - Market day + Construction',
      weatherRisk: 'High - Rain expected',
      historicalTrend: 'Rapidly increasing',
    },
    resources: {
      vehicles: 4,
      personnel: 10,
    },
  },
  {
    id: 'W004',
    name: 'Dadar',
    zone: ZONES.CENTRAL,
    coordinates: { lat: 19.0178, lng: 72.8478 },
    population: 95000,
    complaints: 5,
    lastCollection: '3 hours ago',
    nextScheduled: '5 hours',
    signals: {
      complaintIntensity: 34,
      eventPresence: 'low',
      hotspotHistory: 'none',
      weatherAlert: 'low',
      complaintSpike: false,
    },
    factors: {
      complaints: 5,
      eventImpact: 'None',
      weatherRisk: 'Low',
      historicalTrend: 'Stable',
    },
    resources: {
      vehicles: 3,
      personnel: 7,
    },
  },
  {
    id: 'W005',
    name: 'Kurla',
    zone: ZONES.EAST,
    coordinates: { lat: 19.0728, lng: 72.8826 },
    population: 145000,
    complaints: 9,
    lastCollection: '2 hours ago',
    nextScheduled: '3 hours',
    signals: {
      complaintIntensity: 58,
      eventPresence: 'medium',
      hotspotHistory: 'recurring',
      weatherAlert: 'medium',
      complaintSpike: true,
    },
    factors: {
      complaints: 9,
      eventImpact: 'Medium - Local event',
      weatherRisk: 'Low',
      historicalTrend: 'Increasing',
    },
    resources: {
      vehicles: 4,
      personnel: 9,
    },
  },
  {
    id: 'W006',
    name: 'Borivali',
    zone: ZONES.NORTH,
    coordinates: { lat: 19.2304, lng: 72.8571 },
    population: 110000,
    complaints: 3,
    lastCollection: '4 hours ago',
    nextScheduled: '6 hours',
    signals: {
      complaintIntensity: 22,
      eventPresence: 'none',
      hotspotHistory: 'none',
      weatherAlert: 'low',
      complaintSpike: false,
    },
    factors: {
      complaints: 3,
      eventImpact: 'None',
      weatherRisk: 'Low',
      historicalTrend: 'Stable',
    },
    resources: {
      vehicles: 3,
      personnel: 6,
    },
  },
  {
    id: 'W007',
    name: 'Mulund',
    zone: ZONES.NORTH,
    coordinates: { lat: 19.1726, lng: 72.9565 },
    population: 88000,
    complaints: 7,
    lastCollection: '2 hours ago',
    nextScheduled: '4 hours',
    signals: {
      complaintIntensity: 46,
      eventPresence: 'low',
      hotspotHistory: 'seasonal',
      weatherAlert: 'low',
      complaintSpike: false,
    },
    factors: {
      complaints: 7,
      eventImpact: 'Low',
      weatherRisk: 'Low',
      historicalTrend: 'Stable',
    },
    resources: {
      vehicles: 2,
      personnel: 5,
    },
  },
  {
    id: 'W008',
    name: 'Worli',
    zone: ZONES.SOUTH,
    coordinates: { lat: 19.0176, lng: 72.8157 },
    population: 75000,
    complaints: 11,
    lastCollection: '1 hour ago',
    nextScheduled: '2 hours',
    signals: {
      complaintIntensity: 60,
      eventPresence: 'medium',
      hotspotHistory: 'recurring',
      weatherAlert: 'medium',
      complaintSpike: false,
    },
    factors: {
      complaints: 11,
      eventImpact: 'High - Business district',
      weatherRisk: 'Medium',
      historicalTrend: 'Increasing',
    },
    resources: {
      vehicles: 3,
      personnel: 8,
    },
  },
];

// Priority-sorted wards
const buildWardsWithWpi = (mode = MODES.NORMAL) =>
  wardsData.map((ward) => {
    const { wpi, breakdown } = calculateWPIFromSignals(ward.signals);
    const level = getWPILevel(wpi, mode);
    return {
      ...ward,
      wpi,
      wpiBreakdown: breakdown,
      pressureLevel: level.level,
    };
  });

const buildPriorities = (mode = MODES.NORMAL) => {
  const ranked = buildWardsWithWpi(mode)
    .sort((a, b) => b.wpi - a.wpi)
    .map((ward, index) => ({
      rank: index + 1,
      wardId: ward.id,
      wardName: ward.name,
      wpi: ward.wpi,
      urgency: getWPILevel(ward.wpi, mode).label,
    }));
  return ranked;
};

// Recommendations based on current mode and ward conditions
export const recommendationsData = [
  {
    id: 'R001',
    wardId: 'W003',
    wardName: 'Andheri East',
    type: 'urgent',
    priority: 'critical',
    title: 'Deploy Additional Resources Immediately',
    description: 'Market day combined with ongoing construction has created critical waste pressure.',
    actions: [
      'Deploy 2 additional collection vehicles within 1 hour',
      'Assign 6 extra personnel to hotspot areas',
      'Coordinate with traffic police for access clearance',
      'Set up temporary collection point near market area',
    ],
    estimatedImpact: 'Reduces WPI by 15-20 points',
    timeframe: 'Immediate (within 1 hour)',
    resources: {
      vehicles: 2,
      personnel: 6,
      equipment: ['Compactor', 'Hand tools'],
    },
  },
  {
    id: 'R002',
    wardId: 'W002',
    wardName: 'Bandra West',
    type: 'preventive',
    priority: 'high',
    title: 'Pre-emptive Collection Ahead of Weekend',
    description: 'Commercial area shows high weekend waste generation pattern.',
    actions: [
      'Advance collection schedule by 2 hours',
      'Deploy 1 additional vehicle for commercial zone',
      'Increase frequency in restaurant clusters',
      'Monitor till evening peak hours',
    ],
    estimatedImpact: 'Prevents overflow, maintains WPI below 70',
    timeframe: 'Within 2-3 hours',
    resources: {
      vehicles: 1,
      personnel: 3,
      equipment: ['Standard collection vehicles'],
    },
  },
  {
    id: 'R003',
    wardId: 'W001',
    wardName: 'Colaba',
    type: 'event',
    priority: 'high',
    title: 'Festival Management Protocol',
    description: 'Large gathering for festival expected to continue through evening.',
    actions: [
      'Position 1 dedicated vehicle for event duration',
      'Set up 3 temporary waste collection points',
      'Deploy roving cleanup crew (4 personnel)',
      'Coordinate with event organizers',
    ],
    estimatedImpact: 'Manages event waste, prevents public complaints',
    timeframe: 'Duration: 4-6 hours',
    resources: {
      vehicles: 1,
      personnel: 4,
      equipment: ['Mobile bins', 'Cleanup tools'],
    },
  },
  {
    id: 'R004',
    wardId: 'W008',
    wardName: 'Worli',
    type: 'routine',
    priority: 'medium',
    title: 'Enhanced Business District Coverage',
    description: 'Regular high-generation area requires increased attention.',
    actions: [
      'Maintain current enhanced schedule',
      'Focus on office building collection points',
      'Monitor complaint hotspots',
    ],
    estimatedImpact: 'Maintains service levels',
    timeframe: 'Ongoing',
    resources: {
      vehicles: 0,
      personnel: 0,
      equipment: [],
    },
  },
];

// Active alerts
export const alertsData = [
  {
    id: 'A001',
    type: 'weather',
    severity: 'warning',
    title: 'Heavy Rain Alert - East Zone',
    message: 'IMD predicts heavy rainfall in next 3-4 hours. May affect waste collection in Andheri East, Kurla.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    affectedWards: ['W003', 'W005'],
  },
  {
    id: 'A002',
    type: 'event',
    severity: 'info',
    title: 'Festival Gathering - Colaba',
    message: 'Large public gathering ongoing. Increased waste generation expected.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    affectedWards: ['W001'],
  },
  {
    id: 'A003',
    type: 'emergency',
    severity: 'critical',
    title: 'Construction Debris - Andheri',
    message: 'Unauthorized dumping of construction waste reported. Immediate action required.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    affectedWards: ['W003'],
  },
];

// Statistics
export const statsData = {
  totalWards: 8,
  highPriorityWards: 4,
  activeEvents: 2,
  emergencyZones: 1,
  totalComplaints: 90,
  resolvedToday: 67,
  avgResponseTime: '2.3 hours',
  collectionEfficiency: 87,
};

// Mode-specific configurations
export const modeConfigs = {
  [MODES.NORMAL]: {
    name: 'Normal Operations',
    description: 'Standard daily waste collection and management',
    color: 'green',
    thresholds: {
      low: 40,
      medium: 60,
      high: 75,
    },
  },
  [MODES.EVENT]: {
    name: 'Event Mode',
    description: 'Enhanced operations for festivals, events, and planned high-waste situations',
    color: 'yellow',
    thresholds: {
      low: 50,
      medium: 70,
      high: 85,
    },
  },
  [MODES.EMERGENCY]: {
    name: 'Emergency Mode',
    description: 'Rapid response for floods, outbreaks, demolitions, and critical situations',
    color: 'red',
    thresholds: {
      low: 60,
      medium: 80,
      high: 90,
    },
  },
};

// Simulated API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API simulation functions
export const demoAPI = {
  // Get all wards
  getWards: async (mode = MODES.NORMAL) => {
    await simulateDelay();
    return {
      success: true,
      data: buildWardsWithWpi(mode),
      timestamp: new Date().toISOString(),
    };
  },
  
  // Get ward by ID
  getWardById: async (wardId) => {
    await simulateDelay(300);
    const ward = buildWardsWithWpi().find(w => w.id === wardId);
    return {
      success: !!ward,
      data: ward,
      timestamp: new Date().toISOString(),
    };
  },
  
  // Get priorities
  getPriorities: async (mode = MODES.NORMAL) => {
    await simulateDelay();
    return {
      success: true,
      data: buildPriorities(mode),
      timestamp: new Date().toISOString(),
    };
  },
  
  // Get recommendations
  getRecommendations: async (mode = MODES.NORMAL) => {
    await simulateDelay();
    return {
      success: true,
      data: recommendationsData,
      timestamp: new Date().toISOString(),
    };
  },
  
  // Get alerts
  getAlerts: async () => {
    await simulateDelay(200);
    return {
      success: true,
      data: alertsData,
      timestamp: new Date().toISOString(),
    };
  },
  
  // Get statistics
  getStats: async () => {
    await simulateDelay(200);
    return {
      success: true,
      data: statsData,
      timestamp: new Date().toISOString(),
    };
  },
  
  // Refresh all data
  refreshAll: async (mode = MODES.NORMAL) => {
    await simulateDelay(800);
    return {
      success: true,
      data: {
        wards: buildWardsWithWpi(mode),
        priorities: buildPriorities(mode),
        recommendations: recommendationsData,
        alerts: alertsData,
        stats: statsData,
      },
      timestamp: new Date().toISOString(),
    };
  },
};

export default demoAPI;
