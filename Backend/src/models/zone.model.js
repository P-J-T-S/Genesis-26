import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
  {
    zone_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId().toHexString(),
    },

    zone_name: {
      type: String,
      required: [true, "Zone name is required"],
      trim: true,
      minlength: [2, "Zone name must be at least 2 characters"],
      index: true,
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
  },
  { timestamps: true }
);

// Enable geospatial queries / map rendering
zoneSchema.index({ geojson: "2dsphere" });

export const Zone = mongoose.model("Zone", zoneSchema);