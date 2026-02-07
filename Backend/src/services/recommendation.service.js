import { Recommendation } from '../models/recommendation.model.js';

export const generateRecommendations = async (
  zoneId,
  wpi_score,
  signals,
  mode
) => {
  const recommendations = [];

  if (wpi_score >= 85 && signals.spike_flag) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'IMMEDIATE RESPONSE: Deploy additional crews for emergency pickup',
      reason_text: buildReasonText(
        'Critical WPI (85+) with active spike',
        signals,
        wpi_score
      ),
      actionability_score: 95,
      generated_at: new Date(),
    });
  }

  // Rule 2: High WPI in event mode
  if (mode === 'event' && wpi_score >= 70) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'URGENT: Increase frequency during event period (hourly or bi-hourly)',
      reason_text: buildReasonText(
        'Event mode with high WPI (70+)',
        signals,
        wpi_score
      ),
      actionability_score: 90,
      generated_at: new Date(),
    });
  }

  // Rule 3: High WPI in emergency mode
  if (mode === 'emergency' && wpi_score >= 75) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'EMERGENCY PROTOCOL: Coordinate with disaster management & health teams',
      reason_text: buildReasonText(
        'Emergency mode with high WPI (75+)',
        signals,
        wpi_score
      ),
      actionability_score: 92,
      generated_at: new Date(),
    });
  }

  // Rule 4: Active weather/health alert
  if (signals.weather_alert > 50) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'ALERT RESPONSE: Monitor closely & increase vigilance for health risks',
      reason_text: buildReasonText(
        'Active weather/health alert signal',
        signals,
        wpi_score
      ),
      actionability_score: 85,
      generated_at: new Date(),
    });
  }

  // Rule 5: Hotspot zone with moderate-high WPI
  if (signals.hotspot_history > 50 && wpi_score >= 50) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'HOTSPOT ZONE: Implement preventive measures & increase frequency',
      reason_text: buildReasonText(
        'Identified hotspot with moderate-high WPI',
        signals,
        wpi_score
      ),
      actionability_score: 75,
      generated_at: new Date(),
    });
  }

  // Rule 6: Moderate WPI
  if (wpi_score >= 50 && wpi_score < 70) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action: 'STANDARD: Increase pickup frequency to twice daily',
      reason_text: buildReasonText(
        'Moderate WPI requiring attention',
        signals,
        wpi_score
      ),
      actionability_score: 60,
      generated_at: new Date(),
    });
  }

  // Rule 7: Low WPI
  if (wpi_score < 50 && wpi_score >= 30) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action: 'ROUTINE: Maintain standard daily pickup schedule',
      reason_text: buildReasonText(
        'Low-moderate WPI - routine operations',
        signals,
        wpi_score
      ),
      actionability_score: 40,
      generated_at: new Date(),
    });
  }

  // Rule 8: Very low WPI
  if (wpi_score < 30) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action: 'MINIMAL: Standard weekly schedule sufficient',
      reason_text: buildReasonText(
        'Very low WPI - minimal intervention needed',
        signals,
        wpi_score
      ),
      actionability_score: 20,
      generated_at: new Date(),
    });
  }

  // Rule 9: Active event
  if (signals.event_presence > 70) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'EVENT PREP: Pre-position crews near event venue for rapid response',
      reason_text: buildReasonText(
        'Active/high-presence event in zone',
        signals,
        wpi_score
      ),
      actionability_score: 80,
      generated_at: new Date(),
    });
  }

  // Rule 10: Multi-signal convergence
  const signalCount = [
    signals.complaint_intensity > 50,
    signals.event_presence > 50,
    signals.weather_alert > 50,
    signals.spike_flag,
  ].filter(Boolean).length;

  if (signalCount >= 3) {
    recommendations.push({
      zone_id: zoneId,
      recommended_action:
        'MULTI-SIGNAL ALERT: Coordinate across teams for integrated response',
      reason_text: buildReasonText(
        `Multiple converging signals (${signalCount} active)`,
        signals,
        wpi_score
      ),
      actionability_score: 88,
      generated_at: new Date(),
    });
  }

  return recommendations;
};

function buildReasonText(mainReason, signals, wpi_score) {
  const signalBreakdown = [];

  if (signals.complaint_intensity > 50) {
    signalBreakdown.push(
      `High complaint intensity (${signals.complaint_intensity})`
    );
  }
  if (signals.event_presence > 50) {
    signalBreakdown.push(`Event presence detected (${signals.event_presence})`);
  }
  if (signals.weather_alert > 50) {
    signalBreakdown.push(
      `Weather/health alert active (${signals.weather_alert})`
    );
  }
  if (signals.hotspot_history > 50) {
    signalBreakdown.push(`Zone identified as hotspot`);
  }
  if (signals.spike_flag) {
    signalBreakdown.push(`Complaint spike detected`);
  }

  const breakdown =
    signalBreakdown.length > 0
      ? `Contributing factors: ${signalBreakdown.join(', ')}.`
      : 'No major signal triggers.';

  return `${mainReason}. WPI Score: ${wpi_score}. ${breakdown}`;
}

export const saveRecommendations = async (recommendations) => {
  try {
    if (recommendations.length === 0) return [];

    const saved = await Recommendation.insertMany(recommendations);
    return saved;
  } catch (error) {
    console.error('Error saving recommendations:', error);
    return [];
  }
};

export const getAllRecentRecommendations = async (limit = 20) => {
  try {
    const recommendations = await Recommendation.find({})
      .populate('zone_id')
      .sort({ generated_at: -1 })
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error('Error fetching all recommendations:', error);
    return [];
  }
};

export const getRecentRecommendations = async (zoneId, limit = 5) => {
  try {
    const recommendations = await Recommendation.find({ zone_id: zoneId })
      .sort({ generated_at: -1 })
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const generateAndSaveRecommendations = async (
  zoneId,
  wpi_score,
  signals,
  mode
) => {
  // Generate recommendations
  const recommendations = await generateRecommendations(
    zoneId,
    wpi_score,
    signals,
    mode
  );

  // Save to DB
  const saved = await saveRecommendations(recommendations);

  return saved;
};
