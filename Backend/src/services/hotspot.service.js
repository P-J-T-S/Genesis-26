import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Zone } from '../models/zone.model.js';

export async function identifyHotspots() {
  const aggs = await ComplaintAgg.aggregate([
    {
      $group: {
        _id: '$zone_id',
        avgComplaints: { $avg: '$complaint_count' },
      },
    },
  ]);

  for (const z of aggs) {
    const isHotspot = z.avgComplaints > 18; //threshold

    await Zone.updateOne({ _id: z._id }, { $set: { is_hotspot: isHotspot } });
  }

  return { message: 'Hotspot identification complete' };
}
