// Backend-friendly static BMC wards data for seeding
// No imports, no frontend helpers, just static data

export const wardsData = [
  { id: 'W001', name: 'A', fullName: 'Colaba', coordinates: { lat: 18.9129625, lng: 72.8294731 }, wpi: 45, signals: { complaint_intensity: 30, event_presence: 10, hotspot_history: 0, weather_alert: 0, spike_flag: false } },
  { id: 'W002', name: 'B', fullName: 'Bandra West', coordinates: { lat: 18.9634234, lng: 72.8445646 }, wpi: 35, signals: { complaint_intensity: 25, event_presence: 0, hotspot_history: 0, weather_alert: 0, spike_flag: false } },
  { id: 'W003', name: 'C', fullName: 'Andheri East', coordinates: { lat: 18.9617446, lng: 72.8319769 }, wpi: 75, signals: { complaint_intensity: 65, event_presence: 80, hotspot_history: 60, weather_alert: 40, spike_flag: true } },
  { id: 'W004', name: 'D', fullName: 'Dadar', coordinates: { lat: 18.9428744, lng: 72.795347 }, wpi: 55, signals: { complaint_intensity: 45, event_presence: 50, hotspot_history: 30, weather_alert: 0, spike_flag: false } },
  { id: 'W005', name: 'E', fullName: 'Kurla West', coordinates: { lat: 18.9818342, lng: 72.8467722 }, wpi: 88, signals: { complaint_intensity: 85, event_presence: 90, hotspot_history: 80, weather_alert: 60, spike_flag: true } },
];

export const wardPolygons = {
  'W001': { coordinates: [[[72.8047, 18.8967], [72.8247, 18.8967], [72.8247, 18.9167], [72.8047, 18.9167], [72.8047, 18.8967]]] },
  'W002': { coordinates: [[[72.8195, 19.0496], [72.8395, 19.0496], [72.8395, 19.0696], [72.8195, 19.0696], [72.8195, 19.0496]]] },
  'W003': { coordinates: [[[72.8597, 19.1036], [72.8797, 19.1036], [72.8797, 19.1236], [72.8597, 19.1236], [72.8597, 19.1036]]] },
  'W004': { coordinates: [[[72.8340, 19.0078], [72.8540, 19.0078], [72.8540, 19.0278], [72.8340, 19.0278], [72.8340, 19.0078]]] },
  'W005': { coordinates: [[[72.8679, 19.0560], [72.8879, 19.0560], [72.8879, 19.0760], [72.8679, 19.0760], [72.8679, 19.0560]]] },
};
