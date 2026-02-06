

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { Zone } from "../models/zone.model.js";
import { ZoneStatus } from "../models/zone_status.model.js";
import { ComplaintAgg } from "../models/complaints_agg.model.js";
import { Event } from "../models/event.model.js";
import { Alert } from "../models/alert.model.js";

const mumbaiZones = [
  {
    zone_id: "zone_andheri_w",
    zone_name: "Andheri West",
    geojson: {
      type: "Point",
      coordinates: [72.8362, 19.1362]
    },
    is_hotspot: true
  },
  {
    zone_id: "zone_andheri_e",
    zone_name: "Andheri East",
    geojson: {
      type: "Point",
      coordinates: [72.8697, 19.1197]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_bandra_w",
    zone_name: "Bandra West",
    geojson: {
      type: "Point",
      coordinates: [72.8296, 19.0596]
    },
    is_hotspot: true
  },
  {
    zone_id: "zone_bandra_e",
    zone_name: "Bandra East",
    geojson: {
      type: "Point",
      coordinates: [72.8516, 19.0516]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_dadar",
    zone_name: "Dadar",
    geojson: {
      type: "Point",
      coordinates: [72.8426, 19.0176]
    },
    is_hotspot: true
  },
  {
    zone_id: "zone_kurla",
    zone_name: "Kurla",
    geojson: {
      type: "Point",
      coordinates: [72.8796, 19.0726]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_dharavi",
    zone_name: "Dharavi",
    geojson: {
      type: "Point",
      coordinates: [72.8553, 19.0430]
    },
    is_hotspot: true
  },
  {
    zone_id: "zone_worli",
    zone_name: "Worli",
    geojson: {
      type: "Point",
      coordinates: [72.8183, 19.0096]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_colaba",
    zone_name: "Colaba",
    geojson: {
      type: "Point",
      coordinates: [72.8318, 18.9067]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_juhu",
    zone_name: "Juhu",
    geojson: {
      type: "Point",
      coordinates: [72.8296, 19.0996]
    },
    is_hotspot: true
  },
  {
    zone_id: "zone_malad",
    zone_name: "Malad West",
    geojson: {
      type: "Point",
      coordinates: [72.8416, 19.1816]
    },
    is_hotspot: false
  },
  {
    zone_id: "zone_goregaon",
    zone_name: "Goregaon",
    geojson: {
      type: "Point",
      coordinates: [72.8556, 19.1556]
    },
    is_hotspot: false
  }
];


async function seedZones() {
  await Zone.deleteMany({});
  const zones = await Zone.insertMany(mumbaiZones);
  console.log(`✅ Seeded ${zones.length} zones`);
  return zones;
}

async function seedZoneStatus(zones) {
  await ZoneStatus.deleteMany({});
  
  const statuses = zones.map((zone, i) => {
    // Vary WPI scores for demo
    const wpiScores = [15, 25, 35, 45, 55, 65, 72, 78, 85, 42, 28, 60];
    const wpi = wpiScores[i] || 50;
    
    let color = "green";
    if (wpi > 75) color = "red";
    else if (wpi > 50) color = "orange";
    else if (wpi > 25) color = "yellow";
    
    return {
      zone_id: zone._id,
      wpi_score: wpi,
      status_color: color,
      blink_flag: wpi > 75, // Blink only red zones
      priority_rank: i + 1,
      mode: "normal",
      last_updated: new Date()
    };
  });
  
  await ZoneStatus.insertMany(statuses);
  console.log(`✅ Seeded ${statuses.length} zone statuses`);
}

async function seedComplaints(zones) {
  await ComplaintAgg.deleteMany({});
  
  const complaints = [];
  const windows = ["last_1hr", "last_6hrs", "last_24hrs"];
  
  for (const zone of zones) {
    for (const window of windows) {
      const count = Math.floor(Math.random() * 20) + 1;
      const avg = Math.floor(Math.random() * 10) + 5;
      
      complaints.push({
        zone_id: zone._id,
        time_window: window,
        complaint_count: count,
        avg_daily_count: avg,
        spike_flag: count > avg * 1.5, // Spike if 50% above avg
        timestamp: new Date()
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
      event_id: "evt_ganesh_dadar",
      event_name: "Ganesh Chaturthi Procession",
      zone_id: zones.find(z => z.zone_name === "Dadar")?._id,
      event_type: "festival",
      waste_factor: 2.5,
      start_time: now,
      end_time: tomorrow,
      active_flag: true
    },
    {
      event_id: "evt_rally_bandra",
      event_name: "Political Rally",
      zone_id: zones.find(z => z.zone_name === "Bandra West")?._id,
      event_type: "rally",
      waste_factor: 1.8,
      start_time: tomorrow,
      end_time: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000),
      active_flag: true
    },
    {
      event_id: "evt_juhu_fair",
      event_name: "Juhu Beach Festival",
      zone_id: zones.find(z => z.zone_name === "Juhu")?._id,
      event_type: "festival",
      waste_factor: 2.0,
      start_time: now,
      end_time: nextWeek,
      active_flag: true
    }
  ].filter(e => e.zone_id); // Remove if zone not found
  
  await Event.insertMany(events);
  console.log(`✅ Seeded ${events.length} events`);
}

async function seedAlerts(zones) {
  await Alert.deleteMany({});
  
  const now = new Date();
  
  const alerts = [
    {
      alert_id: "alert_rain_dharavi",
      zone_id: zones.find(z => z.zone_name === "Dharavi")?._id,
      alert_type: "rain",
      severity: "high",
      title: "Heavy Rainfall Warning",
      description: "IMD predicts heavy rainfall. Waste collection may be delayed.",
      active_flag: true,
      timestamp: now
    },
    {
      alert_id: "alert_flood_kurla",
      zone_id: zones.find(z => z.zone_name === "Kurla")?._id,
      alert_type: "flood",
      severity: "high",
      title: "Waterlogging Alert",
      description: "Low-lying areas experiencing waterlogging.",
      active_flag: true,
      timestamp: now
    },
    {
      alert_id: "alert_outbreak_andheri",
      zone_id: zones.find(z => z.zone_name === "Andheri West")?._id,
      alert_type: "outbreak",
      severity: "medium",
      title: "Dengue Cases Reported",
      description: "Increase in dengue cases. Prioritize stagnant water cleanup.",
      active_flag: true,
      timestamp: now
    }
  ].filter(a => a.zone_id);
  
  await Alert.insertMany(alerts);
  console.log(`✅ Seeded ${alerts.length} alerts`);
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");
    
    const zones = await seedZones();
    await seedZoneStatus(zones);
    await seedComplaints(zones);
    await seedEvents(zones);
    await seedAlerts(zones);
    
    console.log("\n🎉 Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();