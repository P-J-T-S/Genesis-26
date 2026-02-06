import { ComplaintAgg } from '../models/complaints_agg.model.js';

export async function detectSpikes() {
  const records = await ComplaintAgg.find();

  for (const r of records) {
    const spike = r.complaint_count > r.avg_daily_count * 1.5;

    await ComplaintAgg.updateOne(
      { _id: r._id },
      { $set: { spike_flag: spike } }
    );
  }

  return { message: 'Spike detection complete' };
}
