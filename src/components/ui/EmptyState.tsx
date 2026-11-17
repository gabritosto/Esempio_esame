import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) => {
  return (
    <div className="border border-dashed border-neutral-400 rounded-md p-6 flex flex-col items-center text-center gap-4 bg-white">
      {/* Simple dashed geometric wireframe placeholder */}
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center">
        <div className="w-6 h-6 border border-dashed border-neutral-400" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col gap-2 w-full pt-1">
        <Button variant="primary" fullWidth onClick={onPrimary}>
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary && (
          <Button variant="secondary" fullWidth onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
