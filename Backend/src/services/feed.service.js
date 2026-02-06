// Backend/src/services/feed.service.js
import { Recommendation } from '../models/recommendation.model.js';
import { Alert } from '../models/alert.model.js';
import { Event } from '../models/event.model.js';

export const getFeedData = async (limit = 10) => {
  const recommendations = await Recommendation.find()
    .populate('zone_id')
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();

  const alerts = await Alert.find({ active_flag: true })
    .populate('zone_id')
    .sort({ timestamp: -1 })
    .limit(Math.floor(limit / 2))
    .lean();

  const events = await Event.find({ active_flag: true })
    .populate('zone_id')
    .sort({ start_time: -1 })
    .limit(Math.floor(limit / 2))
    .lean();

  const feedItems = [
    ...recommendations.map(r => ({ type: 'recommendation', data: r })),
    ...alerts.map(a => ({ type: 'alert', data: a })),
    ...events.map(e => ({ type: 'event', data: e }))
  ]
    .sort((a, b) => new Date(b.data.created_at || b.data.timestamp || b.data.start_time) - new Date(a.data.created_at || a.data.timestamp || a.data.start_time))
    .slice(0, limit);

  return feedItems;
};

export const getRecentRecommendations = async (limit = 5) => {
  return await Recommendation.find()
    .populate('zone_id')
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();
};
