interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl bg-subway-card p-6 shadow-xl max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center py-8">
        {/* Error icon */}
        <div className="w-16 h-16 bg-subway-b rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">!</span>
        </div>
        
        <h3 className="text-h2 font-semibold text-subway-text mb-2">
          Oops!
        </h3>
        
        <p className="text-subway-muted text-center mb-6">
          {error}
        </p>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-subway-a px-5 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Try Again
          <span className="text-xl leading-none">↻</span>
        </button>
      </div>
    </div>
  );
} 