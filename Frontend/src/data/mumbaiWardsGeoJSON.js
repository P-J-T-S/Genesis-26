// Mumbai Wards GeoJSON Data
// This contains approximate polygon boundaries for Mumbai's administrative wards
// WPI values are dynamically assigned from the demo data

export const MUMBAI_CENTER = {
    latitude: 19.0760,
    longitude: 72.8777,
    zoom: 11
};

// Ward polygon geometries (simplified boundaries for each ward)
export const wardPolygons = {
    'W001': { // Colaba
        coordinates: [[[72.8047, 18.8967], [72.8247, 18.8967], [72.8247, 18.9167], [72.8047, 18.9167], [72.8047, 18.8967]]],
    },
    'W002': { // Bandra West
        coordinates: [[[72.8195, 19.0496], [72.8395, 19.0496], [72.8395, 19.0696], [72.8195, 19.0696], [72.8195, 19.0496]]],
    },
    'W003': { // Andheri East
        coordinates: [[[72.8597, 19.1036], [72.8797, 19.1036], [72.8797, 19.1236], [72.8597, 19.1236], [72.8597, 19.1036]]],
    },
    'W004': { // Dadar
        coordinates: [[[72.8340, 19.0078], [72.8540, 19.0078], [72.8540, 19.0278], [72.8340, 19.0278], [72.8340, 19.0078]]],
    },
    'W005': { // Kurla West
        coordinates: [[[72.8679, 19.0560], [72.8879, 19.0560], [72.8879, 19.0760], [72.8679, 19.0760], [72.8679, 19.0560]]],
    },
    'W006': { // Borivali West
        coordinates: [[[72.8406, 19.2206], [72.8606, 19.2206], [72.8606, 19.2406], [72.8406, 19.2406], [72.8406, 19.2206]]],
    },
    'W007': { // Malad East
        coordinates: [[[72.8490, 19.1750], [72.8690, 19.1750], [72.8690, 19.1950], [72.8490, 19.1950], [72.8490, 19.1750]]],
    },
    'W008': { // Worli
        coordinates: [[[72.8080, 18.9900], [72.8280, 18.9900], [72.8280, 19.0100], [72.8080, 19.0100], [72.8080, 18.9900]]],
    },
    'W009': { // Chembur
        coordinates: [[[72.8900, 19.0500], [72.9100, 19.0500], [72.9100, 19.0700], [72.8900, 19.0700], [72.8900, 19.0500]]],
    },
    'W010': { // Powai
        coordinates: [[[72.8900, 19.1100], [72.9100, 19.1100], [72.9100, 19.1300], [72.8900, 19.1300], [72.8900, 19.1100]]],
    },
    'W011': { // Ghatkopar East
        coordinates: [[[72.9000, 19.0700], [72.9200, 19.0700], [72.9200, 19.0900], [72.9000, 19.0900], [72.9000, 19.0700]]],
    },
    'W012': { // Vikhroli
        coordinates: [[[72.9200, 19.0900], [72.9400, 19.0900], [72.9400, 19.1100], [72.9200, 19.1100], [72.9200, 19.0900]]],
    },
};

// Convert wards data to GeoJSON format with WPI values
export const createWardGeoJSON = (wardsData, mode) => {
    const features = wardsData.map(ward => {
        const polygon = wardPolygons[ward.id];
        if (!polygon) return null;

        return {
            type: 'Feature',
            properties: {
                ward_id: ward.id,
                ward_name: ward.name,
                zone: ward.zone,
                wpi: ward.wpi || 50, // Default WPI if not calculated
                population: ward.population,
                complaints: ward.complaints,
            },
            geometry: {
                type: 'Polygon',
                coordinates: polygon.coordinates,
            },
        };
    }).filter(Boolean);

    return {
        type: 'FeatureCollection',
        features,
    };
};

// API simulation for live WPI data
export const fetchLiveWPI = async (wardsData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return createWardGeoJSON(wardsData);
};
