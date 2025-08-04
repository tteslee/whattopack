import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-subway-bg flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Subway line decorative element */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-subway-a rounded-full"></div>
              <div className="w-4 h-4 bg-subway-b rounded-full"></div>
              <div className="w-4 h-4 bg-subway-g rounded-full"></div>
              <div className="w-4 h-4 bg-subway-c rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-display font-extrabold text-subway-text mb-6">
            What to Pack
          </h1>
          
          <p className="text-body text-subway-muted mb-8 max-w-lg mx-auto">
            Get a personalized packing list based on live weather data for your destination. 
            No more overpacking or underpacking—just the right clothes for your trip.
          </p>
          
          <Link 
            href="/plan"
            className="group inline-flex items-center gap-2 rounded-full bg-subway-a px-8 py-4 font-semibold text-white hover:opacity-90 transition-opacity text-lg"
          >
            Plan your trip
            <span className="text-2xl leading-none">→</span>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
              <footer className="py-8 px-4 text-center">
          <p className="text-caption text-subway-muted">
            Powered by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-subway-a hover:underline">Open-Meteo</a> weather data
          </p>
        </footer>
    </main>
  );
}
