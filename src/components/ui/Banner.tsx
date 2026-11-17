import React from 'react';
import { Button } from './Button';

interface BannerProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      role="alert"
      className="border border-red-600 bg-red-50 text-red-700 rounded-md p-3 flex items-center justify-between gap-3"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold uppercase tracking-wide text-red-700">
          {title}
        </span>
        {message && <span className="text-xs text-red-700">{message}</span>}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="outline-error"
          size="sm"
          onClick={onAction}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
