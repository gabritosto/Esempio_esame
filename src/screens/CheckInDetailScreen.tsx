import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { MoodLabel, ZoneData, ZoneId } from '../types';

interface CheckInDetailScreenProps {
  mood: MoodLabel;
  intensity: number | null;
  note: string;
  zoneId: ZoneId;
  anonymous: boolean;
  zones: ZoneData[];
  onChangeIntensity: (val: number | null) => void;
  onChangeNote: (val: string) => void;
  onChangeZone: (val: ZoneId) => void;
  onChangeAnonymous: (val: boolean) => void;
  onBack: () => void;
  onSave: () => void;
}

export const CheckInDetailScreen: React.FC<CheckInDetailScreenProps> = ({
  mood,
  intensity,
  note,
  zoneId,
  anonymous,
  zones,
  onChangeIntensity,
  onChangeNote,
  onChangeZone,
  onChangeAnonymous,
  onBack,
  onSave,
}) => {
  const [intensityError, setIntensityError] = useState(false);

  const handleSave = () => {
    if (intensity === null || intensity < 1 || intensity > 5) {
      setIntensityError(true);
      return;
    }
    setIntensityError(false);
    onSave();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header
        title="Dettaglio check-in"
        subtitle="Passo 2 di 3"
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          {intensityError && (
            <Banner
              title="Check-in non salvato"
              message="Compila il campo Intensità prima di salvare."
            />
          )}

          {/* Selected Mood Summary */}
          <div className="border border-neutral-300 rounded-md p-3 bg-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-600">Umore selezionato</span>
            <span className="text-sm font-bold text-neutral-900">{mood}</span>
          </div>

          {/* Intensity Slider 1 to 5 (starts null so error state can be triggered) */}
          <div
            className={`p-3 rounded-md border flex flex-col gap-3 ${
              intensityError
                ? 'border-red-600 bg-red-50/30'
                : 'border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="intensity-slider"
                className="text-sm font-semibold text-neutral-900"
              >
                Intensità (1 – 5)
              </label>
              <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                {intensity !== null ? `${intensity} / 5` : 'Non selezionata'}
              </span>
            </div>

            <input
              id="intensity-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={intensity ?? 3}
              onChange={(e) => {
                onChangeIntensity(Number(e.target.value));
                if (intensityError) setIntensityError(false);
              }}
              className="w-full accent-neutral-900 cursor-pointer h-8"
            />

            {/* Direct clickable 1-5 scale buttons for 44px touch targets & clear wireframe state */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const active = intensity === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onChangeIntensity(val);
                      if (intensityError) setIntensityError(false);
                    }}
                    className={`min-h-[44px] rounded border text-sm font-semibold tabular-nums cursor-pointer ${
                      active
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-900 border-neutral-400 hover:border-neutral-900'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>1 · Lieve</span>
              <span>5 · Molto forte</span>
            </div>

            {intensityError && (
              <span className="text-xs font-medium text-red-700">
                Scegli un valore da 1 a 5
              </span>
            )}
          </div>

          {/* Campus Zone */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="checkin-zone"
              className="text-xs font-semibold text-neutral-900"
            >
              Zona del campus
            </label>
            <select
              id="checkin-zone"
              value={zoneId}
              onChange={(e) => onChangeZone(e.target.value as ZoneId)}
              className="min-h-[44px] px-3 py-2 text-sm rounded-md border border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:outline-none"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Note */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="checkin-note"
              className="text-xs font-semibold text-neutral-900"
            >
              Nota facoltativa
            </label>
            <textarea
              id="checkin-note"
              rows={3}
              value={note}
              onChange={(e) => onChangeNote(e.target.value)}
              placeholder="Scrivi un pensiero veloce..."
              className="p-3 text-sm rounded-md border border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:outline-none resize-none"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="border border-neutral-300 rounded-md px-3 py-2 bg-white">
            <Toggle
              label="Condividi in modo anonimo"
              description="Il tuo nickname non apparirà sulla mappa"
              checked={anonymous}
              onChange={onChangeAnonymous}
            />
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={handleSave}>
          Salva check-in
        </Button>
      </div>
    </div>
  );
};
