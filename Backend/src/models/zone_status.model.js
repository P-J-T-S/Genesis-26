import mongoose from "mongoose";

const zoneStatusSchema = new mongoose.Schema(
  {
    zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      unique: true,
      index: true,
    },

    wpi_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },

    status_color: {
      type: String,
      enum: ["green", "yellow", "orange", "red"],
      default: "green",
      index: true,
    },

    blink_flag: {
      type: Boolean,
      default: false,
      index: true,
    },

    priority_rank: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    mode: {
      type: String,
      enum: ["normal", "event", "emergency"],
      default: "normal",
      index: true,
    },

    last_updated: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Useful compound indexes for frontend queries
zoneStatusSchema.index({ status_color: 1, priority_rank: -1 });
zoneStatusSchema.index({ mode: 1, last_updated: -1 });

export const ZoneStatus = mongoose.model("ZoneStatus", zoneStatusSchema);