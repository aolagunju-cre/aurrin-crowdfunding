'use client';

import { useState } from 'react';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  return (
    <div
      className={`w-full h-2 rounded-full bg-white/10 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}