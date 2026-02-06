
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getWPILevel } from '../../utils/helpers';

// Fix for Leaflet marker icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map when wards change
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapComponent = ({ wards, currentMode, onWardSelect, selectedWardId }) => {
    const mumbaiCenter = [19.0760, 72.8777];

    const getColor = (level) => {
        switch (level) {
            case 'low': return '#10b981'; // success
            case 'medium': return '#f59e0b'; // warning
            case 'high': return '#f97316'; // orange
            case 'critical': return '#ef4444'; // danger
            default: return '#64748b';
        }
    };

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-secondary-200">
            <MapContainer
                center={mumbaiCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater center={mumbaiCenter} zoom={11} />

                {wards.map((ward) => {
                    const wpiData = getWPILevel(ward.wpi, currentMode);
                    const { level } = wpiData;
                    const isCritical = level === 'critical';
                    const isSelected = selectedWardId === ward.id;

                    return (
                        <CircleMarker
                            key={ward.id}
                            center={[ward.coordinates.lat, ward.coordinates.lng]}
                            radius={isSelected ? 10 : 8}
                            pathOptions={{
                                color: 'white',
                                weight: 2,
                                fillColor: getColor(level),
                                fillOpacity: 0.8,
                                className: isCritical ? 'animate-critical-pulse' : ''
                            }}
                            eventHandlers={{
                                click: () => onWardSelect(ward),
                            }}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-sm">{ward.name}</h3>
                                    <div className="text-xs text-secondary-600 mb-1">{ward.zone} Zone</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-bold text-lg">{ward.wpi}</span>
                                        <span className={`badge badge-${wpiData.color} text-xs`}>
                                            {wpiData.label}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
