import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import { Zone } from '../models/zone.model.js';
import { ZoneStatus } from '../models/zone_status.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';
import { Recommendation } from '../models/recommendation.model.js';

// --- PATCHED: Use frontend mockData and polygons for real BMC wards ---
import { wardsData, wardPolygons } from './wardsData.backend.js';
// NOTE: Do not use any frontend utility functions from demoData.js in backend seeding

const mumbaiZones = wardsData.map(ward => {
  const polygon = wardPolygons[ward.id];
  return {
    zone_id: ward.id,
    zone_name: ward.fullName || ward.name,
    geojson: polygon
      ? { type: 'Polygon', coordinates: polygon.coordinates }
      : { type: 'Point', coordinates: [ward.coordinates.lng, ward.coordinates.lat] },
    is_hotspot: false,
    signals: ward.signals || {},
    wpi: ward.wpi || 50
  };
});

async function seedZones() {
  await Zone.deleteMany({});
  const zones = await Zone.insertMany(mumbaiZones);
  console.log(`✅ Seeded ${zones.length} zones`);
  return zones;
}

async function seedZoneStatus(zones) {
  await ZoneStatus.deleteMany({});

  const statuses = zones.map((zone, i) => {
    // Use seeded WPI and signals from zone
    const wpi = zone.wpi || 50;
    const signals = zone.signals || {};

    let color = 'green';
    if (wpi > 75) color = 'red';
    else if (wpi > 50) color = 'orange';
    else if (wpi > 25) color = 'yellow';

    return {
      zone_id: zone._id,
      wpi_score: wpi,
      status_color: color,
      blink_flag: wpi > 75, // Blink only red zones
      priority_rank: i + 1,
      mode: 'normal',
      last_updated: new Date(),
      signals
    };
  });

  await ZoneStatus.insertMany(statuses);
  console.log(`✅ Seeded ${statuses.length} zone statuses`);
}

async function seedComplaints(zones) {
  await ComplaintAgg.deleteMany({});

  const complaints = [];
  const windows = ['last_1hr', 'last_6hrs', 'last_24hrs'];

  for (const zone of zones) {
    for (const window of windows) {
      const isHotspot = zone.is_hotspot;

      const avg = isHotspot ? 20 : 8;
      const count = isHotspot
        ? avg + Math.floor(Math.random() * 20)
        : avg + Math.floor(Math.random() * 5);

      complaints.push({
        zone_id: zone._id,
        time_window: window,
        complaint_count: count,
        avg_daily_count: avg,
        spike_flag: count > avg * 1.4,
        timestamp: new Date(),
      });
    }
  }

  await ComplaintAgg.insertMany(complaints);
  console.log(`✅ Seeded ${complaints.length} complaint records`);
}

async function seedEvents(zones) {
  await Event.deleteMany({});

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const events = [
    {
      event_id: 'evt_ganesh_dadar',
      event_name: 'Ganesh Chaturthi Procession',
      zone_id: zones.find((z) => z.zone_name === 'Dadar')?._id,
      event_type: 'festival',
      waste_factor: 2.5,
      start_time: now,
      end_time: tomorrow,
      active_flag: true,
    },
    {
      event_id: 'evt_rally_bandra',
      event_name: 'Political Rally',
      zone_id: zones.find((z) => z.zone_name === 'Bandra West')?._id,
      event_type: 'rally',
      waste_factor: 1.8,
      start_time: tomorrow,
      end_time: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000),
      active_flag: true,
    },
    {
      event_id: 'evt_future_marathon',
      event_name: 'Mumbai Marathon',
      zone_id: zones.find((z) => z.zone_name === 'Worli')?._id,
      event_type: 'other',
      waste_factor: 2.2,
      start_time: new Date(Date.now() + 48 * 60 * 60 * 1000),
      end_time: new Date(Date.now() + 60 * 60 * 60 * 1000),
      active_flag: true,
    },

    {
      event_id: 'evt_juhu_fair',
      event_name: 'Juhu Beach Festival',
      zone_id: zones.find((z) => z.zone_name === 'Juhu')?._id,
      event_type: 'festival',
      waste_factor: 2.0,
      start_time: now,
      end_time: nextWeek,
      active_flag: true,
    },
  ].filter((e) => e.zone_id); // Remove if zone not found

  await Event.insertMany(events);
  console.log(`✅ Seeded ${events.length} events`);
}

async function seedAlerts(zones) {
  await Alert.deleteMany({});

  const now = new Date();

  const alerts = [
    {
      alert_id: 'alert_rain_dharavi',
      zone_id: zones.find((z) => z.zone_name === 'Dharavi')?._id,
      alert_type: 'rain',
      severity: 'high',
      title: 'Heavy Rainfall Warning',
      description:
        'IMD predicts heavy rainfall. Waste collection may be delayed.',
      active_flag: true,
      timestamp: now,
    },
    {
      alert_id: 'alert_flood_kurla',
      zone_id: zones.find((z) => z.zone_name === 'Kurla')?._id,
      alert_type: 'flood',
      severity: 'high',
      title: 'Waterlogging Alert',
      description: 'Low-lying areas experiencing waterlogging.',
      active_flag: true,
      timestamp: now,
    },
    {
      alert_id: 'alert_outbreak_andheri',
      zone_id: zones.find((z) => z.zone_name === 'Andheri West')?._id,
      alert_type: 'outbreak',
      severity: 'medium',
      title: 'Dengue Cases Reported',
      description:
        'Increase in dengue cases. Prioritize stagnant water cleanup.',
      active_flag: true,
      timestamp: now,
    },
  ].filter((a) => a.zone_id);

  await Alert.insertMany(alerts);
  console.log(`✅ Seeded ${alerts.length} alerts`);
}

async function seedRecommendations(zones) {
  await Recommendation.deleteMany({});

  const recs = [
    {
      zone_name: 'Dharavi',
      action:
        'Deploy 2 extra compactors and increase pickup frequency to 4 hrs',
      score: 90,
      reason: 'High complaints + rainfall alert',
    },
    {
      zone_name: 'Dadar',
      action: 'Deploy additional sanitation workers during festival hours',
      score: 80,
      reason: 'Ganesh Chaturthi procession ongoing',
    },
    {
      zone_name: 'Andheri West',
      action:
        'Prioritize fogging and waste clearance near residential clusters',
      score: 70,
      reason: 'Reported dengue outbreak',
    },
  ];

  const recommendations = recs
    .map((r) => {
      const zone = zones.find((z) => z.zone_name === r.zone_name);
      if (!zone) return null;

      return {
        zone_id: zone._id,
        recommended_action: r.action,
        reason_text: r.reason,
        actionability_score: r.score,
        generated_at: new Date(),
      };
    })
    .filter(Boolean);

  await Recommendation.insertMany(recommendations);
  console.log(`✅ Seeded ${recommendations.length} recommendations`);
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const zones = await seedZones();
    await seedZoneStatus(zones);
    await seedComplaints(zones);
    await seedEvents(zones);
    await seedAlerts(zones);
    await seedRecommendations(zones);
    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
