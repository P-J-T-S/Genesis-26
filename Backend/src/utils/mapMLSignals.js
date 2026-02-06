/**
 * Converts ML model outputs (0–1 scale, continuous)
 * into recommendation-engine signals (0–100, rule-friendly)
 */
export const mapMLSignalsToRecSignals = (mlSignals) => {
  if (!mlSignals) return {};

  return {
    // Scale ML outputs
    complaint_intensity: Math.round((mlSignals.complaint_intensity || 0) * 100),

    event_presence: Math.round((mlSignals.festival_intensity || 0) * 100),

    weather_alert: Math.round((mlSignals.weather_risk || 0) * 100),

    // Domain-derived signals (not ML predictions)
    hotspot_history: mlSignals.complaint_intensity > 0.6 ? 70 : 30,

    spike_flag:
      mlSignals.complaint_intensity > 0.75 && mlSignals.crowd_index > 0.7,
  };
};
