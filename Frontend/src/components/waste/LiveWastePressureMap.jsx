import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mumbai default center & zoom
const MUMBAI_CENTER = [19.076, 72.8777];
const DEFAULT_ZOOM = 11;

// Color logic for WPI
const getWPIColor = (wpi) => {
  if (wpi <= 30) return '#2ecc71'; // Green
  if (wpi <= 60) return '#f1c40f'; // Yellow
  if (wpi <= 80) return '#e67e22'; // Orange
  return '#e74c3c'; // Red
};

// Example ward polygons (replace with real geojson coordinates)
const wardPolygons = {
  W001: [[
    [18.8967, 72.8047],
    [18.8967, 72.8247],
    [18.9167, 72.8247],
    [18.9167, 72.8047],
    [18.8967, 72.8047],
  ]],
  W002: [[
    [19.0496, 72.8195],
    [19.0496, 72.8395],
    [19.0696, 72.8395],
    [19.0696, 72.8195],
    [19.0496, 72.8195],
  ]],
  // Add more wards...
};

const LiveWastePressureMap = ({ wardsData = [], selectedWardId, onWardSelect }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [blinkOpacity, setBlinkOpacity] = useState(0.65);

  const hasCritical = useMemo(() => wardsData.some(w => w.wpi > 80), [wardsData]);

  // Convert wardsData to GeoJSON
  useEffect(() => {
    if (!wardsData.length) return;

    const features = wardsData.map(w => {
      const coords = wardPolygons[w.id];
      if (!coords) return null;

      return {
        type: 'Feature',
        properties: {
          ward_id: w.id,
          ward_name: w.name,
          wpi: w.wpi,
          is_critical: w.wpi > 80,
          is_selected: w.id === selectedWardId,
        },
        geometry: {
          type: 'Polygon',
          coordinates: coords,
        },
      };
    }).filter(Boolean);

    setGeoJsonData({
      type: 'FeatureCollection',
      features,
    });
  }, [wardsData, selectedWardId]);

  // Blinking effect for critical wards
  useEffect(() => {
    if (!hasCritical) {
      setBlinkOpacity(0.65);
      return;
    }

    const interval = setInterval(() => {
      setBlinkOpacity(prev => (prev === 0.9 ? 0.3 : 0.9));
    }, 700);

    return () => clearInterval(interval);
  }, [hasCritical]);

  // Style function
  const styleFeature = feature => ({
    fillColor: getWPIColor(feature.properties.wpi),
    fillOpacity: feature.properties.is_critical ? blinkOpacity : 0.65,
    color: feature.properties.is_selected ? '#ffffff' : '#ffffff',
    weight: feature.properties.is_selected ? 3 : 1,
    opacity: 0.8,
  });

  // Click handler
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onWardSelect && onWardSelect({ id: feature.properties.ward_id, name: feature.properties.ward_name, wpi: feature.properties.wpi });
      },
    });

    layer.bindPopup(`
      <div>
        <strong>${feature.properties.ward_name}</strong><br/>
        WPI: ${feature.properties.wpi}<br/>
        ${feature.properties.is_critical ? '<span style="color:red;font-weight:bold">CRITICAL</span>' : ''}
      </div>
    `);
  };

  return (
    <MapContainer
      center={MUMBAI_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      {/* Trusted Carto Dark Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> | &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Wards */}
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default LiveWastePressureMap;
