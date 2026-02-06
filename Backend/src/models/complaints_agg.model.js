import mongoose from "mongoose";

const complaintsAggSchema = new mongoose.Schema(
  {
    zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true,
    },

    time_window: {
      type: String,
      required: true,
      enum: ["last_1hr", "last_6hrs", "last_12hrs", "last_24hrs", "last_7days"],
      index: true,
    },

    complaint_count: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    avg_daily_count: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    spike_flag: {
      type: Boolean,
      default: false,
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

// Compound index for fast recent-aggregation queries per zone + window
complaintsAggSchema.index({ zone_id: 1, time_window: 1, timestamp: -1 });

export const ComplaintAgg = mongoose.model("ComplaintAgg", complaintsAggSchema);