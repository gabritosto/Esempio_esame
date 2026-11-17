import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightSlot,
}) => {
  return (
    <header className="shrink-0 h-14 px-4 border-b border-neutral-300 bg-white flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Indietro"
            className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 rounded-md cursor-pointer focus-visible:outline-2 focus-visible:outline-neutral-900"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12.5 4.5L7 10L12.5 15.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
              />
            </svg>
          </button>
        )}
        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-semibold text-neutral-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <span className="text-[11px] text-neutral-500 leading-none truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {rightSlot && <div className="shrink-0 flex items-center">{rightSlot}</div>}
    </header>
  );
};
