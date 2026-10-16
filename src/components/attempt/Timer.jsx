import { Clock } from 'lucide-react';

export default function Timer({ remainingSec = 0 }) {
  const hours = Math.floor(remainingSec / 3600);
  const minutes = Math.floor((remainingSec % 3600) / 60);
  const seconds = remainingSec % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const timeStr = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  const isLow = remainingSec < 300; // < 5 mins
  const isCritical = remainingSec < 60; // < 1 min

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wider shadow-sm transition-colors ${
        isCritical
          ? 'bg-destructive/10 text-destructive border-destructive/40 animate-pulse'
          : isLow
          ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
          : 'bg-card text-foreground border-border'
      }`}
    >
      <Clock className="h-4 w-4" />
      <span>{timeStr}</span>
    </div>
  );
}