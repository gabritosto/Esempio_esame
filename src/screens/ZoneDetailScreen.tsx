import React from 'react';
import { HourlyBarChart } from '../components/charts/WireframeCharts';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ZoneData, ZoneId } from '../types';

interface ZoneDetailScreenProps {
  zone: ZoneData;
  onBack: () => void;
  onFirstCheckIn: (zoneId: ZoneId) => void;
  onOpenStats: () => void;
}

export const ZoneDetailScreen: React.FC<ZoneDetailScreenProps> = ({
  zone,
  onBack,
  onFirstCheckIn,
  onOpenStats,
}) => {
  const isEmpty = zone.todayCount === 0 && zone.weekCount === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header title={zone.name} subtitle="Dettaglio zona" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col justify-between gap-4">
        {isEmpty ? (
          <EmptyState
            title={`Ancora nessun check-in in ${zone.name}`}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
            primaryLabel="Fai il primo check-in"
            onPrimary={() => onFirstCheckIn(zone.id)}
            secondaryLabel="Torna alla mappa"
            onSecondary={onBack}
          />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3 flex flex-col gap-1">
                  <span className="text-[11px] text-neutral-600">
                    Umore medio (oggi)
                  </span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {zone.todayAvg.toFixed(1)} / 5
                  </span>
                </Card>
                <Card className="p-3 flex flex-col gap-1">
                  <span className="text-[11px] text-neutral-600">
                    Check-in oggi
                  </span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {zone.todayCount}
                  </span>
                </Card>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Andamento per ore
                </h2>
                <HourlyBarChart data={zone.hourly} />
              </div>

              <Card tone="subtle">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim
                  ad minim veniam, quis nostrud exercitation ullamco.
                </p>
              </Card>
            </div>

            <Button variant="primary" fullWidth onClick={onOpenStats}>
              Il tuo andamento
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
