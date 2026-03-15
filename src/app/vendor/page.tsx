'use client';

import Link from 'next/link';
import { MapPin, Navigation, Store, Package, Plus, Trash2, Save, Send, ArrowLeft, Wallet } from 'lucide-react';
import { useVendors } from '@/context/VendorContext';
import { useBlockchain } from '@/context/BlockchainContext';

export default function VendorDashboard() {
  const { vendors, updateVendorLocation, setVendorStatus } = useVendors();
  const { isConnected, account, connectWallet, registerVendorOnChain, updateLocationOnChain } = useBlockchain();
  const [isLive, setIsLive] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [location, setLocation] = useState<[number, number]>([51.505, -0.09]);

  // Sync initial status once
  useEffect(() => {
    const me = vendors.find(v => v.id === '1');
    if (me) {
      setIsLive(me.isLive);
      if (me.lat && me.lng) {
        setLocation([me.lat, me.lng]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [items, setItems] = useState([
    { id: '1', name: 'Carrots', price: '2.00', unit: 'kg' },
    { id: '2', name: 'Tomatoes', price: '3.50', unit: 'kg' },
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '', unit: 'kg' });

  useEffect(() => {
    if (isLive && "geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setLocation([newLat, newLng]);
          updateVendorLocation('1', newLat, newLng);
          // Only update on-chain if location changes significantly
          updateLocationOnChain(newLat, newLng);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLive, updateVendorLocation]);

  const handleToggleLive = async () => {
    const newStatus = !isLive;
    if (newStatus && isConnected) {
      setIsRegistering(true);
      try {
        await registerVendorOnChain("Joe's Fresh Produce", "Vegetables");
        setIsLive(true);
        setVendorStatus('1', true);
      } catch (err) {
        console.error("Failed to register on chain:", err);
      } finally {
        setIsRegistering(false);
      }
    } else {
      setIsLive(newStatus);
      setVendorStatus('1', newStatus);
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now().toString() }]);
      setNewItem({ name: '', price: '', unit: 'kg' });
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Vendor Header */}
      <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
              <Store size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Vendor Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your mobile shop</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          ) : (
            <div className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
            </div>
          )}
          <button 
            onClick={handleToggleLive}
            disabled={isRegistering}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${isLive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary-600 text-white hover:bg-primary-700'} ${isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRegistering ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLive ? (
              <Navigation size={20} className="animate-pulse" />
            ) : (
              <Send size={20} />
            )}
            {isRegistering ? 'REGISTERING...' : isLive ? 'GO OFFLINE' : 'GO LIVE'}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Location */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-primary-600" size={20} />
              Live Status
            </h2>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Location</p>
                <p className="text-sm font-mono text-gray-700">
                  {location ? `${location[0].toFixed(4)}, ${location[1].toFixed(4)}` : 'Location not set'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nearby Demand</p>
                <p className="text-sm font-medium text-primary-600">Moderate (12 potential buyers)</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-600 p-6 rounded-3xl shadow-lg text-white">
            <h2 className="text-lg font-bold mb-2">Vendor Tips</h2>
            <p className="text-sm opacity-90">Demand is high near "Central Park" right now. Head there to increase sales!</p>
          </div>
        </div>

        {/* Right Column: Inventory Management */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package className="text-primary-600" size={20} />
                Live Inventory
              </h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} Items</span>
            </div>

            {/* Item List */}
            <div className="flex flex-col gap-3 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price} / {item.unit}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="p-6 bg-primary-50 rounded-3xl border-2 border-dashed border-primary-200">
              <h3 className="font-bold text-primary-700 mb-4 flex items-center gap-2">
                <Plus size={18} />
                Quick Add Item
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Item Name" 
                  className="p-3 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 shadow-sm"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Price" 
                    className="flex-1 p-3 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 shadow-sm"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  />
                  <select 
                    className="p-3 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 shadow-sm"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="unit">unit</option>
                    <option value="bunch">bunch</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleAddItem}
                className="w-full mt-4 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-md"
              >
                Add to Live Menu
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
