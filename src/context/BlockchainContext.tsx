'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  registerVendorOnChain: (name: string, vendorType: string) => Promise<void>;
  updateLocationOnChain: (lat: number, lng: number) => Promise<void>;
  isMock: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMock, setIsMock] = useState(true);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            setIsMock(false);
          }
        } catch (err) {
          console.error("Connection check failed:", err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        setIsMock(false);
        console.log("Wallet connected:", accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Failed to connect wallet. Using mock mode.");
      }
    } else {
      alert("No Web3 provider found. Please install MetaMask. Running in mock mode for now.");
    }
  };

  const registerVendorOnChain = async (name: string, vendorType: string) => {
    console.log(`[Blockchain] Registering vendor ${name} (${vendorType})`);
    if (!isMock) {
      // Logic for real contract call would go here
      // const contract = new ethers.Contract(address, abi, signer);
      // await contract.registerVendor(name, vendorType);
    }
    // Simulate chain delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const updateLocationOnChain = async (lat: number, lng: number) => {
    console.log(`[Blockchain] Updating location to ${lat}, ${lng}`);
    if (!isMock) {
      // const contract = new ethers.Contract(address, abi, signer);
      // await contract.updateLocation(Math.floor(lat * 1000000), Math.floor(lng * 1000000));
    }
  };

  return (
    <BlockchainContext.Provider value={{ 
      account, 
      isConnected, 
      connectWallet, 
      registerVendorOnChain, 
      updateLocationOnChain,
      isMock 
    }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
