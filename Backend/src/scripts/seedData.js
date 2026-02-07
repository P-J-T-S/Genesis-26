// Backend/src/scripts/seedData.js
// Seed database with Mumbai wards data from frontend demoData.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../database/connect.js';
import { Zone } from '../models/zone.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';
import { ZoneStatus } from '../models/zone_status.model.js';
import { Recommendation } from '../models/recommendation.model.js';

dotenv.config();

// Mumbai wards data (from Frontend/src/data/demoData.js)
const ZONES = {
  SOUTH: 'South',
  NORTH: 'North',
  EAST: 'East',
  WEST: 'West',
  CENTRAL: 'Central',
  ISLAND_CITY: 'Island City',
};

const wardsData = [
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

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting seed process with Mumbai wards data...');

    // Connect to DB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Zone.deleteMany({});
    await ComplaintAgg.deleteMany({});
    await Event.deleteMany({});
    await Alert.deleteMany({});
    await ZoneStatus.deleteMany({});
    await Recommendation.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create zones from Mumbai wards data
    const zonesArray = [];
    for (const ward of wardsData) {
      // Create simple polygon around ward coordinates
      const lat = ward.coordinates.lat;
      const lng = ward.coordinates.lng;
      const offset = 0.01; // ~1km offset for polygon

      zonesArray.push({
        zone_name: ward.name,
        zone_id: ward.id,
        zone_type: ward.zone,
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [lng - offset, lat - offset],
              [lng + offset, lat - offset],
              [lng + offset, lat + offset],
              [lng - offset, lat + offset],
              [lng - offset, lat - offset],
            ],
          ],
        },
        is_hotspot: ward.signals.hotspotHistory === 'chronic' || ward.signals.hotspotHistory === 'recurring',
        population: ward.population,
        wpi: ward.wpi,
        compliance_score: ward.complianceScore,
        operational_insights: ward.operationalInsights,
        resources: ward.resources,
      });
    }

    const zones = await Zone.insertMany(zonesArray);
    console.log(`✅ Created ${zones.length} Mumbai ward zones`);

    // Create complaint aggregations based on ward signals
    const now = new Date();
    const complaintsData = [];

    zones.forEach((zone, index) => {
      const ward = wardsData[index];
      const complaintCount = ward.complaints;
      const avgDaily = Math.floor(complaintCount * 0.7);
      const spikeFlag = ward.signals.complaintSpike || false;

      // 12-hour window
      complaintsData.push({
        zone_id: zone._id,
        time_window: 'last_12hrs',
        complaint_count: complaintCount,
        avg_daily_count: avgDaily,
        spike_flag: spikeFlag,
        timestamp: now,
      });

      // 6-hour window
      complaintsData.push({
        zone_id: zone._id,
        time_window: 'last_6hrs',
        complaint_count: Math.floor(complaintCount / 2),
        avg_daily_count: avgDaily,
        spike_flag: spikeFlag,
        timestamp: now,
      });
    });

    await ComplaintAgg.insertMany(complaintsData);
    console.log(`✅ Created ${complaintsData.length} complaint aggregations`);

    // Create events for wards with high event presence
    const eventWards = zones.filter((zone, index) => {
      const ward = wardsData[index];
      return ward.signals.eventPresence === 'high' || ward.signals.eventPresence === 'critical';
    });

    const events = [];
    eventWards.forEach((zone, index) => {
      const ward = wardsData.find(w => w.id === zone.zone_id);
      const eventStart = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
      const eventEnd = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now

      events.push({
        event_name: `${ward.name} Ward Event`,
        zone_id: zone._id,
        event_type: ward.signals.eventPresence === 'critical' ? 'rally' : 'festival',
        start_time: eventStart,
        end_time: eventEnd,
        active_flag: true,
      });
    });

    if (events.length > 0) {
      await Event.insertMany(events);
      console.log(`✅ Created ${events.length} events`);
    }

    // Create alerts for wards with weather alerts
    const alertWards = zones.filter((zone, index) => {
      const ward = wardsData[index];
      return ward.signals.weatherAlert && ward.signals.weatherAlert !== 'none';
    });

    const alerts = [];
    alertWards.forEach((zone, index) => {
      const ward = wardsData.find(w => w.id === zone.zone_id);
      const severityMap = {
        low: 'low',
        medium: 'medium',
        high: 'high',
        severe: 'critical',
      };

      alerts.push({
        zone_id: zone._id,
        alert_type: 'rain', // Using 'rain' as a valid weather-related alert type
        severity: severityMap[ward.signals.weatherAlert] || 'medium',
        active_flag: true,
        timestamp: now,
      });
    });

    if (alerts.length > 0) {
      await Alert.insertMany(alerts);
      console.log(`✅ Created ${alerts.length} alerts`);
    }

    // Initialize ZoneStatus and Recommendations
    console.log('🔄 Initializing WPI status and recommendations...');
    const wpiService = await import('../services/wpi.service.js');
    const recommendationService = await import('../services/recommendation.service.js');

    const wpiResults = await wpiService.computeAllZonesWPI('normal');
    console.log(`✅ Computed WPI for ${wpiResults.length} zones`);

    for (const res of wpiResults) {
      await recommendationService.generateAndSaveRecommendations(
        res._id,
        res.wpi,
        res.signals,
        'normal'
      );
    }
    console.log('✅ Initialized WPI status and recommendations');

    console.log('🎉 Mumbai wards seed data created successfully!');
    console.log(`\n📊 Summary:
      - Zones: ${zones.length}
      - Complaint Aggregations: ${complaintsData.length}
      - Events: ${events.length}
      - Alerts: ${alerts.length}
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
