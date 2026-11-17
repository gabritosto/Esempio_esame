import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateItalian, getZoneName } from '../data/mockData';
import { CheckIn, MoodLabel, ZoneData } from '../types';

interface HistoryScreenProps {
  checkIns: CheckIn[];
  zones: ZoneData[];
  onBack: () => void;
  onStartCheckIn: () => void;
}

type FilterOption = 'Tutti' | 'Felice' | 'Stanco' | 'Stressato';
const FILTERS: FilterOption[] = ['Tutti', 'Felice', 'Stanco', 'Stressato'];

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  checkIns,
  zones,
  onBack,
  onStartCheckIn,
}) => {
  const [filter, setFilter] = useState<FilterOption>('Tutti');

  const sorted = [...checkIns].sort((a, b) =>
    `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  );

  const filtered =
    filter === 'Tutti'
      ? sorted
      : sorted.filter((c) => c.mood === (filter as MoodLabel));

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header title="Storico check-in" onBack={onBack} />

      {/* Fixed filter chips pushed below header with top padding */}
      <div className="shrink-0 bg-white border-b border-neutral-200 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              selected={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col gap-4">
        {checkIns.length === 0 ? (
          <EmptyState
            title="Nessun check-in registrato"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam."
            primaryLabel="Registra il tuo primo umore"
            onPrimary={onStartCheckIn}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nessun check-in registrato"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            primaryLabel="Registra il tuo primo umore"
            onPrimary={onStartCheckIn}
            secondaryLabel="Mostra tutti"
            onSecondary={() => setFilter('Tutti')}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((item) => (
              <Card key={item.id} className="p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-neutral-900 bg-neutral-900 shrink-0" />
                    <span className="text-sm font-semibold text-neutral-900">
                      {item.mood}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                    Intensità {item.intensity}/5
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-600 tabular-nums">
                  <span>
                    {formatDateItalian(item.date)} · {item.time}
                  </span>
                  <span>{getZoneName(zones, item.zoneId)}</span>
                </div>

                {item.note && (
                  <p className="text-xs text-neutral-700 pt-1 border-t border-neutral-200">
                    {item.note}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
