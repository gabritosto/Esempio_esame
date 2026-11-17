import React from 'react';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  id,
}) => {
  const inputId = id || `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label
      htmlFor={inputId}
      className="flex items-center justify-between gap-3 min-h-[44px] py-1 cursor-pointer select-none"
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        {description && <span className="text-xs text-neutral-500">{description}</span>}
      </div>
      <div className="relative shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-12 h-7 rounded-full border flex items-center px-1 ${
            checked
              ? 'bg-neutral-900 border-neutral-900 justify-end'
              : 'bg-white border-neutral-500 justify-start'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border ${
              checked ? 'bg-white border-white' : 'bg-neutral-400 border-neutral-600'
            }`}
          />
        </div>
      </div>
    </label>
  );
};
