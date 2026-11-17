import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MoodLabel } from '../types';

interface CheckInConfirmScreenProps {
  mood: MoodLabel;
  intensity: number;
  zoneName: string;
  streak: number;
  onGoHome: () => void;
  onGoMap: () => void;
}

export const CheckInConfirmScreen: React.FC<CheckInConfirmScreenProps> = ({
  mood,
  intensity,
  zoneName,
  streak,
  onGoHome,
  onGoMap,
}) => {
  return (
    <div className="flex-1 overflow-y-auto wireframe-scroll px-6 py-10 bg-white flex flex-col justify-between gap-6">
      <div />

      <div className="flex flex-col items-center text-center gap-5">
        {/* Circle with checkmark */}
        <div className="w-20 h-20 rounded-full border-2 border-neutral-900 flex items-center justify-center bg-neutral-100">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 13L9.5 17.5L19 7.5"
              stroke="#111111"
              strokeWidth="2.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Passo 3 di 3
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">
            Check-in salvato!
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <Card tone="subtle" className="w-full flex flex-col gap-2 text-left">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">Streak aggiornato</span>
            <span className="font-bold text-neutral-900 tabular-nums">
              {streak} {streak === 1 ? 'giorno' : 'giorni'}
            </span>
          </div>
          <div className="h-px bg-neutral-300" />
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">Umore registrato</span>
            <span className="font-semibold text-neutral-900">
              {mood} · {intensity}/5
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">Zona</span>
            <span className="font-semibold text-neutral-900">{zoneName}</span>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="primary" fullWidth onClick={onGoHome}>
          Torna alla Home
        </Button>
        <Button variant="secondary" fullWidth onClick={onGoMap}>
          Vedi la mappa del campus
        </Button>
      </div>
    </div>
  );
};
