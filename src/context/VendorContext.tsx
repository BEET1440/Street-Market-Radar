'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Vendor {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  goods: string[];
  isLive: boolean;
}

interface VendorContextType {
  vendors: Vendor[];
  updateVendorLocation: (id: string, lat: number, lng: number) => void;
  setVendorStatus: (id: string, isLive: boolean) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

const initialVendors: Vendor[] = [
  { id: '1', name: 'Joe\'s Fresh Produce', type: 'Vegetables', lat: 51.505, lng: -0.09, goods: ['Carrots', 'Tomatoes', 'Onions'], isLive: true },
  { id: '2', name: 'Maria\'s Tacos', type: 'Street Food', lat: 51.51, lng: -0.1, goods: ['Tacos', 'Burritos', 'Churros'], isLive: true },
  { id: '3', name: 'The Flower Cart', type: 'Flowers', lat: 51.49, lng: -0.08, goods: ['Roses', 'Sunflowers', 'Lilies'], isLive: true },
];

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smr_vendors');
    if (saved) {
      try {
        setVendors(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved vendors', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever vendors change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('smr_vendors', JSON.stringify(vendors));
    }
  }, [vendors, isInitialized]);

  const updateVendorLocation = (id: string, lat: number, lng: number) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, lat, lng } : v));
  };

  const setVendorStatus = (id: string, isLive: boolean) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, isLive } : v));
  };

  // Mock movement for demonstration (only for other vendors)
  useEffect(() => {
    const interval = setInterval(() => {
      setVendors(prev => prev.map(v => {
        // Don't mock move the "current" vendor (ID: '1') to avoid conflict with GPS
        if (!v.isLive || v.id === '1') return v;
        return {
          ...v,
          lat: v.lat + (Math.random() - 0.5) * 0.0005,
          lng: v.lng + (Math.random() - 0.5) * 0.0005,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <VendorContext.Provider value={{ vendors, updateVendorLocation, setVendorStatus }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendors() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendors must be used within a VendorProvider');
  }
  return context;
}
