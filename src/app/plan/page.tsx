import FormCard from '@/components/FormCard';

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-subway-bg flex flex-col">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-h1 font-bold text-subway-text text-center">
            Packing Planner
          </h1>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <FormCard />
      </div>
      
      {/* Footer */}
              <footer className="py-8 px-4 text-center">
          <p className="text-caption text-subway-muted">
            Powered by Open-Meteo weather data • NYC Subway-inspired design
          </p>
        </footer>
    </main>
  );
} 