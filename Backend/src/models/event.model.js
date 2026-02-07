import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId().toHexString(),
    },

    event_name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      minlength: [2, "Event name must be at least 2 characters"],
      index: true,
    },

    zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true,
    },

    event_type: {
      type: String,
      required: true,
      enum: ["festival", "rally", "election", "other"],
      default: "other",
      index: true,
    },

    start_time: {
      type: Date,
      required: true,
      index: true,
    },

    end_time: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: function (v) {
          if (!this.start_time || !v) return true;
          return v >= this.start_time;
        },
        message: "end_time must be equal or after start_time",
      },
    },

    waste_factor: {
      type: Number,
      default: 1.5,
      min: 1,
      max: 3
    },

    active_flag: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for queries by zone and upcoming events
eventSchema.index({ zone_id: 1, start_time: 1 });

// For faster lookups by event id
// event_id already has index: true in the schema definition

export const Event = mongoose.model("Event", eventSchema);