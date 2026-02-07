import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
  {
    zone_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    zone_name: {
      type: String,
      required: [true, "Zone name is required"],
      trim: true,
      index: true,
    },

    zone_type: {
      type: String,
      trim: true,
    },

    geojson: {
      type: {
        type: String,
        enum: ["Point", "Polygon", "MultiPolygon"],
        required: true,
      },
      coordinates: {
        type: [],
        required: true,
      },
    },

    is_hotspot: {
      type: Boolean,
      default: false,
      index: true,
    },

    population: {
      type: Number,
      default: 0,
    },

    wpi: {
      type: Number,
      default: 0,
    },

    compliance_score: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },

    operational_insights: {
      type: String,
      default: '',
    },

    resources: {
      vehicles: {
        type: Number,
        default: 0,
      },
      personnel: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// Enable geospatial queries / map rendering
zoneSchema.index({ geojson: "2dsphere" });

export const Zone = mongoose.model("Zone", zoneSchema);