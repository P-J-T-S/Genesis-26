import mongoose from "mongoose";

const zoneCreditRankingSchema = new mongoose.Schema({
  zone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
    unique: true,
    index: true
  },
  credit_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
    index: true
  },
  zone_status: {
    type: String,
    enum: ["Stable", "Monitor", "Needs Evaluation"],
    default: "Stable",
    index: true
  },
  rank: { type: Number, default: 0, index: true },
  reason: String,
  last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

zoneCreditRankingSchema.index({ credit_score: -1, zone_id: 1 });

export const ZoneCreditRanking = mongoose.model("ZoneCreditRanking", zoneCreditRankingSchema);