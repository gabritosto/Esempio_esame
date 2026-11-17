import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { MOODS } from '../data/mockData';
import { MoodLabel } from '../types';

interface CheckInMoodScreenProps {
  selectedMood: MoodLabel | null;
  onSelectMood: (mood: MoodLabel) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CheckInMoodScreen: React.FC<CheckInMoodScreenProps> = ({
  selectedMood,
  onSelectMood,
  onBack,
  onContinue,
}) => {
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (!selectedMood) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header
        title="Scelta umore"
        subtitle="Passo 1 di 3"
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          {showError && (
            <Banner
              title="Non puoi ancora continuare"
              message="Seleziona un umore per continuare"
            />
          )}

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-neutral-900">
              Come ti senti adesso?
            </h2>
            <p className="text-xs text-neutral-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div
            className={`p-3 rounded-md border ${
              showError ? 'border-red-600 bg-red-50/30' : 'border-neutral-300 bg-white'
            }`}
          >
            <div className="grid grid-cols-3 gap-3">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => {
                      onSelectMood(mood.label);
                      if (showError) setShowError(false);
                    }}
                    aria-pressed={isSelected}
                    className={`min-h-[84px] p-2 rounded-md border flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-neutral-900 bg-neutral-100'
                        : 'border-neutral-300 bg-white hover:border-neutral-900'
                    }`}
                  >
                    {/* Empty wireframe circle when unselected; inner dot when selected */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'border-2 border-neutral-900 bg-white'
                          : 'border border-neutral-900 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-neutral-900" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        isSelected
                          ? 'font-bold text-neutral-900'
                          : 'font-medium text-neutral-800'
                      }`}
                    >
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {showError && (
              <p className="text-xs font-medium text-red-700 mt-3">
                Seleziona un umore per continuare
              </p>
            )}
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={handleContinue}>
          Continua
        </Button>
      </div>
    </div>
  );
};
