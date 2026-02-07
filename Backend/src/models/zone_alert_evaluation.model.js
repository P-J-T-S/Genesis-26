import mongoose from "mongoose";

const zoneAlertEvaluationSchema = new mongoose.Schema({
  zone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
    unique: true,
    index: true
  },
  alert_count_24h: { type: Number, default: 0 },
  alert_count_7d: { type: Number, default: 0 },
  repeated_alert_days: { type: Number, default: 0 },
  contextless_alert_count: { type: Number, default: 0 },
  high_alert_flag: { type: Boolean, default: false },
  alert_frequency_level: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

export const ZoneAlertEvaluation = mongoose.model("ZoneAlertEvaluation", zoneAlertEvaluationSchema);