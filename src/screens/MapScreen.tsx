import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ZoneData, ZoneId } from '../types';

interface MapScreenProps {
  zones: ZoneData[];
  selectedZoneId: ZoneId;
  onSelectZone: (id: ZoneId) => void;
  onOpenZoneDetail: (id: ZoneId) => void;
}

function getZoneShadeClass(avg: number, count: number): {
  bg: string;
  text: string;
} {
  if (count === 0) {
    return { bg: 'bg-white border-dashed', text: 'text-neutral-600' };
  }
  if (avg >= 4.2) {
    return { bg: 'bg-neutral-800', text: 'text-white' };
  }
  if (avg >= 3.5) {
    return { bg: 'bg-neutral-500', text: 'text-white' };
  }
  if (avg >= 2.8) {
    return { bg: 'bg-neutral-300', text: 'text-neutral-900' };
  }
  return { bg: 'bg-neutral-200', text: 'text-neutral-900' };
}

export const MapScreen: React.FC<MapScreenProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  onOpenZoneDetail,
}) => {
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [isOffline, setIsOffline] = useState(false);

  const selectedZone =
    zones.find((z) => z.id === selectedZoneId) ?? zones[0];

  const getMetrics = (z: ZoneData) =>
    period === 'today'
      ? { avg: z.todayAvg, count: z.todayCount }
      : { avg: z.weekAvg, count: z.weekCount };

  const selectedMetrics = getMetrics(selectedZone);

  const zoneById = (id: ZoneId) => zones.find((z) => z.id === id)!;

  const renderZoneTile = (id: ZoneId, extraClass = '') => {
    const z = zoneById(id);
    const { avg, count } = getMetrics(z);
    const shade = getZoneShadeClass(avg, count);
    const isSelected = z.id === selectedZoneId;

    return (
      <button
        key={z.id}
        type="button"
        onClick={() => onSelectZone(z.id)}
        className={`min-h-[72px] p-2.5 rounded-lg border flex flex-col items-start justify-between text-left cursor-pointer ${
          shade.bg
        } ${shade.text} ${
          isSelected
            ? 'border-2 border-neutral-900 outline-2 outline-offset-1 outline-neutral-900'
            : 'border-neutral-700'
        } ${extraClass}`}
      >
        <span className="text-xs font-semibold leading-tight">{z.name}</span>
        <span className="text-[11px] tabular-nums opacity-90">
          {count > 0 ? `${avg.toFixed(1)} / 5 · ${count}` : 'Nessun dato'}
        </span>
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header
        title="Mappa campus"
        rightSlot={
          /* Subtle hidden-style toggle to simulate offline connection error */
          <button
            type="button"
            onClick={() => setIsOffline((v) => !v)}
            aria-pressed={isOffline}
            className="min-h-[44px] px-2 text-[11px] text-neutral-400 hover:text-neutral-800 cursor-pointer"
            title="Simula stato offline"
          >
            {isOffline ? 'Offline: ON' : 'Offline: OFF'}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col gap-4">
        {isOffline ? (
          <>
            <Banner
              title="Sei offline"
              message="Impossibile caricare la mappa"
              actionLabel="Riprova"
              onAction={() => setIsOffline(false)}
            />
            <div className="border border-dashed border-red-400 rounded-md p-6 bg-neutral-50 flex flex-col items-center justify-center text-center gap-3 min-h-[260px]">
              <div className="w-12 h-12 rounded-full border border-dashed border-red-500" />
              <p className="text-sm font-semibold text-neutral-900">
                Connessione assente
              </p>
              <p className="text-xs text-neutral-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOffline(false)}
              >
                Riprova
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Segmented selector Oggi / Settimana */}
            <div className="grid grid-cols-2 border border-neutral-900 rounded-md overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setPeriod('today')}
                className={`min-h-[44px] text-xs font-semibold cursor-pointer ${
                  period === 'today'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-900'
                }`}
              >
                Oggi
              </button>
              <button
                type="button"
                onClick={() => setPeriod('week')}
                className={`min-h-[44px] text-xs font-semibold cursor-pointer ${
                  period === 'week'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-900'
                }`}
              >
                Settimana
              </button>
            </div>

            {/* Schematic Campus Map */}
            <div className="border border-neutral-400 rounded-md p-3 bg-neutral-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-600">
                <span className="font-medium">Schema zone campus</span>
                <span>Tocca una zona</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {renderZoneTile('biblioteca')}
                {renderZoneTile('aula-studio')}
                {renderZoneTile('cortile', 'col-span-2 min-h-[64px]')}
                {renderZoneTile('mensa')}
                {renderZoneTile('giardino')}
                {renderZoneTile('palestra', 'col-span-2 min-h-[64px]')}
              </div>

              {/* Legend */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-700">
                  Umore basso
                </span>
                <div className="flex items-center gap-1" aria-hidden="true">
                  <span className="w-5 h-3 border border-dashed border-neutral-600 bg-white inline-block" />
                  <span className="w-5 h-3 border border-neutral-700 bg-neutral-200 inline-block" />
                  <span className="w-5 h-3 border border-neutral-700 bg-neutral-300 inline-block" />
                  <span className="w-5 h-3 border border-neutral-700 bg-neutral-500 inline-block" />
                  <span className="w-5 h-3 border border-neutral-900 bg-neutral-800 inline-block" />
                </div>
                <span className="text-[11px] text-neutral-700">
                  Umore alto
                </span>
              </div>
            </div>

            {/* Selected Zone Card */}
            <Card className="flex flex-col gap-3 border-neutral-900">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                    Zona selezionata
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">
                    {selectedZone.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-neutral-900 tabular-nums block leading-tight">
                    {selectedMetrics.count > 0
                      ? `${selectedMetrics.avg.toFixed(1)}/5`
                      : '—'}
                  </span>
                  <span className="text-[11px] text-neutral-600 tabular-nums">
                    {selectedMetrics.count} check-in
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Button
                variant="primary"
                fullWidth
                onClick={() => onOpenZoneDetail(selectedZone.id)}
              >
                Vedi dettaglio zona
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
