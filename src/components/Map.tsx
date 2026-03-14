'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { Vendor } from '@/context/VendorContext';

interface MapProps {
  vendors: Vendor[];
  center?: [number, number];
  zoom?: number;
}

// Component to handle map centering
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Map({ vendors, center = [51.505, -0.09], zoom = 13 }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize icon to avoid recreation on every render and ensure it's only created on client
  const DefaultIcon = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, []);

  if (!isMounted || !DefaultIcon) return null;

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200"
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vendors.map((vendor) => (
        <Marker 
          key={vendor.id} 
          position={[vendor.lat, vendor.lng]}
          icon={DefaultIcon}
        >
          <Popup>
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-lg text-primary-700">{vendor.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{vendor.type}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {vendor.goods.map(g => (
                  <span key={g} className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{g}</span>
                ))}
              </div>
              <button className="w-full bg-primary-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors">
                Contact Vendor
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
