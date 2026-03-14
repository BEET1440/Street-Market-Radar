import React from 'react';
import Link from 'next/link';
import { MapPin, ShoppingBag, Store, Navigation } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Street Market Radar
        </p>
      </div>

      <div className="relative flex place-items-center flex-col gap-8">
        <h1 className="text-6xl font-bold text-primary-600 text-center">
          Empowering the Street Economy
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          Locate nearby vendors in real-time or register your mobile business to reach more customers.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/buyer"
            className="flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-700 transition-colors"
          >
            <ShoppingBag size={24} />
            Find Vendors
          </Link>
          <Link 
            href="/vendor"
            className="flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-full font-bold hover:bg-primary-50 transition-colors"
          >
            <Store size={24} />
            Vendor Portal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-16">
        <FeatureCard 
          icon={<MapPin className="text-primary-600" />}
          title="Real-time Mapping"
          description="See exactly where vendors are moving in your neighborhood."
        />
        <FeatureCard 
          icon={<Navigation className="text-primary-600" />}
          title="Smart Discovery"
          description="Get notified when your favorite vendors are nearby."
        />
        <FeatureCard 
          icon={<Store className="text-primary-600" />}
          title="Vendor Tools"
          description="Manage your inventory and see demand hotspots."
        />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow bg-white">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
