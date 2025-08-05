import FormCard from '@/components/FormCard';
import ThemeToggle from '@/components/ThemeToggle';

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-subway-bg-light dark:bg-subway-bg flex flex-col">
      <ThemeToggle />
      
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-h1 font-bold text-subway-text-light dark:text-subway-text text-center">
            What to Pack
          </h1>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <FormCard />
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-4 text-center">
        <p className="text-caption text-subway-muted-light dark:text-subway-muted">
          Powered by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-subway-a hover:underline">Open-Meteo</a> weather data
        </p>
      </footer>
    </main>
  );
} 