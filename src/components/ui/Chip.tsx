import React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  error?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  error = false,
}) => {
  const borderClass = error
    ? 'border-red-600 text-red-700 bg-white'
    : selected
    ? 'border-neutral-900 bg-neutral-900 text-white'
    : 'border-neutral-400 bg-white text-neutral-900 hover:border-neutral-900';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-[44px] px-3.5 py-2 rounded-full border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${borderClass}`}
    >
      {label}
    </button>
  );
};
