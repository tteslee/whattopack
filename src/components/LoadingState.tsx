export default function LoadingState() {
  return (
    <div className="rounded-2xl bg-subway-card-light dark:bg-subway-card p-6 shadow-xl max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          {/* Subway-inspired loading animation */}
          <div className="w-16 h-16 border-4 border-subway-muted-light dark:border-subway-muted border-t-subway-a rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-subway-a rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h3 className="text-h2 font-semibold text-subway-text-light dark:text-subway-text mt-6 mb-2">
          Planning Your Packing
        </h3>
        
        <p className="text-subway-muted-light dark:text-subway-muted text-center">
          Analyzing weather data and calculating your perfect packing list...
        </p>
      </div>
    </div>
  );
} 