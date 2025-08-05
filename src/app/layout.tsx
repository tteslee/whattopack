import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "What to Pack - Smart Packing Lists",
  description: "Get personalized packing lists based on live weather data for your destination. No more overpacking or underpacking.",
  keywords: "packing list, travel, weather, clothing, trip planning",
  authors: [{ name: "What to Pack" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "What to Pack - Smart Packing Lists",
    description: "Get personalized packing lists based on live weather data for your destination. No more overpacking or underpacking.",
    type: "website",
    url: "https://whattopack.app",
    siteName: "What to Pack",
  },
  twitter: {
    card: "summary_large_image",
    title: "What to Pack - Smart Packing Lists",
    description: "Get personalized packing lists based on live weather data for your destination. No more overpacking or underpacking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
