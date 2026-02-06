import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { selectWard as selectWardAction } from '../../store/slices/waste/wasteSlice';
import { getWPILevel } from '../../utils/helpers';

const WardMap = ({ wards }) => {
  const dispatch = useDispatch();
  const [selectedWardId, setSelectedWardId] = useState(null);

  // Mumbai center coordinates
  const centerLat = 19.0760;
  const centerLng = 72.8777;

  const handleWardClick = (ward) => {
    setSelectedWardId(ward.id);
    dispatch(selectWardAction(ward));
  };

  const getMarkerColor = (wpi) => {
    const level = getWPILevel(wpi);
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#fb923c',
      critical: '#ef4444'
    };
    return colors[level.level];
  };

  // Calculate bounds
  const lats = wards.map(w => w.coordinates.lat);
  const lngs = wards.map(w => w.coordinates.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return (
    <div className="relative w-full h-full bg-secondary-50 dark:bg-secondary-900">
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
        <p className="text-xs font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
          Waste Pressure Index
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-500"></div>
            <span className="text-xs text-secondary-600 dark:text-secondary-400">Critical (90+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-secondary-600 dark:text-secondary-400">High (75-89)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <span className="text-xs text-secondary-600 dark:text-secondary-400">Medium (60-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
            <span className="text-xs text-secondary-600 dark:text-secondary-400">Low (0-59)</span>
          </div>
        </div>
      </div>

      {/* Simplified Map View */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <svg 
          viewBox={`${minLng - 0.1} ${minLat - 0.1} ${maxLng - minLng + 0.2} ${maxLat - minLat + 0.2}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Mumbai outline (simplified) */}
          <path
            d={`M ${minLng} ${minLat} L ${maxLng} ${minLat} L ${maxLng} ${maxLat} L ${minLng} ${maxLat} Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.002"
            className="text-secondary-300 dark:text-secondary-600"
          />

          {/* Ward Markers */}
          {wards.map((ward) => {
            const isSelected = selectedWardId === ward.id;
            const markerColor = getMarkerColor(ward.wpi);
            const size = isSelected ? 0.015 : 0.01;

            return (
              <g 
                key={ward.id}
                onClick={() => handleWardClick(ward)}
                className="cursor-pointer transition-all"
                style={{ transformOrigin: `${ward.coordinates.lng}px ${ward.coordinates.lat}px` }}
              >
                {/* Marker Circle */}
                <circle
                  cx={ward.coordinates.lng}
                  cy={ward.coordinates.lat}
                  r={size}
                  fill={markerColor}
                  stroke="white"
                  strokeWidth={isSelected ? 0.003 : 0.002}
                  className="transition-all hover:scale-150"
                  opacity={isSelected ? 1 : 0.9}
                />
                
                {/* WPI Label */}
                {isSelected && (
                  <>
                    <text
                      x={ward.coordinates.lng}
                      y={ward.coordinates.lat - size - 0.01}
                      textAnchor="middle"
                      className="text-[0.015px] font-bold fill-secondary-900 dark:fill-secondary-50"
                      style={{ fontSize: '0.015px' }}
                    >
                      {ward.name}
                    </text>
                    <text
                      x={ward.coordinates.lng}
                      y={ward.coordinates.lat - size - 0.005}
                      textAnchor="middle"
                      className="text-[0.012px] fill-secondary-600 dark:fill-secondary-400"
                      style={{ fontSize: '0.012px' }}
                    >
                      WPI: {ward.wpi}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 card p-4 shadow-lg max-w-md">
        <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Click on any ward marker to view details</span>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 card p-3 shadow-lg">
        <p className="text-xs text-secondary-600 dark:text-secondary-400 text-center">
          Interactive map with real-time ward monitoring
          <br />
          <span className="text-info-600 dark:text-info-400 font-medium">
            Integration-ready for Mapbox/Google Maps
          </span>
        </p>
      </div>
    </div>
  );
};

export default WardMap;
