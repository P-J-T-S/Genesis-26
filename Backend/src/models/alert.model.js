import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    alert_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId().toHexString(),
    },

    zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true,
    },

    alert_type: {
      type: String,
      required: true,
      enum: ["rain", "flood", "outbreak", "other"],
      default: "other",
      index: true,
    },

    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "low",
      index: true,
    },

    active_flag: {
      type: Boolean,
      default: true,
      index: true,
    },

    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for fast recent alerts by zone and activity
alertSchema.index({ zone_id: 1, active_flag: 1, timestamp: -1 });

export const Alert = mongoose.model("Alert", alertSchema);