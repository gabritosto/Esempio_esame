import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'white' | 'subtle';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  tone = 'white',
  onClick,
}) => {
  const bg = tone === 'subtle' ? 'bg-neutral-100' : 'bg-white';
  const base = `border border-neutral-300 rounded-md p-4 ${bg}`;

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${base} cursor-pointer hover:border-neutral-900 ${className}`}
      >
        {children}
      </div>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
};
