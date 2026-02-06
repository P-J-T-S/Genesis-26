import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { wardPolygons } from '../../data/mumbaiWardsGeoJSON';
import { getWPILevel } from '../../utils/helpers';

// Mumbai default center & zoom
const MUMBAI_CENTER = [19.076, 72.8777];
const DEFAULT_ZOOM = 11;

// Mode-aware color logic for WPI based on thresholds
const getWPIColor = (wpi, mode = 'normal') => {
  // Mode thresholds (synced with backend config)
  const thresholds = {
    normal: { green: 29, yellow: 54, orange: 79 },
    event: { green: 24, yellow: 49, orange: 74 },
    emergency: { green: 19, yellow: 44, orange: 69 },
  };

  const t = thresholds[mode] || thresholds.normal;

  if (wpi <= t.green) return '#10b981'; // Emerald Green - Normal
  if (wpi <= t.yellow) return '#eab308'; // Amber Yellow - Medium Pressure
  if (wpi <= t.orange) return '#f97316'; // Orange - High Pressure
  return '#ef4444'; // Red - Critical
};

const LiveWastePressureMap = ({ wardsData = [], selectedWardId, currentMode = 'normal', onWardSelect }) => {
    // Accept isLive prop for badge
    const isLive = typeof wardsData.isLive === 'boolean' ? wardsData.isLive : false;
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [blinkOpacity, setBlinkOpacity] = useState(0.7);
  const geoJsonRef = React.useRef(null);

  // Get mode-specific blink threshold
  const getBlinkThreshold = (mode) => {
    const thresholds = {
      normal: 80,
      event: 75,
      emergency: 70,
    };
    return thresholds[mode] || 80;
  };

  const blinkThreshold = getBlinkThreshold(currentMode);
  const hasCritical = useMemo(
    () => wardsData.some(w => w.wpi >= blinkThreshold),
    [wardsData, blinkThreshold]
  );

  // Convert wardsData to GeoJSON with proper coordinates
  useEffect(() => {
    if (!wardsData.length) return;

    const features = wardsData.map(w => {
      const wardKey = w.id.startsWith('W') ? w.id : `W${String(w.id).padStart(3, '0')}`;
      const polygon = wardPolygons[wardKey];
      
      if (!polygon) return null;

      const wpiStatus = getWPILevel(w.wpi, currentMode);

      return {
        type: 'Feature',
        properties: {
          ward_id: w.id,
          ward_name: w.name,
          zone: w.zone || 'N/A',
          wpi: w.wpi || 50,
          is_critical: w.wpi >= blinkThreshold,
          is_selected: w.id === selectedWardId,
          status_label: wpiStatus.label,
          status_color: wpiStatus.color,
          // Signals breakdown for context panel
          complaints: w.complaints || 0,
          events: w.events || 0,
          hotspot: w.hotspotHistory || 0,
          weatherAlert: w.weatherAlert || false,
        },
        geometry: {
          type: 'Polygon',
          coordinates: polygon.coordinates,
        },
      };
    }).filter(Boolean);

    setGeoJsonData({
      type: 'FeatureCollection',
      features,
    });
  }, [wardsData, selectedWardId, currentMode, blinkThreshold]);

  // Blinking effect for critical wards (mode-aware)
  useEffect(() => {
    if (!hasCritical) {
      setBlinkOpacity(0.7);
      return;
    }

    const interval = setInterval(() => {
      setBlinkOpacity(prev => (prev === 0.85 ? 0.4 : 0.85));
    }, 600); // Faster blink for higher urgency

    return () => clearInterval(interval);
  }, [hasCritical]);

  // Enhanced style function with visual hierarchy
  const styleFeature = feature => {
    const isSelected = feature.properties.is_selected;
    const isCritical = feature.properties.is_critical;
    const wpi = feature.properties.wpi;
    const mode = currentMode;

    return {
      fillColor: getWPIColor(wpi, mode),
      fillOpacity: isCritical ? blinkOpacity : 0.65,
      color: isSelected ? '#ffffff' : '#1f2937', // White border if selected, dark border otherwise
      weight: isSelected ? 3 : 1.5,
      opacity: isSelected ? 1 : 0.8,
      dashArray: isCritical ? '5, 5' : 'none', // Dashed border for critical zones
      lineCap: 'round',
      lineJoin: 'round',
    };
  };

  // Enhanced click handler
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;

    // Click handler
    layer.on({
      click: () => {
        onWardSelect?.({
          id: props.ward_id,
          name: props.ward_name,
          zone: props.zone,
          wpi: props.wpi,
          status: props.status_label,
          complaints: props.complaints,
          events: props.events,
          hotspot: props.hotspot,
          weatherAlert: props.weatherAlert,
        });
      },
      mouseover: () => {
        layer.setStyle({
          weight: (props.is_selected ? 3 : 1.5) + 1,
          opacity: 1,
        });
      },
      mouseout: () => {
        layer.setStyle(styleFeature(feature));
      },
    });

    // Enhanced popup with WPI context
    const popupContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-width: 200px;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #111827;">${props.ward_name}</div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Zone: ${props.zone}</div>
        
        <div style="background: ${getWPIColor(props.wpi, currentMode)}20; border-left: 3px solid ${getWPIColor(props.wpi, currentMode)}; padding: 8px; margin: 8px 0; border-radius: 4px;">
          <div style="font-weight: 600; color: ${getWPIColor(props.wpi, currentMode)}; font-size: 16px;">WPI: ${props.wpi}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${props.status_label}</div>
        </div>
        
        <div style="font-size: 11px; color: #6b7280; line-height: 1.6;">
          <div>📋 Complaints: ${props.complaints}</div>
          <div>📅 Recent Events: ${props.events}</div>
          <div>🔥 Hotspot History: ${props.hotspot}/10</div>
          ${props.weatherAlert ? '<div style="color: #ea580c;">⚠️ Weather Alert Active</div>' : ''}
        </div>
        
        <div style="font-size: 11px; color: #3b82f6; margin-top: 8px; font-weight: 500; cursor: pointer;">
          👆 Click to view action panel
        </div>
      </div>
    `;

    layer.bindPopup(popupContent, { maxWidth: 280 });
  };

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* LIVE/DEMO badge overlay */}
        <div style={{ position: 'absolute', top: 12, right: 16, zIndex: 1000 }}>
          {isLive ? (
            <span className="px-2 py-0.5 bg-green-600 text-white rounded text-xs animate-pulse shadow border border-green-700">LIVE</span>
          ) : (
            <span className="px-2 py-0.5 bg-red-600 text-white rounded text-xs shadow border border-red-700">DEMO</span>
          )}
        </div>
        <MapContainer
          center={MUMBAI_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
          zoomControl={true}
        >
          {/* Carto Light Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={18}
            minZoom={9}
          />

          {/* Ward Overlays with Dynamic Styling */}
          {geoJsonData && (
            <GeoJSON
              ref={geoJsonRef}
              data={geoJsonData}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}

          {/* Legend Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>WPI Scale ({currentMode.toUpperCase()})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                <span>Normal (Safe)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#eab308', borderRadius: '2px' }}></div>
                <span>Medium (Monitor)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#f97316', borderRadius: '2px' }}></div>
                <span>High (Action)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ef4444',
                    borderRadius: '2px',
                    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                ></div>
                <span>Critical (Alert!)</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>

    </>
  );
};

export default LiveWastePressureMap;
