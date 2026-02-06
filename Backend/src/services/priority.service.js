// Backend/src/services/priority.service.js
import { ZoneStatus } from '../models/zone_status.model.js';

export const getTopPriorityZones = async (limit = 5) => {
  // Fetch all zone statuses
  // Fetch all zone statuses (not lean, so updates are reflected)
  // Always return mock data for priorities
  const mockWards = [
    { id: 'W001', name: 'Colaba', zone: 'South', coordinates: { lat: 18.9067, lng: 72.8147 }, population: 65000, complaints: 12, lastCollection: '2 hours ago', nextScheduled: '4 hours', factors: { complaints: 12, eventImpact: 'High - Festival gathering', weatherRisk: 'Low', historicalTrend: 'Increasing' }, resources: { vehicles: 3, personnel: 8 }, wpi: 72, color: 'orange' },
    { id: 'W002', name: 'Bandra West', zone: 'West', coordinates: { lat: 19.0596, lng: 72.8295 }, population: 120000, complaints: 18, lastCollection: '1 hour ago', nextScheduled: '2 hours', factors: { complaints: 18, eventImpact: 'High - Commercial area weekend', weatherRisk: 'Medium', historicalTrend: 'Stable' }, resources: { vehicles: 5, personnel: 12 }, wpi: 65, color: 'orange' },
    { id: 'W003', name: 'Andheri East', zone: 'West', coordinates: { lat: 19.1136, lng: 72.8697 }, population: 180000, complaints: 25, lastCollection: '30 mins ago', nextScheduled: '1 hour', factors: { complaints: 25, eventImpact: 'Critical - Market day + Construction', weatherRisk: 'High - Rain expected', historicalTrend: 'Rapidly increasing' }, resources: { vehicles: 4, personnel: 10 }, wpi: 63, color: 'orange' },
    { id: 'W004', name: 'Dadar', zone: 'Central', coordinates: { lat: 19.0178, lng: 72.8478 }, population: 95000, complaints: 5, lastCollection: '3 hours ago', nextScheduled: '5 hours', factors: { complaints: 5, eventImpact: 'None', weatherRisk: 'Low', historicalTrend: 'Stable' }, resources: { vehicles: 3, personnel: 7 }, wpi: 59, color: 'orange' },
    { id: 'W005', name: 'Kurla', zone: 'East', coordinates: { lat: 19.0728, lng: 72.8826 }, population: 145000, complaints: 9, lastCollection: '2 hours ago', nextScheduled: '3 hours', factors: { complaints: 9, eventImpact: 'Medium - Local event', weatherRisk: 'Low', historicalTrend: 'Increasing' }, resources: { vehicles: 4, personnel: 9 }, wpi: 54, color: 'yellow' },
    { id: 'W006', name: 'Borivali', zone: 'North', coordinates: { lat: 19.2304, lng: 72.8571 }, population: 110000, complaints: 3, lastCollection: '4 hours ago', nextScheduled: '6 hours', factors: { complaints: 3, eventImpact: 'None', weatherRisk: 'Low', historicalTrend: 'Stable' }, resources: { vehicles: 3, personnel: 6 }, wpi: 42, color: 'yellow' },
    { id: 'W007', name: 'Mulund', zone: 'North', coordinates: { lat: 19.1726, lng: 72.9565 }, population: 88000, complaints: 7, lastCollection: '2 hours ago', nextScheduled: '4 hours', factors: { complaints: 7, eventImpact: 'Low', weatherRisk: 'Low', historicalTrend: 'Stable' }, resources: { vehicles: 2, personnel: 5 }, wpi: 28, color: 'green' },
    { id: 'W008', name: 'Worli', zone: 'South', coordinates: { lat: 19.0176, lng: 72.8157 }, population: 75000, complaints: 11, lastCollection: '1 hour ago', nextScheduled: '2 hours', factors: { complaints: 11, eventImpact: 'High - Business district', weatherRisk: 'Medium', historicalTrend: 'Increasing' }, resources: { vehicles: 3, personnel: 8 }, wpi: 18, color: 'green' },
  ];

  // Sort by WPI and assign ranks
  const sortedZones = mockWards.sort((a, b) => (b.wpi || 0) - (a.wpi || 0));
  const topZones = sortedZones.slice(0, limit);
  return topZones.map((zone, i) => ({
    ...zone,
    wardId: zone.id,
    wardName: zone.name,
    rank: i + 1,
    critical: (zone.wpi || 0) >= 75,
    actionable: false,
    updated_at: new Date(),
  }));
};

export const getPriorityDistribution = async () => {
  const distribution = await ZoneStatus.aggregate([
    {
      $group: {
        _id: '$color',
        count: { $sum: 1 }
      }
    }
  ]);

  return Object.fromEntries(distribution.map(d => [d._id, d.count]));
};
