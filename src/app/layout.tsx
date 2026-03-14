import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { VendorProvider } from "@/context/VendorContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Street Market Radar",
  description: "Real-time digital infrastructure for informal street economy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VendorProvider>
          {children}
        </VendorProvider>
      </body>
    </html>
  );
}
