import { Alert } from '../models/alert.model.js';
import { ZoneAlertEvaluation } from '../models/zone_alert_evaluation.model.js';
import { ZoneCreditRanking } from '../models/zone_credit_ranking.model.js';
import { ZoneContext } from '../models/zone_context.model.js';
import { Zone } from '../models/zone.model.js';


const CREDIT_CONFIG = {
  BASE_CREDIT: 100,
  HIGH_ALERT_PENALTY: 8,        // w1: high alert count
  REPEATED_DAYS_PENALTY: 5,     // w2: repeated alert days
  CONTEXTLESS_ALERT_PENALTY: 10 // w3: contextless alerts
};

const ALERT_THRESHOLDS = {
  HIGH_ALERT_24H: 5,    // If > 5 alerts in 24h, flag as high
  REPETITION_THRESHOLD: 3 // If alerts on 3+ different days
};


export const aggregateZoneAlerts = async (zoneId) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count alerts in last 24 hours
    const alerts24h = await Alert.countDocuments({
      zone_id: zoneId,
      timestamp: { $gte: last24h },
      active_flag: true
    });

    // Count alerts in last 7 days
    const alerts7d = await Alert.countDocuments({
      zone_id: zoneId,
      timestamp: { $gte: last7d },
      active_flag: true
    });

    // Get all alerts in last 7d for repetition analysis
    const alertsData = await Alert.find({
      zone_id: zoneId,
      timestamp: { $gte: last7d },
      active_flag: true
    }).select('timestamp zone_id');

    // Count days with alerts (repetition)
    const daysWithAlerts = new Set(
      alertsData.map(a => a.timestamp.toISOString().split('T')[0])
    ).size;

    
    const highAlertFlag = alerts24h > ALERT_THRESHOLDS.HIGH_ALERT_24H;

    
    let frequencyLevel = 'Low';
    if (alerts7d > 10) frequencyLevel = 'High';
    else if (alerts7d > 5) frequencyLevel = 'Medium';

    return {
      alert_count_24h: alerts24h,
      alert_count_7d: alerts7d,
      repeated_alert_days: daysWithAlerts,
      high_alert_flag: highAlertFlag,
      alert_frequency_level: frequencyLevel
    };
  } catch (error) {
    console.error('Error aggregating alerts:', error);
    throw error;
  }
};


export const checkContextlessAlerts = async (zoneId) => {
  try {
    const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get alerts without context
    const alerts = await Alert.find({
      zone_id: zoneId,
      timestamp: { $gte: last7d },
      active_flag: true
    });

    let contextlessCount = 0;

    for (const alert of alerts) {
      const alertDate = alert.timestamp.toISOString().split('T')[0];
      const context = await ZoneContext.findOne({
        zone_id: zoneId,
        date: {
          $gte: new Date(alertDate),
          $lte: new Date(new Date(alertDate).getTime() + 24 * 60 * 60 * 1000)
        }
      });

      
      if (!context || (!context.event_flag && !context.weather_flag && !context.emergency_flag)) {
        contextlessCount++;
      }
    }

    return contextlessCount;
  } catch (error) {
    console.error('Error checking contextless alerts:', error);
    throw error;
  }
};


export const calculateCreditScore = async (zoneId) => {
  try {
    // Get aggregated alert data
    const alertData = await aggregateZoneAlerts(zoneId);
    const contextlessCount = await checkContextlessAlerts(zoneId);

    // Apply credit formula
    let credit = CREDIT_CONFIG.BASE_CREDIT;
    credit -= alertData.alert_count_7d * CREDIT_CONFIG.HIGH_ALERT_PENALTY;
    credit -= alertData.repeated_alert_days * CREDIT_CONFIG.REPEATED_DAYS_PENALTY;
    credit -= contextlessCount * CREDIT_CONFIG.CONTEXTLESS_ALERT_PENALTY;

    // Clamp between 0-100
    credit = Math.max(0, Math.min(credit, 100));

    // Determine zone status
    let zoneStatus = 'Stable';
    let reason = 'Performing well';

    if (credit < 50) {
      zoneStatus = 'Needs Evaluation';
      reason = 'High alert frequency with unexplained patterns';
    } else if (credit < 80) {
      zoneStatus = 'Monitor';
      reason = 'Elevated alert activity detected';
    }

    // Save evaluation data
    await ZoneAlertEvaluation.findOneAndUpdate(
      { zone_id: zoneId },
      {
        zone_id: zoneId,
        ...alertData,
        contextless_alert_count: contextlessCount,
        last_updated: new Date()
      },
      { upsert: true, new: true }
    );

    return {
      zone_id: zoneId,
      credit_score: credit,
      zone_status: zoneStatus,
      reason: reason,
      alert_summary: alertData
    };
  } catch (error) {
    console.error('Error calculating credit score:', error);
    throw error;
  }
};


export const saveCreditScore = async (creditData) => {
  try {
    return await ZoneCreditRanking.findOneAndUpdate(
      { zone_id: creditData.zone_id },
      {
        zone_id: creditData.zone_id,
        credit_score: creditData.credit_score,
        zone_status: creditData.zone_status,
        reason: creditData.reason,
        last_updated: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error saving credit score:', error);
    throw error;
  }
};


export const calculateAllCreditScores = async () => {
  try {
    const zones = await Zone.find();
    const results = [];

    for (const zone of zones) {
      try {
        const creditData = await calculateCreditScore(zone._id);
        const saved = await saveCreditScore(creditData);
        results.push({ zone_id: zone._id, success: true, data: saved });
      } catch (error) {
        results.push({ zone_id: zone._id, success: false, error: error.message });
      }
    }

    // Update ranks
    const sorted = await ZoneCreditRanking.find().sort({ credit_score: -1 });
    for (let i = 0; i < sorted.length; i++) {
      sorted[i].rank = i + 1;
      await sorted[i].save();
    }

    return results;
  } catch (error) {
    console.error('Error calculating all credit scores:', error);
    throw error;
  }
};


export const getRankedZones = async (limit = 50) => {
  try {
    const rankings = await ZoneCreditRanking.find()
      .sort({ credit_score: -1, rank: 1 })
      .limit(limit)
      .populate('zone_id', 'zone_name');

    return rankings;
  } catch (error) {
    console.error('Error fetching ranked zones:', error);
    throw error;
  }
};


export const getZoneCreditDetails = async (zoneId) => {
  try {
    const credit = await ZoneCreditRanking.findOne({ zone_id: zoneId }).populate('zone_id');
    const evaluation = await ZoneAlertEvaluation.findOne({ zone_id: zoneId });

    return {
      credit: credit || null,
      evaluation: evaluation || null
    };
  } catch (error) {
    console.error('Error fetching zone credit details:', error);
    throw error;
  }
};