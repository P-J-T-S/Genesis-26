// Backend/src/scripts/seedData.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../database/connect.js';
import { Zone } from '../models/zone.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting seed process...');
    
    // Connect to DB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Zone.deleteMany({});
    await ComplaintAgg.deleteMany({});
    await Event.deleteMany({});
    await Alert.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample zones
    const zones = await Zone.insertMany([
      {
        zone_name: 'Downtown Central',
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [28.6139, 77.209],
              [28.6145, 77.209],
              [28.6145, 77.2095],
              [28.6139, 77.2095],
              [28.6139, 77.209],
            ],
          ],
        },
        is_hotspot: true,
      },
      {
        zone_name: 'South District',
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [28.5244, 77.1855],
              [28.5250, 77.1855],
              [28.5250, 77.1860],
              [28.5244, 77.1860],
              [28.5244, 77.1855],
            ],
          ],
        },
        is_hotspot: false,
      },
      {
        zone_name: 'North Park',
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [28.6500, 77.2250],
              [28.6506, 77.2250],
              [28.6506, 77.2255],
              [28.6500, 77.2255],
              [28.6500, 77.2250],
            ],
          ],
        },
        is_hotspot: false,
      },
      {
        zone_name: 'East Ward',
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [28.6041, 77.2384],
              [28.6047, 77.2384],
              [28.6047, 77.2389],
              [28.6041, 77.2389],
              [28.6041, 77.2384],
            ],
          ],
        },
        is_hotspot: true,
      },
      {
        zone_name: 'West Zone',
        geojson: {
          type: 'Polygon',
          coordinates: [
            [
              [28.6129, 77.1980],
              [28.6135, 77.1980],
              [28.6135, 77.1985],
              [28.6129, 77.1985],
              [28.6129, 77.1980],
            ],
          ],
        },
        is_hotspot: false,
      },
    ]);
    console.log('✅ Created 5 sample zones');

    // Create complaint aggregations (test WPI computation)
    const now = new Date();
    const complaintsData = [
      {
        zone_id: zones[0]._id, // Downtown Central (hotspot)
        time_window: 'last_12hrs',
        complaint_count: 45,
        avg_daily_count: 35,
        spike_flag: true,
        timestamp: now,
      },
      {
        zone_id: zones[1]._id, // South District
        time_window: 'last_12hrs',
        complaint_count: 20,
        avg_daily_count: 15,
        spike_flag: false,
        timestamp: now,
      },
      {
        zone_id: zones[2]._id, // North Park
        time_window: 'last_12hrs',
        complaint_count: 8,
        avg_daily_count: 10,
        spike_flag: false,
        timestamp: now,
      },
      {
        zone_id: zones[3]._id, // East Ward (hotspot)
        time_window: 'last_12hrs',
        complaint_count: 38,
        avg_daily_count: 25,
        spike_flag: true,
        timestamp: now,
      },
      {
        zone_id: zones[4]._id, // West Zone
        time_window: 'last_12hrs',
        complaint_count: 12,
        avg_daily_count: 18,
        spike_flag: false,
        timestamp: now,
      },
    ];

    // Add 6-hour aggregates for spike detection
    complaintsData.forEach(c => {
      complaintsData.push({
        ...c,
        time_window: 'last_6hrs',
        complaint_count: Math.floor(c.complaint_count / 2),
      });
    });

    await ComplaintAgg.insertMany(complaintsData);
    console.log('✅ Created complaint aggregations');

    // Create events (to test event presence signal)
    const eventStart = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const eventEnd = new Date(eventStart.getTime() + 6 * 60 * 60 * 1000);

    await Event.insertMany([
      {
        event_name: 'Downtown Festival',
        zone_id: zones[0]._id,
        event_type: 'festival',
        start_time: eventStart,
        end_time: eventEnd,
        active_flag: true,
      },
      {
        event_name: 'East Ward Rally',
        zone_id: zones[3]._id,
        event_type: 'rally',
        start_time: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago (active now)
        end_time: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        active_flag: true,
      },
    ]);
    console.log('✅ Created events');

    // Create alerts (weather/emergency)
    await Alert.insertMany([
      {
        zone_id: zones[1]._id, // South District
        alert_type: 'flood',
        severity: 'high',
        active_flag: true,
        timestamp: now,
      },
      {
        zone_id: zones[0]._id, // Downtown
        alert_type: 'rain',
        severity: 'medium',
        active_flag: true,
        timestamp: now,
      },
      {
        zone_id: zones[3]._id, // East Ward
        alert_type: 'outbreak',
        severity: 'high',
        active_flag: true,
        timestamp: now,
      },
    ]);
    console.log('✅ Created alerts');

    console.log('🎉 Seed data created successfully!');
    console.log(`\n📊 Summary:
      - Zones: ${zones.length}
      - Complaint Aggregations: ${complaintsData.length}
      - Events: 2
      - Alerts: 3
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();