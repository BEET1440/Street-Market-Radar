'use client';

import React, { useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import Link from 'next/link';
import { Search, MapPin, List, Navigation2, ShoppingBasket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useVendors } from '@/context/VendorContext';
import { useBlockchain } from '@/context/BlockchainContext';

export default function BuyerPage() {
  const { vendors } = useVendors();
  const { isConnected, account, connectWallet } = useBlockchain();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);

  const filteredVendors = vendors.filter(v => 
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    v.isLive
  );

  const handleViewOnMap = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(16);
    setViewMode('map');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-primary-600 hidden sm:block">Street Market Radar</h1>
        </div>
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button 
              onClick={connectWallet}
              className="hidden md:flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors"
            >
              <ShieldCheck size={20} />
              Verify on Chain
            </button>
          ) : (
            <div className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">On-Chain Verified</span>
            </div>
          )}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
            >
              <MapPin size={18} />
              Map
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
            >
              <List size={18} />
              List
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex">
        {/* Sidebar / Filter Section */}
        <aside className="w-80 bg-white border-r border-gray-200 p-4 hidden lg:flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Vendors</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg">Nearby Vendors</h2>
            {filteredVendors.map(vendor => (
              <div 
                key={vendor.id} 
                onClick={() => handleViewOnMap(vendor.lat, vendor.lng)}
                className="p-4 border border-gray-100 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold group-hover:text-primary-700 transition-colors">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.type}</p>
                  </div>
                  <div className="bg-primary-100 text-primary-700 p-2 rounded-lg">
                    <Navigation2 size={16} />
                  </div>
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {vendor.goods.map(g => (
                    <span key={g} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{g}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* View Content */}
        <div className="flex-1 relative bg-gray-100">
          {viewMode === 'map' ? (
            <div className="h-full w-full">
              <MapWrapper vendors={filteredVendors} center={mapCenter} zoom={mapZoom} />
            </div>
          ) : (
            <div className="h-full w-full p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <VendorCard 
                  key={vendor.id} 
                  vendor={vendor} 
                  onViewOnMap={() => handleViewOnMap(vendor.lat, vendor.lng)} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function VendorCard({ vendor, onViewOnMap }: { vendor: any, onViewOnMap: () => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
          <ShoppingBasket size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold">{vendor.name}</h3>
          <p className="text-gray-500 font-medium">{vendor.type}</p>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Available Today</p>
        <div className="flex gap-2 flex-wrap">
          {vendor.goods.map((g: string) => (
            <span key={g} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{g}</span>
          ))}
        </div>
      </div>
      <button 
        onClick={onViewOnMap}
        className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors"
      >
        View on Map
      </button>
    </div>
  );
}
