export const modeConfig = {
  normal: {
    weights: {
      complaint_intensity: 0.4,    // C
      event_presence: 0.25,         // E
      hotspot_history: 0.15,        // H
      weather_alert: 0.15,          // W
      spike_flag: 0.05,             // S
    },
    thresholds: {
      green: { min: 0, max: 29 },
      yellow: { min: 30, max: 54 },
      orange: { min: 55, max: 79 },
      red: { min: 80, max: 100 },
    },
    blink_threshold: 90,
  },

  event: {
    weights: {
      complaint_intensity: 0.35,
      event_presence: 0.3,
      hotspot_history: 0.2,
      weather_alert: 0.1,
      spike_flag: 0.05,
    },
    thresholds: {
      green: { min: 0, max: 24 },
      yellow: { min: 25, max: 49 },
      orange: { min: 50, max: 74 },
      red: { min: 75, max: 100 },
    },
    blink_threshold: 85,
  },

  emergency: {
    weights: {
      complaint_intensity: 0.3,
      event_presence: 0.35,
      hotspot_history: 0.2,
      weather_alert: 0.15,
      spike_flag: 0,                // not used in emergency
    },
    thresholds: {
      green: { min: 0, max: 19 },
      yellow: { min: 20, max: 44 },
      orange: { min: 45, max: 69 },
      red: { min: 70, max: 100 },
    },
    blink_threshold: 80,
  },
};

// Get color based on WPI score and mode
export const getColorByWPI = (wpi, mode = 'normal') => {
  const config = modeConfig[mode] || modeConfig.normal;
  const thresholds = config.thresholds;

  if (wpi <= thresholds.green.max) return 'green';
  if (wpi <= thresholds.yellow.max) return 'yellow';
  if (wpi <= thresholds.orange.max) return 'orange';
  return 'red';
};

// Check if blink flag should be set based on WPI and mode
export const shouldBlink = (wpi, mode = 'normal') => {
  const config = modeConfig[mode] || modeConfig.normal;
  return wpi >= config.blink_threshold;
};