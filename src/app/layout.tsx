import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What to Wear - Smart Packing Lists",
  description: "Get personalized packing lists based on live weather data for your destination. No more overpacking or underpacking.",
  keywords: "packing list, travel, weather, clothing, trip planning",
  authors: [{ name: "What to Wear" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
