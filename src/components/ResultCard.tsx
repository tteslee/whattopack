'use client';

import { motion } from 'framer-motion';
import { PackingPlan } from '@/types';
import Badge from './Badge';

interface ResultCardProps {
  plan: PackingPlan;
  onReset: () => void;
}

// Helper function to handle pluralization
const pluralize = (count: number, singular: string, plural?: string) => {
  const pluralForm = plural || singular + 's';
  return count === 1 ? singular : pluralForm;
};

export default function ResultCard({ plan, onReset }: ResultCardProps) {
  const { weather, packing, notes } = plan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-subway-card-light dark:bg-subway-card p-6 shadow-xl max-w-md mx-auto"
    >
      {/* Weather Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge color="a" size="lg">{weather.city.charAt(0).toUpperCase()}</Badge>
          <h2 className="text-h2 font-semibold text-subway-text-light dark:text-subway-text">{weather.city}</h2>
        </div>
        
        <div className="bg-subway-surface-light dark:bg-subway-surface rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-subway-text-light dark:text-subway-text">{weather.avg}°</div>
              <div className="text-xs text-subway-muted-light dark:text-subway-muted">Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-subway-text-light dark:text-subway-text">{weather.min}°</div>
              <div className="text-xs text-subway-muted-light dark:text-subway-muted">Min</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-subway-text-light dark:text-subway-text">{weather.max}°</div>
              <div className="text-xs text-subway-muted-light dark:text-subway-muted">Max</div>
            </div>
          </div>
          <p className="text-sm text-subway-muted-light dark:text-subway-muted mt-3 text-center">{weather.summary}</p>
        </div>
      </div>

      {/* Packing List */}
      <div className="space-y-4">
        <h3 className="text-h2 font-semibold text-subway-text-light dark:text-subway-text">Your Packing List</h3>
        
        {/* Tops */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge color="g">T</Badge>
            <span className="text-subway-text-light dark:text-subway-text font-medium">Tops</span>
            <span className="text-subway-muted-light dark:text-subway-muted">{packing.tops.total} items</span>
          </div>
          <div className="ml-10 space-y-1">
            {packing.tops.shortSleeve > 0 && (
              <div className="text-sm text-subway-muted-light dark:text-subway-muted">• {packing.tops.shortSleeve} {pluralize(packing.tops.shortSleeve, 'short sleeve')}</div>
            )}
            {packing.tops.longSleeve > 0 && (
              <div className="text-sm text-subway-muted-light dark:text-subway-muted">• {packing.tops.longSleeve} {pluralize(packing.tops.longSleeve, 'long sleeve')}</div>
            )}
            {packing.tops.note && (
              <div className="text-xs text-subway-muted-light dark:text-subway-muted italic mt-2">💡 {packing.tops.note}</div>
            )}
          </div>
        </div>

        {/* Bottoms */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge color="b">B</Badge>
            <span className="text-subway-text-light dark:text-subway-text font-medium">Bottoms</span>
            <span className="text-subway-muted-light dark:text-subway-muted">{packing.bottoms.total} items</span>
          </div>
          <div className="ml-10 space-y-1">
            {packing.bottoms.shorts > 0 && (
              <div className="text-sm text-subway-muted-light dark:text-subway-muted">• {packing.bottoms.shorts} shorts</div>
            )}
            {packing.bottoms.pants > 0 && (
              <div className="text-sm text-subway-muted-light dark:text-subway-muted">• {packing.bottoms.pants} pants</div>
            )}
            {packing.bottoms.note && (
              <div className="text-xs text-subway-muted-light dark:text-subway-muted italic mt-2">💡 {packing.bottoms.note}</div>
            )}
          </div>
        </div>

        {/* Outerwear */}
        {packing.outerwear.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge color="c">O</Badge>
              <span className="text-subway-text-light dark:text-subway-text font-medium">Outerwear</span>
            </div>
            <div className="ml-10 space-y-1">
              {packing.outerwear.map((item, index) => (
                <div key={index} className="text-sm text-subway-muted-light dark:text-subway-muted">• {item.count} {item.name}</div>
              ))}
            </div>
          </div>
        )}

        {/* Footwear */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge color="j">F</Badge>
            <span className="text-subway-text-light dark:text-subway-text font-medium">Footwear</span>
          </div>
          <div className="ml-10 space-y-1">
            {packing.footwear.map((item, index) => (
              <div key={index} className="text-sm text-subway-muted-light dark:text-subway-muted">• {item.count} {item.name}</div>
            ))}
          </div>
        </div>

        {/* Accessories */}
        {packing.accessories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge color="l">A</Badge>
              <span className="text-subway-text-light dark:text-subway-text font-medium">Accessories</span>
            </div>
            <div className="ml-10 space-y-1">
              {packing.accessories.map((item, index) => (
                <div key={index} className="text-sm text-subway-muted-light dark:text-subway-muted">• {item}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {notes.length > 0 && (
        <div className="mt-6 p-4 bg-subway-surface-light dark:bg-subway-surface rounded-lg">
          <h4 className="text-sm font-semibold text-subway-text-light dark:text-subway-text mb-2">Notes</h4>
          <ul className="space-y-1">
            {notes.map((note, index) => (
              <li key={index} className="text-sm text-subway-muted-light dark:text-subway-muted">• {note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-subway-surface-light dark:bg-subway-surface border border-subway-muted-light dark:border-subway-muted px-5 py-3 font-semibold text-subway-text-light dark:text-subway-text hover:border-subway-a transition-colors"
      >
        Plan Another Trip
        <span className="text-xl leading-none">↺</span>
      </button>
    </motion.div>
  );
} 