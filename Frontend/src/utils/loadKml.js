import { kml } from '@mapbox/togeojson';

export const loadKmlAsGeoJson = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch KML: ${response.statusText}`);
        }
        const kmlText = await response.text();
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
        const geoJson = kml(kmlDoc);
        return geoJson;
    } catch (error) {
        console.error('Error loading KML:', error);
        return { type: 'FeatureCollection', features: [] };
    }
};
