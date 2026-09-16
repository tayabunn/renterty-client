'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Sparkles, Loader2 } from 'lucide-react';

const CITY_COORDS = {
  'palm springs': [33.8303, -116.5453],
  'philadelphia': [39.9526, -75.1652],
  'nashville': [36.1627, -86.7816],
  'aspen': [39.1911, -106.8175],
  'new york': [40.7128, -74.0060],
  'nyc': [40.7128, -74.0060],
  'manhattan': [40.7831, -73.9712],
  'brooklyn': [40.6782, -73.9442],
  'queens': [40.7282, -73.7949],
  'los angeles': [34.0522, -118.2437],
  'la': [34.0522, -118.2437],
  'san francisco': [37.7749, -122.4194],
  'sf': [37.7749, -122.4194],
  'chicago': [41.8781, -87.6298],
  'miami': [25.7617, -80.1918],
  'austin': [30.2672, -97.7431],
  'seattle': [47.6062, -122.3321],
  'denver': [39.7392, -104.9903],
  'boston': [42.3601, -71.0589],
  'dallas': [32.7767, -96.7970],
  'houston': [29.7604, -95.3698],
  'las vegas': [36.1699, -115.1398],
  'phoenix': [33.4484, -112.0740],
  'san diego': [32.7157, -117.1611],
  'portland': [45.5152, -122.6784],
  'atlanta': [33.7490, -84.3880],
  'london': [51.5074, -0.1278],
  'toronto': [43.6532, -79.3832],
  'dhaka': [23.8103, 90.4125],
  'sydney': [-33.8688, 151.2093]
};

const getPropertyCoords = (property, index) => {
  const loc = (property.location || '').toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(key)) {
      const jitterLat = ((index * 37) % 100 - 50) * 0.0015;
      const jitterLng = ((index * 53) % 100 - 50) * 0.0018;
      return [coords[0] + jitterLat, coords[1] + jitterLng];
    }
  }
  const baseLat = 38.5 + (((index * 19) % 200) - 100) * 0.04;
  const baseLng = -98.0 + (((index * 31) % 200) - 100) * 0.06;
  return [baseLat, baseLng];
};

const formatPriceBadge = (price) => {
  if (!price) return '$0';
  if (price >= 1000) {
    const k = (price / 1000).toFixed(price % 1000 === 0 ? 0 : 1);
    return `$${k}k`;
  }
  return `$${price}`;
};

export default function PropertyMap({ properties = [], selectedProperty = null, onSelectProperty }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersMapRef = useRef(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [LInstance, setLInstance] = useState(null);

  // 1. Client-side Leaflet Initialization
  useEffect(() => {
    let isMounted = true;
    let timer = null;
    let resizeObserver = null;

    const initLeaflet = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!isMounted || !mapContainerRef.current) return;

        const container = mapContainerRef.current;
        if (container._leaflet_id) {
          container.innerHTML = '';
          delete container._leaflet_id;
        }

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        });

        const map = L.map(container, {
          center: [39.5, -98.35],
          zoom: 4,
          zoomControl: true,
          scrollWheelZoom: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
        setLInstance(L);
        setMapReady(true);

        resizeObserver = new ResizeObserver(() => {
          if (map && container.isConnected) {
            try {
              map.invalidateSize();
            } catch (e) {}
          }
        });
        resizeObserver.observe(container);

        timer = setTimeout(() => {
          if (map && container.isConnected) {
            try {
              map.invalidateSize();
            } catch (e) {}
          }
        }, 200);
      } catch (err) {
        console.error('Failed to initialize Leaflet map:', err);
      }
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render Markers on Properties Change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersLayerRef.current || !LInstance) return;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const L = LInstance;

    markersLayer.clearLayers();
    markersMapRef.current.clear();

    const bounds = L.latLngBounds([]);

    properties.forEach((prop, idx) => {
      const coords = getPropertyCoords(prop, idx);
      bounds.extend(coords);

      const isSelected = selectedProperty?._id === prop._id;
      const priceText = formatPriceBadge(prop.rent);

      const customIcon = L.divIcon({
        className: 'custom-property-pin-wrapper',
        html: `
          <div class="custom-map-pill ${isSelected ? 'selected' : ''}">
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [64, 30],
        iconAnchor: [32, 15],
        popupAnchor: [0, -16]
      });

      const popupHtml = `
        <div style="width: 230px; font-family: inherit; padding: 2px;">
          ${
            prop.images?.[0]
              ? `<img src="${prop.images[0]}" alt="${prop.title || 'Property'}" style="width: 100%; height: 115px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />`
              : ''
          }
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 14px; color: #0d9488;">
              $${(prop.rent || 0).toLocaleString()}<span style="font-size: 10px; font-weight: 500; color: #64748b;">/${prop.rentType || 'mo'}</span>
            </span>
            <span style="font-size: 10px; font-weight: 700; background: rgba(13, 148, 136, 0.1); color: #0d9488; padding: 2px 6px; border-radius: 6px;">
              ${prop.propertyType || 'Rental'}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${prop.title || 'Property'}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            📍 ${prop.location || 'Location'}
          </p>
          <div style="display: flex; gap: 8px; font-size: 10px; color: #64748b; margin-bottom: 8px; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            <span>🛏️ ${prop.bedrooms || 1} bd</span>
            <span>🚿 ${prop.bathrooms || 1} ba</span>
          </div>
          <a href="/properties/${prop._id}" style="display: block; text-align: center; background: #0d9488; color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
            View Details &rarr;
          </a>
        </div>
      `;

      const marker = L.marker(coords, { icon: customIcon }).addTo(markersLayer);
      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -10],
        maxWidth: 270
      });

      marker.on('click', () => {
        if (onSelectProperty) onSelectProperty(prop);
      });

      markersMapRef.current.set(prop._id, marker);
    });

    if (properties.length > 0 && bounds.isValid()) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } catch (e) {}
    }
  }, [properties, mapReady, LInstance]);

  // 3. React to selectedProperty (Fly to Marker & Open Popup)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !selectedProperty) return;
    const map = mapInstanceRef.current;
    const marker = markersMapRef.current.get(selectedProperty._id);
    if (marker) {
      try {
        const latLng = marker.getLatLng();
        map.flyTo(latLng, 14, { duration: 1.0 });
        marker.openPopup();
      } catch (e) {}
    }
  }, [selectedProperty, mapReady]);

  // 4. Fit All Markers
  const handleResetView = () => {
    if (!mapReady || !mapInstanceRef.current || !LInstance || properties.length === 0) return;
    const map = mapInstanceRef.current;
    const L = LInstance;
    const bounds = L.latLngBounds([]);
    properties.forEach((p, idx) => bounds.extend(getPropertyCoords(p, idx)));
    if (bounds.isValid()) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-full h-full min-h-[650px] lg:min-h-[720px] flex-1 flex flex-col bg-slate-100 dark:bg-zinc-900 overflow-hidden">
      {/* Loading Overlay */}
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 dark:bg-zinc-900 p-8 text-center animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
            Loading Interactive Map...
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Plotting verified rental properties & live geolocations
          </p>
        </div>
      )}

      {/* Map DOM Element */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[650px] lg:min-h-[720px] flex-1 z-0"
        style={{ width: '100%', height: '100%', minHeight: '650px' }}
      />

      {/* Floating Controls Badge */}
      {mapReady && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 animate-in fade-in duration-300">
          <button
            type="button"
            onClick={handleResetView}
            className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-md text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/50 transition-all cursor-pointer flex items-center gap-1.5"
            title="Fit all properties on map"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-600" />
            <span>Fit All</span>
          </button>

          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-md text-xs font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>{properties.length} Properties Plotted</span>
          </div>
        </div>
      )}
    </div>
  );
}
