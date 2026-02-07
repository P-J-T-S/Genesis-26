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
  { id: 'W001', name: 'A', zone: ZONES.SOUTH, kmlTarget: 'A', coordinates: { lat: 18.9129625, lng: 72.8294731 }, population: 185000, complaints: 15, wpi: 45, lastCollection: '2 hours ago', nextScheduled: '4 hours', complianceScore: 'High', operationalInsights: 'Historic district, highly regular collection.', resources: { vehicles: 5, personnel: 12 }, signals: { complaintIntensity: 30, eventPresence: 'low', hotspotHistory: 'none' } },
  { id: 'W002', name: 'B', zone: ZONES.SOUTH, kmlTarget: 'B', coordinates: { lat: 18.9634234, lng: 72.8445646 }, population: 140000, complaints: 8, wpi: 35, lastCollection: '1 hour ago', nextScheduled: '3 hours', complianceScore: 'High', operationalInsights: 'Efficient routing in narrow lanes.', resources: { vehicles: 4, personnel: 10 }, signals: { complaintIntensity: 25, eventPresence: 'none', hotspotHistory: 'none' } },
  { id: 'W003', name: 'C', zone: ZONES.SOUTH, kmlTarget: 'C', coordinates: { lat: 18.9617446, lng: 72.8319769 }, population: 160000, complaints: 22, wpi: 75, lastCollection: '30 mins ago', nextScheduled: '2 hours', complianceScore: 'Medium', operationalInsights: 'Market crowd impacting schedule.', resources: { vehicles: 6, personnel: 15 }, signals: { complaintIntensity: 65, eventPresence: 'high', hotspotHistory: 'recurring' } },
  { id: 'W004', name: 'D', zone: ZONES.SOUTH, kmlTarget: 'D', coordinates: { lat: 18.9428744, lng: 72.795347 }, population: 195000, complaints: 12, wpi: 55, lastCollection: '2 hours ago', nextScheduled: '3 hours', complianceScore: 'Medium', operationalInsights: 'Coastal area clean-up required.', resources: { vehicles: 5, personnel: 14 }, signals: { complaintIntensity: 45, eventPresence: 'medium', hotspotHistory: 'seasonal' } },
  { id: 'W005', name: 'E', zone: ZONES.SOUTH, kmlTarget: 'E', coordinates: { lat: 18.9818342, lng: 72.8467722 }, population: 210000, complaints: 35, wpi: 88, lastCollection: '4 hours ago', nextScheduled: 'ASAP', complianceScore: 'Low', operationalInsights: 'Critical delay in slum pockets.', resources: { vehicles: 7, personnel: 18 }, signals: { complaintIntensity: 85, eventPresence: 'critical', hotspotHistory: 'chronic' } },
  { id: 'W006', name: 'F/N', zone: ZONES.CENTRAL, kmlTarget: 'F/N', coordinates: { lat: 19.0097686, lng: 72.8849784 }, population: 250000, complaints: 28, wpi: 72, lastCollection: '2 hours ago', nextScheduled: '3 hours', complianceScore: 'Low', operationalInsights: 'Mixed usage area, high waste variance.', resources: { vehicles: 8, personnel: 20 }, signals: { complaintIntensity: 70, eventPresence: 'medium', hotspotHistory: 'recurring' } },
  { id: 'W007', name: 'F/S', zone: ZONES.SOUTH, kmlTarget: 'F/S', coordinates: { lat: 19.0105868, lng: 72.8562542 }, population: 225000, complaints: 18, wpi: 50, lastCollection: '1 hour ago', nextScheduled: '4 hours', complianceScore: 'Medium', operationalInsights: 'Hospital zone requires special handling.', resources: { vehicles: 6, personnel: 15 }, signals: { complaintIntensity: 40, eventPresence: 'low', hotspotHistory: 'none' } },
  { id: 'W008', name: 'G/N', zone: ZONES.CENTRAL, kmlTarget: 'G/N', coordinates: { lat: 19.0217523, lng: 72.8300861 }, population: 300000, complaints: 42, wpi: 88, lastCollection: '3 hours ago', nextScheduled: 'ASAP', complianceScore: 'Low', operationalInsights: 'Dadar station area overflowing.', resources: { vehicles: 10, personnel: 25 }, signals: { complaintIntensity: 95, eventPresence: 'critical', hotspotHistory: 'chronic', complaintSpike: true, weatherAlert: 'medium' } },
  { id: 'W009', name: 'G/S', zone: ZONES.CENTRAL, kmlTarget: 'G/S', coordinates: { lat: 19.0192703, lng: 72.8266139 }, population: 280000, complaints: 20, wpi: 60, lastCollection: '2 hours ago', nextScheduled: '3 hours', complianceScore: 'Medium', operationalInsights: 'Industrial estate clearance pending.', resources: { vehicles: 7, personnel: 18 }, signals: { complaintIntensity: 55, eventPresence: 'medium', hotspotHistory: 'recurring' } },
  { id: 'W010', name: 'H/E', zone: ZONES.WEST, kmlTarget: 'H/E', coordinates: { lat: 19.054128, lng: 72.8657312 }, population: 310000, complaints: 30, wpi: 78, lastCollection: '30 mins ago', nextScheduled: '1 hour', complianceScore: 'Low', operationalInsights: 'Transit zone heavy load.', resources: { vehicles: 9, personnel: 22 }, signals: { complaintIntensity: 75, eventPresence: 'high', hotspotHistory: 'chronic' } },
  { id: 'W011', name: 'H/W', zone: ZONES.WEST, kmlTarget: 'H/W', coordinates: { lat: 19.0904297, lng: 72.8427616 }, population: 320000, complaints: 15, wpi: 40, lastCollection: '1 hour ago', nextScheduled: '4 hours', complianceScore: 'High', operationalInsights: 'Bandra Bandstand area clear.', resources: { vehicles: 8, personnel: 20 }, signals: { complaintIntensity: 35, eventPresence: 'medium', hotspotHistory: 'none' } },
  { id: 'W012', name: 'K/E', zone: ZONES.WEST, kmlTarget: 'K/E', coordinates: { lat: 19.1295379, lng: 72.8847716 }, population: 350000, complaints: 38, wpi: 72, lastCollection: '2 hours ago', nextScheduled: '2 hours', complianceScore: 'Medium', operationalInsights: 'Airport surroundings require sweep.', resources: { vehicles: 11, personnel: 28 }, signals: { complaintIntensity: 85, eventPresence: 'high', hotspotHistory: 'recurring', complaintSpike: true, weatherAlert: 'low' } },
  { id: 'W013', name: 'K/W', zone: ZONES.WEST, kmlTarget: 'K/W', coordinates: { lat: 19.1510069, lng: 72.8228456 }, population: 360000, complaints: 25, wpi: 65, lastCollection: '1 hour ago', nextScheduled: '3 hours', complianceScore: 'Medium', operationalInsights: 'Juhu beach cleanup essential.', resources: { vehicles: 10, personnel: 25 }, signals: { complaintIntensity: 60, eventPresence: 'medium', hotspotHistory: 'seasonal' } },
  { id: 'W014', name: 'L', zone: ZONES.EAST, kmlTarget: 'L', coordinates: { lat: 19.1279133, lng: 72.8881479 }, population: 400000, complaints: 45, wpi: 92, lastCollection: '4 hours ago', nextScheduled: 'ASAP', complianceScore: 'Low', operationalInsights: 'Kurla terminus severe congestion.', resources: { vehicles: 12, personnel: 30 }, signals: { complaintIntensity: 95, eventPresence: 'critical', hotspotHistory: 'chronic' } },
  { id: 'W015', name: 'M/E', zone: ZONES.EAST, kmlTarget: 'M/E', coordinates: { lat: 19.0667363, lng: 72.9377378 }, population: 380000, complaints: 40, wpi: 89, lastCollection: '3 hours ago', nextScheduled: '1 hour', complianceScore: 'Low', operationalInsights: 'Deonar dumping ground vicinity.', resources: { vehicles: 11, personnel: 28 }, signals: { complaintIntensity: 88, eventPresence: 'high', hotspotHistory: 'chronic' } },
  { id: 'W016', name: 'M/W', zone: ZONES.EAST, kmlTarget: 'M/W', coordinates: { lat: 19.0728472, lng: 72.9039132 }, population: 330000, complaints: 20, wpi: 55, lastCollection: '1 hour ago', nextScheduled: '4 hours', complianceScore: 'Medium', operationalInsights: 'Chembur residential zones stable.', resources: { vehicles: 9, personnel: 22 }, signals: { complaintIntensity: 50, eventPresence: 'low', hotspotHistory: 'none' } },
  { id: 'W017', name: 'N', zone: ZONES.EAST, kmlTarget: 'N', coordinates: { lat: 19.1091103, lng: 72.916699 }, population: 290000, complaints: 12, wpi: 38, lastCollection: '2 hours ago', nextScheduled: '5 hours', complianceScore: 'High', operationalInsights: 'Ghatkopar east well managed.', resources: { vehicles: 8, personnel: 20 }, signals: { complaintIntensity: 30, eventPresence: 'none', hotspotHistory: 'none' } },
  { id: 'W018', name: 'P/N', zone: ZONES.WEST, kmlTarget: 'P/N', coordinates: { lat: 19.1665875, lng: 72.8772313 }, population: 270000, complaints: 28, wpi: 70, lastCollection: '2 hours ago', nextScheduled: '2 hours', complianceScore: 'Medium', operationalInsights: 'Malad west market waste pileup.', resources: { vehicles: 8, personnel: 20 }, signals: { complaintIntensity: 68, eventPresence: 'medium', hotspotHistory: 'recurring' } },
  { id: 'W019', name: 'P/S', zone: ZONES.WEST, kmlTarget: 'P/S', coordinates: { lat: 19.1324834, lng: 72.7821869 }, population: 260000, complaints: 18, wpi: 48, lastCollection: '1 hour ago', nextScheduled: '3 hours', complianceScore: 'High', operationalInsights: 'Goregaon film city area checking.', resources: { vehicles: 7, personnel: 18 }, signals: { complaintIntensity: 40, eventPresence: 'medium', hotspotHistory: 'none' } },
  { id: 'W020', name: 'R/C', zone: ZONES.WEST, kmlTarget: 'R/C', coordinates: { lat: 19.2614731, lng: 72.7898601 }, population: 240000, complaints: 10, wpi: 30, lastCollection: '1 hour ago', nextScheduled: '5 hours', complianceScore: 'High', operationalInsights: 'Borivali national park boundary clear.', resources: { vehicles: 6, personnel: 15 }, signals: { complaintIntensity: 25, eventPresence: 'none', hotspotHistory: 'none' } },
  { id: 'W021', name: 'R/N', zone: ZONES.WEST, kmlTarget: 'R/N', coordinates: { lat: 19.23748, lng: 72.8586339 }, population: 200000, complaints: 14, wpi: 42, lastCollection: '2 hours ago', nextScheduled: '4 hours', complianceScore: 'High', operationalInsights: 'Dahisar checkpoints monitoring.', resources: { vehicles: 5, personnel: 12 }, signals: { complaintIntensity: 35, eventPresence: 'none', hotspotHistory: 'none' } },
  { id: 'W022', name: 'R/S', zone: ZONES.WEST, kmlTarget: 'R/S', coordinates: { lat: 19.2011444, lng: 72.9010517 }, population: 220000, complaints: 16, wpi: 46, lastCollection: '1 hour ago', nextScheduled: '4 hours', complianceScore: 'High', operationalInsights: 'Kandivali east reliable service.', resources: { vehicles: 6, personnel: 14 }, signals: { complaintIntensity: 38, eventPresence: 'low', hotspotHistory: 'none' } },
  { id: 'W023', name: 'S', zone: ZONES.EAST, kmlTarget: 'S', coordinates: { lat: 19.1653619, lng: 72.9343792 }, population: 340000, complaints: 32, wpi: 76, lastCollection: '3 hours ago', nextScheduled: '1 hour', complianceScore: 'Low', operationalInsights: 'Bhandup industrial waste alerts.', resources: { vehicles: 9, personnel: 24 }, signals: { complaintIntensity: 72, eventPresence: 'high', hotspotHistory: 'chronic' } },
  { id: 'W024', name: 'T', zone: ZONES.EAST, kmlTarget: 'T', coordinates: { lat: 19.199988, lng: 72.9354831 }, population: 330000, complaints: 22, wpi: 58, lastCollection: '2 hours ago', nextScheduled: '3 hours', complianceScore: 'Medium', operationalInsights: 'Mulund check naka monitoring.', resources: { vehicles: 8, personnel: 22 }, signals: { complaintIntensity: 50, eventPresence: 'medium', hotspotHistory: 'seasonal' } },
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

// Mock Users for Demo
export const mockUsers = [
  {
    id: 'U001',
    name: 'City Commissioner',
    email: 'head@bmc.gov.in',
    role: 'CITY_HEAD',
    avatar: 'https://i.pravatar.cc/150?u=head',
  },
  {
    id: 'U002',
    name: 'Rajesh Verma',
    email: 'ward.officer@bmc.gov.in',
    role: 'WARD_OFFICER',
    assignedWard: 'W001', // Colaba
    avatar: 'https://i.pravatar.cc/150?u=ward',
  },
  {
    id: 'U003',
    name: 'Amit Patel',
    email: 'zone.sup@bmc.gov.in',
    role: 'ZONAL_SUPERVISOR',
    assignedZone: 'South',
    avatar: 'https://i.pravatar.cc/150?u=zone',
  },
];

export default demoAPI;
