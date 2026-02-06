import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    rec_id: {
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

    recommended_action: {
      type: String,
      required: [true, "Recommended action is required"],
      trim: true,
    },

    reason_text: {
      type: String,
      trim: true,
      default: "",
    },

    generated_at: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    // Optional judge-visible metric to indicate actionability
    actionability_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for recent recommendations per zone sorted by actionability
recommendationSchema.index({ zone_id: 1, generated_at: -1, actionability_score: -1 });

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);