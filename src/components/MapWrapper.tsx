'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl animate-pulse">
      <p className="text-gray-400 font-medium">Loading map...</p>
    </div>
  ),
  ssr: false,
});

export default function MapWrapper({ vendors, center, zoom }: any) {
  return <Map vendors={vendors} center={center} zoom={zoom} />;
}
