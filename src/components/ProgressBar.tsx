'use client';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  return (
    <div
      className={`h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-violet-600 to-violet-600 rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
