export function PriceDisplay({ cents, className = "" }: { cents: number; className?: string }) {
  return <span className={`tabular-nums ${className}`}>${(cents / 100).toFixed(2)}</span>;
}
