import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { loadKmlAsGeoJson } from '../../utils/loadKml';
import { getWPILevel, getWPIThresholds } from '../../utils/helpers';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const KML_URL = '/assets/mumbai-wards.kml';

<<<<<<< HEAD
  const t = thresholds[mode] || thresholds.normal;

  if (wpi <= t.green) return '#10b981'; // Emerald Green - Normal
  if (wpi <= t.yellow) return '#eab308'; // Amber Yellow - Medium Pressure
  if (wpi <= t.orange) return '#f97316'; // Orange - High Pressure
  return '#ef4444'; // Red - Critical
};

const LiveWastePressureMap = ({ wardsData = [], selectedWardId, currentMode = 'normal', onWardSelect }) => {
    // Accept isLive prop for badge
    const isLive = typeof wardsData.isLive === 'boolean' ? wardsData.isLive : false;
=======
const LiveWastePressureMap = ({
  wardsData = [],
  selectedWardId,
  currentMode = 'normal',
  onWardSelect,
}) => {
>>>>>>> initial-frontend
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [blinkOpacity, setBlinkOpacity] = useState(0.7);
  const geoJsonRef = useRef(null);

  // -------------------------------
  // Load & merge KML with ward data
  // -------------------------------
  useEffect(() => {
    if (!wardsData.length) return;

    loadKmlAsGeoJson(KML_URL).then(kmlGeoJson => {
      const mergedFeatures = kmlGeoJson.features.map(feature => {
        // Try to find matching ward by name
        // KML ExtendedData usually has NAME
        let wardName =
          feature.properties?.NAME ||
          feature.properties?.name ||
          feature.properties?.Name ||
          '';

        wardName = wardName.toString().trim(); // CRITICAL: Trim whitespace from KML tags

        const wardData = wardsData.find(
          w =>
            w.kmlTarget === wardName ||
            w.name?.toLowerCase() === wardName?.toLowerCase()
        );

        if (!wardData) return null;

        const { high } = getWPIThresholds(currentMode);
        const blinkThreshold = high;

        const wpiStatus = getWPILevel(wardData.wpi, currentMode);

        return {
          ...feature,
          properties: {
            ward_id: wardData.id,
            ward_name: wardData.name,
            zone: wardData.zone || 'N/A',
            wpi: wardData.wpi,
            is_critical: wardData.wpi >= blinkThreshold,
            is_selected: wardData.id === selectedWardId,
            status_label: wpiStatus.label,
            status_color: wpiStatus.color,
            complaints: wardData.complaints || 0,
            events: wardData.events || 0,
            hotspot: wardData.hotspotHistory || 0,
            weatherAlert: wardData.weatherAlert || false,
          },
        };
      }).filter(Boolean);

      setGeoJsonData({
        type: 'FeatureCollection',
        features: mergedFeatures,
      });
    });
  }, [wardsData, selectedWardId, currentMode]);

  // -------------------------------
  // Blink logic (unchanged)
  // -------------------------------
  const { high: blinkThreshold } = getWPIThresholds(currentMode);

  const hasCritical = useMemo(
    () => wardsData.some(w => w.wpi >= blinkThreshold),
    [wardsData, blinkThreshold]
  );

  useEffect(() => {
    if (!hasCritical) {
      setBlinkOpacity(0.7);
      return;
    }
    const interval = setInterval(() => {
      setBlinkOpacity(prev => (prev === 0.85 ? 0.4 : 0.85));
    }, 600);
    return () => clearInterval(interval);
  }, [hasCritical]);

  // -------------------------------
  // Styling (reuse your logic)
  // -------------------------------
  const getWPIColor = (wpi, mode) => {
    const t = {
      normal: { g: 29, y: 54, o: 79 },
      event: { g: 24, y: 49, o: 74 },
      emergency: { g: 19, y: 44, o: 69 },
    }[mode] || {};

    if (wpi <= t.g) return '#10b981';
    if (wpi <= t.y) return '#eab308';
    if (wpi <= t.o) return '#f97316';
    return '#ef4444';
  };

  const styleFeature = feature => {
    const color = getWPIColor(feature.properties.wpi, currentMode);
    // console.log(`Ward: ${feature.properties.ward_name}, WPI: ${feature.properties.wpi}, Mode: ${currentMode}, Color: ${color}`);
    return {
      fillColor: color,
      fillOpacity: feature.properties.is_critical ? blinkOpacity : 0.65,
      color: feature.properties.is_selected ? '#fff' : '#1f2937',
      weight: feature.properties.is_selected ? 3 : 1.5,
      dashArray: feature.properties.is_critical ? '5,5' : 'none',
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => onWardSelect?.(feature.properties),
    });
    // Optional: Add tooltip to polygon too
    layer.bindTooltip(`${feature.properties.ward_name} (WPI: ${feature.properties.wpi})`, {
      permanent: false,
      direction: 'center'
    });
  };

  return (
<<<<<<< HEAD
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
=======
    <MapContainer center={[19.076, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* 1. Polygon Layer (KML Boundaries) */}
      {geoJsonData && (
        <GeoJSON
          ref={geoJsonRef}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}

      {/* 2. Marker Layer (Points for all wards) */}
      {/* {wardsData.map((ward) => (<>
        <Marker
          key={ward.id}
          position={[ward.coordinates.lat, ward.coordinates.lng]}
          eventHandlers={{
            click: () => onWardSelect?.({ ...ward, ward_id: ward.id, ward_name: ward.name }),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-1">{ward.name}</h3>
              <p className="text-sm font-semibold text-gray-600">
                Zone: {ward.zone} | WPI: <span className={ward.wpi >= 80 ? 'text-red-600' : 'text-green-600'}>{ward.wpi}</span>
              </p>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Complaints:</span>
                  <span className="font-medium">{ward.complaints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicles:</span>
                  <span className="font-medium">{ward.resources?.vehicles || 0}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </>
      ))} */}
    </MapContainer>
>>>>>>> initial-frontend
  );
};

export default LiveWastePressureMap;
