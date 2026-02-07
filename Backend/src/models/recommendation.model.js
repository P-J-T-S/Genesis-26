import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
	{
		zone_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Zone",
			required: true,
			index: true,
		},
		recommended_action: {
			type: String,
			required: true,
		},
		reason_text: {
			type: String,
			required: true,
		},
		actionability_score: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},
		generated_at: {
			type: Date,
			required: true,
			default: Date.now,
			index: true,
		},
	},
	{ timestamps: true }
);

recommendationSchema.index({ zone_id: 1, generated_at: -1 });

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);
