import type { Metadata } from "next";
import { DM_Serif_Display, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sous Chef",
  description: "AI Recipe Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${spaceMono.variable} ${inter.variable} antialiased relative min-h-screen`}>
        
        {/* 1. The Warm Blob (Top Right) */}
        <div className="fixed -top-[20%] -right-[20%] blob-warm" />

        {/* 2. The Cool Blob (Bottom Left) */}
        <div className="fixed -bottom-[20%] -left-[20%] blob-cool" />

        {/* 3. The Noise Texture */}
        <div className="bg-noise" />

        {/* 4. The Content */}
        <div className="relative z-10">
          {children}
        </div>

      </body>
    </html>
  );
}