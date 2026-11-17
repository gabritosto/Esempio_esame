import React, { useState } from 'react';
import { TrendLineChart } from '../components/charts/WireframeCharts';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  calculateAverageMood,
  formatDateItalian,
  getRelativeDateISO,
} from '../data/mockData';
import { CheckIn } from '../types';

interface StatsScreenProps {
  checkIns: CheckIn[];
  onBack: () => void;
  onOpenHistory: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  checkIns,
  onBack,
  onOpenHistory,
}) => {
  const [range, setRange] = useState<7 | 30>(7);

  const days = Array.from({ length: range }, (_, idx) => {
    const daysAgo = range - 1 - idx;
    const iso = getRelativeDateISO(daysAgo);
    const matching = checkIns.filter((c) => c.date === iso);
    const avg =
      matching.length > 0
        ? Number(
            (
              matching.reduce((s, item) => s + item.moodScore, 0) /
              matching.length
            ).toFixed(1)
          )
        : null;
    const [, m, d] = iso.split('-');
    return {
      iso,
      label: `${d}/${m}`,
      value: avg,
    };
  });

  const periodCheckIns = checkIns.filter((c) =>
    days.some((d) => d.iso === c.date)
  );
  const avgMood = calculateAverageMood(periodCheckIns);

  const bestCheckIn =
    periodCheckIns.length > 0
      ? [...periodCheckIns].sort((a, b) => b.moodScore - a.moodScore)[0]
      : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header title="Statistiche" subtitle="Il tuo andamento" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          {/* 7 / 30 days toggle */}
          <div className="grid grid-cols-2 border border-neutral-900 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setRange(7)}
              className={`min-h-[44px] text-xs font-semibold cursor-pointer ${
                range === 7
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-900'
              }`}
            >
              7 giorni
            </button>
            <button
              type="button"
              onClick={() => setRange(30)}
              className={`min-h-[44px] text-xs font-semibold cursor-pointer ${
                range === 30
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-900'
              }`}
            >
              30 giorni
            </button>
          </div>

          {/* Line Chart */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-900">
              Andamento umore ({range} giorni)
            </h2>
            <TrendLineChart points={days} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 flex flex-col gap-1">
              <span className="text-[11px] text-neutral-600">Umore medio</span>
              <span className="text-xl font-bold text-neutral-900 tabular-nums">
                {avgMood > 0 ? `${avgMood.toFixed(1)} / 5` : '—'}
              </span>
            </Card>
            <Card className="p-3 flex flex-col gap-1">
              <span className="text-[11px] text-neutral-600">
                Giorno migliore
              </span>
              <span className="text-sm font-bold text-neutral-900 tabular-nums">
                {bestCheckIn ? formatDateItalian(bestCheckIn.date) : '—'}
              </span>
              {bestCheckIn && (
                <span className="text-[11px] text-neutral-600">
                  {bestCheckIn.mood} ({bestCheckIn.moodScore.toFixed(1)}/5)
                </span>
              )}
            </Card>
          </div>

          <Card tone="subtle">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </p>
          </Card>
        </div>

        <Button variant="primary" fullWidth onClick={onOpenHistory}>
          Vedi lo storico
        </Button>
      </div>
    </div>
  );
};
