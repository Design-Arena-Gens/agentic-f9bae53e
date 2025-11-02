"use client";

import { Star } from 'lucide-react';

export function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={14} fill="currentColor" />
      ))}
      {half && (
        <Star size={14} fill="currentColor" className="[clip-path:polygon(0_0,50%_0,50%_100%,0_100%)]" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={14} />
      ))}
    </div>
  );
}
