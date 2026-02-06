import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { selectWard as selectWardAction } from '../../store/slices/waste/wasteSlice';
import { getWPILevel, getWPIThresholds } from '../../utils/helpers';

const WardMap = ({ wards, currentMode, highlightedWardIds = [], selectedWardId }) => {
  const dispatch = useDispatch();

  const normalizedWards = useMemo(() => {
    if (!wards || wards.length === 0) return [];

    const lats = wards.map((w) => w.coordinates.lat);
    const lngs = wards.map((w) => w.coordinates.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    return wards.map((ward) => {
      const x = ((ward.coordinates.lng - minLng) / lngRange) * 100;
      const y = 100 - ((ward.coordinates.lat - minLat) / latRange) * 100;
      return { ...ward, mapX: x, mapY: y };
    });
  }, [wards]);

  const zones = useMemo(() => {
    return normalizedWards.reduce((acc, ward) => {
      if (!acc[ward.zone]) acc[ward.zone] = [];
      acc[ward.zone].push(ward);
      return acc;
    }, {});
  }, [normalizedWards]);

  const zoneOverlays = useMemo(() => {
    return Object.entries(zones).map(([zoneName, zoneWards]) => {
      const avgWpi =
        zoneWards.reduce((sum, ward) => sum + ward.wpi, 0) / zoneWards.length;
      const level = getWPILevel(avgWpi, currentMode).level;
      const center = {
        x: zoneWards.reduce((sum, ward) => sum + ward.mapX, 0) / zoneWards.length,
        y: zoneWards.reduce((sum, ward) => sum + ward.mapY, 0) / zoneWards.length,
      };

      const points = zoneWards
        .map((ward) => ({ x: ward.mapX, y: ward.mapY }))
        .sort(
          (a, b) =>
            Math.atan2(a.y - center.y, a.x - center.x) -
            Math.atan2(b.y - center.y, b.x - center.x)
        );

      const hasHighlight = zoneWards.some((ward) =>
        highlightedWardIds.includes(ward.id)
      );

      return {
        zoneName,
        level,
        center,
        points,
        hasHighlight,
        radius: 14 + zoneWards.length * 2,
      };
    });
  }, [zones, highlightedWardIds, currentMode]);

  const handleWardClick = (ward) => {
    dispatch(selectWardAction(ward));
  };

  const thresholds = getWPIThresholds(currentMode);

  return (
    <div className="relative w-full h-full bg-secondary-50">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="btn btn-secondary btn-sm shadow-lg">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button className="btn btn-secondary btn-sm shadow-lg">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button className="btn btn-secondary btn-sm shadow-lg">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 card p-3 shadow-lg">
        <p className="text-xs font-semibold text-secondary-700 mb-2">
          Waste Pressure Index
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-500 animate-critical-pulse"></div>
            <span className="text-xs text-secondary-600">
              Critical ({thresholds.high}+)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-secondary-600">
              High ({thresholds.medium}-{thresholds.high - 1})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <span className="text-xs text-secondary-600">
              Medium ({thresholds.low}-{thresholds.medium - 1})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
            <span className="text-xs text-secondary-600">
              Normal (0-{thresholds.low - 1})
            </span>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="w-full h-full flex items-center justify-center p-6">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mapGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
            <clipPath id="mumbaiClip">
              <path d="M12 10 L78 14 L90 34 L84 62 L72 88 L42 96 L22 84 L10 60 L6 32 Z" />
            </clipPath>
          </defs>

          <rect width="100" height="100" fill="url(#mapGradient)" />
          <rect width="100" height="100" fill="url(#grid)" />

          <g clipPath="url(#mumbaiClip)">
            {zoneOverlays.map((zone) => {
              if (zone.points.length < 3) {
                return (
                  <circle
                    key={zone.zoneName}
                    cx={zone.center.x}
                    cy={zone.center.y}
                    r={zone.radius}
                    className={`zone-overlay zone-${zone.level} ${zone.hasHighlight ? 'zone-highlight' : ''}`}
                  />
                );
              }

              const pointsString = zone.points
                .map((point) => `${point.x},${point.y}`)
                .join(' ');

              return (
                <polygon
                  key={zone.zoneName}
                  points={pointsString}
                  className={`zone-overlay zone-${zone.level} ${zone.hasHighlight ? 'zone-highlight' : ''}`}
                />
              );
            })}

            {zoneOverlays.map((zone) => (
              <text
                key={`${zone.zoneName}-label`}
                x={zone.center.x}
                y={zone.center.y}
                textAnchor="middle"
                className="zone-label"
              >
                {zone.zoneName}
              </text>
            ))}

            {normalizedWards.map((ward) => {
              const isSelected = selectedWardId === ward.id;
              const wpiLevel = getWPILevel(ward.wpi, currentMode).level;
              const isHighlighted = highlightedWardIds.includes(ward.id);

              return (
                <g
                  key={ward.id}
                  onClick={() => handleWardClick(ward)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={ward.mapX}
                    cy={ward.mapY}
                    r={isSelected ? 2.8 : 2.2}
                    className={`ward-marker wpi-${wpiLevel} ${isHighlighted ? 'ward-highlight' : ''} ${
                      wpiLevel === 'critical' ? 'ward-critical' : ''
                    }`}
                  />
                  {isSelected && (
                    <>
                      <text
                        x={ward.mapX}
                        y={ward.mapY - 4}
                        textAnchor="middle"
                        className="map-label"
                      >
                        {ward.name}
                      </text>
                      <text
                        x={ward.mapX}
                        y={ward.mapY - 1.2}
                        textAnchor="middle"
                        className="map-sub-label"
                      >
                        WPI {ward.wpi}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </g>

          <path
            d="M12 10 L78 14 L90 34 L84 62 L72 88 L42 96 L22 84 L10 60 L6 32 Z"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 card p-4 shadow-lg max-w-md">
        <div className="flex items-center gap-2 text-secondary-600 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Click on a zone marker to open the decision panel</span>
        </div>
      </div>
    </div>
  );
};

export default WardMap;
