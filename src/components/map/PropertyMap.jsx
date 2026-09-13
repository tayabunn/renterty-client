'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Home, ExternalLink, Sparkles } from 'lucide-react';

// Location lookup dictionary for common cities + deterministic hashing fallback
const CITY_COORDS = {
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
  'boston': [42.3601, -71.0589],
  'london': [51.5074, -0.1278],
  'toronto': [43.6532, -79.3832],
  'dhaka': [23.8103, 90.4125],
  'sydney': [-33.8688, 151.2093]
};

const getPropertyCoords = (property, index) => {
  const loc = (property.location || '').toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(key)) {
      // Deterministic slight offset for multiple properties in same city
      const jitterLat = ((index * 37) % 100 - 50) * 0.0012;
      const jitterLng = ((index * 53) % 100 - 50) * 0.0015;
      return [coords[0] + jitterLat, coords[1] + jitterLng];
    }
  }
  // Default to US center with dispersed jitter
  const baseLat = 39.8283 + (((index * 17) % 200) - 100) * 0.04;
  const baseLng = -98.5795 + (((index * 29) % 200) - 100) * 0.06;
  return [baseLat, baseLng];
};

export default function PropertyMap({ properties = [], selectedProperty = null, onSelectProperty }) {
  const [mounted, setMounted] = useState(false);
  const [LeafletMap, setLeafletMap] = useState(null);

  useEffect(() => {
    // Only import React-Leaflet on client
    let isCancelled = false;
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([L, ReactLeaflet]) => {
      if (isCancelled) return;

      // Fix standard marker icon issue in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      setLeafletMap({ L, ...ReactLeaflet });
      setMounted(true);
    }).catch(err => {
      console.error('Failed to load Leaflet:', err);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!mounted || !LeafletMap) {
    return (
      <div className="w-full h-full min-h-[450px] bg-slate-100 dark:bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center p-8 border border-slate-200 dark:border-slate-800 text-center animate-pulse">
        <MapPin className="w-10 h-10 text-emerald-500 mb-3 animate-bounce" />
        <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">Loading Interactive Map...</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Plotting rental properties & geo-locations</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletMap;

  // Calculate center from first property or default
  const defaultCenter = properties.length > 0 
    ? getPropertyCoords(properties[0], 0) 
    : [40.7128, -74.0060];

  return (
    <div className="w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={properties.length === 1 ? 13 : 5}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px]"
        style={{ minHeight: '450px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop, idx) => {
          const coords = getPropertyCoords(prop, idx);
          return (
            <Marker
              key={prop._id || idx}
              position={coords}
              eventHandlers={{
                click: () => onSelectProperty && onSelectProperty(prop)
              }}
            >
              <Popup className="custom-map-popup">
                <div className="p-1 max-w-[220px]">
                  {prop.images?.[0] && (
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>${prop.rent?.toLocaleString()}/{prop.rentType === 'Daily' ? 'day' : 'mo'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {prop.propertyType}
                    </span>
                  </div>
                  <h4 className="font-medium text-xs text-slate-900 dark:text-slate-100 line-clamp-1 mt-1">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    {prop.location}
                  </p>
                  <Link
                    href={`/properties/${prop._id}`}
                    className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium rounded-md transition-colors shadow-sm"
                  >
                    View Listing <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend & Stats Overlay */}
      <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg text-xs z-[1000] flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {properties.length} Properties Plotted
        </span>
      </div>
    </div>
  );
}
