import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-error';
  fullWidth?: boolean;
  size?: 'md' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium text-sm rounded-md whitespace-nowrap cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed';

  const sizeClass = size === 'sm' ? 'min-h-[44px] px-3 py-2 text-xs' : 'min-h-[44px] px-4 py-2.5';

  const variants = {
    primary: 'bg-neutral-900 text-white border border-neutral-900 hover:bg-neutral-800',
    secondary: 'bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-100',
    'outline-error': 'bg-white text-red-700 border border-red-600 hover:bg-red-50',
  };

  return (
    <button
      type="button"
      className={`${base} ${sizeClass} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
