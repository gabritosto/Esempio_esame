import React from 'react';
import { TabId } from '../../types';

interface TabBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'map', label: 'Mappa' },
  { id: 'board', label: 'Bacheca' },
  { id: 'profile', label: 'Profilo' },
];

const TabShape: React.FC<{ id: TabId; active: boolean }> = ({ id, active }) => {
  const fill = active ? '#111111' : 'none';
  const stroke = active ? '#111111' : '#525252';
  const strokeWidth = 1.5;

  switch (id) {
    case 'home':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    case 'map':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="10"
            cy="10"
            r="7"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    case 'board':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <rect
            x="2.5"
            y="4"
            width="15"
            height="12"
            rx="3.5"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
    case 'profile':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <polygon
            points="10,3 17.5,16.5 2.5,16.5"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      );
  }
};

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      aria-label="Navigazione principale"
      className="shrink-0 h-16 border-t border-neutral-300 bg-white grid grid-cols-4"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className="min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-neutral-900"
          >
            <TabShape id={tab.id} active={isActive} />
            <span
              className={`text-[11px] leading-none ${
                isActive ? 'font-semibold text-neutral-900' : 'font-normal text-neutral-600'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
