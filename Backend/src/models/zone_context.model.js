import mongoose from "mongoose";

const zoneContextSchema = new mongoose.Schema({
  zone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  event_flag: {
    type: Boolean,
    default: false
  },
  weather_flag: {
    type: Boolean,
    default: false
  },
  emergency_flag: {
    type: Boolean,
    default: false
  },
  context_notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const ZoneContext = mongoose.model("ZoneContext", zoneContextSchema);
