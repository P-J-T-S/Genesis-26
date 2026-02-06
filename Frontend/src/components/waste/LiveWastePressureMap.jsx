import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mumbai center coordinates
const MUMBAI_CENTER = [19.0760, 72.8777];
const DEFAULT_ZOOM = 11;

// WPI color logic
const getWPIColor = (wpi) => {
    if (wpi <= 30) return '#2ecc71'; // Green - Normal
    if (wpi <= 60) return '#f1c40f'; // Yellow - Medium
    if (wpi <= 80) return '#e67e22'; // Orange - High
    return '#e74c3c'; // Red - Critical
};

// Ward polygon boundaries for Mumbai wards
const wardPolygons = {
    'W001': [[18.8967, 72.8047], [18.8967, 72.8247], [18.9167, 72.8247], [18.9167, 72.8047], [18.8967, 72.8047]],
    'W002': [[19.0496, 72.8195], [19.0496, 72.8395], [19.0696, 72.8395], [19.0696, 72.8195], [19.0496, 72.8195]],
    'W003': [[19.1036, 72.8597], [19.1036, 72.8797], [19.1236, 72.8797], [19.1236, 72.8597], [19.1036, 72.8597]],
    'W004': [[19.0078, 72.8340], [19.0078, 72.8540], [19.0278, 72.8540], [19.0278, 72.8340], [19.0078, 72.8340]],
    'W005': [[19.0560, 72.8679], [19.0560, 72.8879], [19.0760, 72.8879], [19.0760, 72.8679], [19.0560, 72.8679]],
    'W006': [[19.2206, 72.8406], [19.2206, 72.8606], [19.2406, 72.8606], [19.2406, 72.8406], [19.2206, 72.8406]],
    'W007': [[19.1750, 72.8490], [19.1750, 72.8690], [19.1950, 72.8690], [19.1950, 72.8490], [19.1750, 72.8490]],
    'W008': [[18.9900, 72.8080], [18.9900, 72.8280], [19.0100, 72.8280], [19.0100, 72.8080], [18.9900, 72.8080]],
    'W009': [[19.0500, 72.8900], [19.0500, 72.9100], [19.0700, 72.9100], [19.0700, 72.8900], [19.0500, 72.8900]],
    'W010': [[19.1100, 72.8900], [19.1100, 72.9100], [19.1300, 72.9100], [19.1300, 72.8900], [19.1100, 72.8900]],
    'W011': [[19.0700, 72.9000], [19.0700, 72.9200], [19.0900, 72.9200], [19.0900, 72.9000], [19.0700, 72.9000]],
    'W012': [[19.0900, 72.9200], [19.0900, 72.9400], [19.1100, 72.9400], [19.1100, 72.9200], [19.0900, 72.9200]],
};

// Component to handle map updates and blinking
const MapController = ({ geoJsonData, blinkOpacity }) => {
    const map = useMap();
    const geoJsonLayerRef = useRef(null);

    useEffect(() => {
        if (geoJsonLayerRef.current && geoJsonData) {
            // Update layer styles for blinking effect
            geoJsonLayerRef.current.eachLayer((layer) => {
                const wpi = layer.feature.properties.wpi;
                const isCritical = wpi > 80;

                layer.setStyle({
                    fillOpacity: isCritical ? blinkOpacity : 0.65,
                });
            });
        }
    }, [blinkOpacity, geoJsonData]);

    return null;
};

const LiveWastePressureMap = ({
    wardsData = [],
    currentMode = 'normal',
    onWardSelect = () => { },
    selectedWardId = null
}) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [blinkOpacity, setBlinkOpacity] = useState(0.65);
    const geoJsonLayerRef = useRef(null);

    // Check if any ward is critical
    const hasCriticalWards = useMemo(() => {
        return wardsData.some(w => w.wpi > 80);
    }, [wardsData]);

    // Convert wards data to GeoJSON
    useEffect(() => {
        if (wardsData.length > 0) {
            const features = wardsData.map(ward => {
                const coords = wardPolygons[ward.id];
                if (!coords) return null;

                return {
                    type: 'Feature',
                    properties: {
                        ward_id: ward.id,
                        ward_name: ward.name,
                        zone: ward.zone,
                        wpi: ward.wpi || 50,
                        is_critical: ward.wpi > 80,
                        is_selected: ward.id === selectedWardId,
                        complaints: ward.complaints,
                        population: ward.population,
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [coords],
                    },
                };
            }).filter(Boolean);

            setGeoJsonData({
                type: 'FeatureCollection',
                features,
            });
        }
    }, [wardsData, selectedWardId]);

    // Blinking effect for critical wards
    useEffect(() => {
        if (!hasCriticalWards) {
            setBlinkOpacity(0.65);
            return;
        }

        const blinkInterval = setInterval(() => {
            setBlinkOpacity(prev => prev === 0.9 ? 0.3 : 0.9);
        }, 700);

        return () => clearInterval(blinkInterval);
    }, [hasCriticalWards]);

    // Style function for GeoJSON layer
    const styleFeature = (feature) => {
        const wpi = feature.properties.wpi;
        const isSelected = feature.properties.is_selected;
        const isCritical = feature.properties.is_critical;

        return {
            fillColor: getWPIColor(wpi),
            fillOpacity: isCritical ? blinkOpacity : 0.65,
            color: isSelected ? '#ffffff' : '#ffffff',
            weight: isSelected ? 3 : 1,
            opacity: 0.8,
        };
    };

    // Handle feature click
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: () => {
                const ward = wardsData.find(w => w.id === feature.properties.ward_id);
                if (ward) {
                    onWardSelect(ward);
                }
            },
            mouseover: (e) => {
                const layer = e.target;
                if (!feature.properties.is_selected) {
                    layer.setStyle({
                        weight: 2,
                        opacity: 1,
                    });
                }
            },
            mouseout: (e) => {
                const layer = e.target;
                if (!feature.properties.is_selected) {
                    layer.setStyle({
                        weight: 1,
                        opacity: 0.8,
                    });
                }
            },
        });

        // Bind popup with ward info
        layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm mb-1">${feature.properties.ward_name}</h3>
        <div class="text-xs text-gray-600 mb-2">${feature.properties.zone} Zone</div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-lg">WPI: ${feature.properties.wpi}</span>
          <span class="px-2 py-0.5 rounded text-xs font-semibold" style="background-color: ${getWPIColor(feature.properties.wpi)}; color: white;">
            ${feature.properties.wpi <= 30 ? 'Normal' : feature.properties.wpi <= 60 ? 'Medium' : feature.properties.wpi <= 80 ? 'High' : 'Critical'}
          </span>
        </div>
        <div class="text-xs mt-2">
          <div>Population: ${feature.properties.population?.toLocaleString()}</div>
          <div>Complaints: ${feature.properties.complaints}</div>
        </div>
      </div>
    `);
    };

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={MUMBAI_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                className="rounded-xl"
            >
                {/* Dark tile layer for control-room aesthetic */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* GeoJSON layer for ward polygons */}
                {geoJsonData && (
                    <GeoJSON
                        key={JSON.stringify(geoJsonData) + blinkOpacity}
                        data={geoJsonData}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                        ref={geoJsonLayerRef}
                    />
                )}

                <MapController geoJsonData={geoJsonData} blinkOpacity={blinkOpacity} />
            </MapContainer>

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 bg-secondary-900/90 backdrop-blur-sm p-3 rounded-lg text-white text-xs shadow-lg z-[1000]">
                <div className="font-semibold mb-2 text-secondary-100">WPI Legend</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#2ecc71' }}></div>
                        <span className="text-secondary-200">Normal (0-30)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#f1c40f' }}></div>
                        <span className="text-secondary-200">Medium (31-60)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#e67e22' }}></div>
                        <span className="text-secondary-200">High (61-80)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm animate-pulse" style={{ backgroundColor: '#e74c3c' }}></div>
                        <span className="text-secondary-200">Critical (81+)</span>
                    </div>
                </div>

                {hasCriticalWards && (
                    <div className="mt-2 pt-2 border-t border-secondary-700">
                        <div className="flex items-center gap-1 text-danger-400 text-[10px] font-semibold">
                            <div className="w-2 h-2 rounded-full bg-danger-500 animate-pulse"></div>
                            CRITICAL ZONES ACTIVE
                        </div>
                    </div>
                )}
            </div>

            {/* Stats overlay */}
            <div className="absolute top-4 right-4 bg-secondary-900/90 backdrop-blur-sm p-3 rounded-lg text-white text-xs shadow-lg z-[1000]">
                <div className="font-semibold mb-2 text-secondary-100">Live Stats</div>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-secondary-400">Total Wards:</span>
                        <span className="font-bold">{wardsData.length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-secondary-400">Critical:</span>
                        <span className="font-bold text-danger-400">{wardsData.filter(w => w.wpi > 80).length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-secondary-400">High:</span>
                        <span className="font-bold text-warning-400">{wardsData.filter(w => w.wpi > 60 && w.wpi <= 80).length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveWastePressureMap;
