import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: 'Registra il tuo umore ogni giorno',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Osserva come sta il campus',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    title: 'Condividi in modo anonimo',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 bg-white">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="min-h-[44px] min-w-[44px] px-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer"
        >
          Salta
        </button>
      </div>

      <div className="flex flex-col items-center text-center gap-6">
        {/* Simple wireframe placeholder graphic */}
        <div className="w-56 h-44 border border-neutral-400 bg-neutral-100 rounded-md flex items-center justify-center">
          {step === 0 && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-neutral-900 bg-white" />
              <div className="w-12 h-12 rounded-full border-2 border-neutral-900 bg-neutral-300" />
              <div className="w-10 h-10 rounded-full border border-neutral-900 bg-white" />
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-2 p-4 w-40">
              <div className="h-10 border border-neutral-900 bg-neutral-200 rounded" />
              <div className="h-10 border border-neutral-900 bg-neutral-400 rounded" />
              <div className="h-10 border border-neutral-900 bg-neutral-600 rounded" />
              <div className="h-10 border border-neutral-900 bg-white rounded" />
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-2 w-40">
              <div className="h-8 border border-neutral-900 bg-white rounded px-2 flex items-center">
                <div className="w-20 h-2 bg-neutral-400" />
              </div>
              <div className="h-8 border border-neutral-900 bg-white rounded px-2 flex items-center">
                <div className="w-28 h-2 bg-neutral-300" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-neutral-900">
            {SLIDES[step].title}
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {SLIDES[step].text}
          </p>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2" aria-label="Progresso onboarding">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full border border-neutral-900 ${
                idx === step ? 'w-6 bg-neutral-900' : 'w-2 bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {isLast ? (
          <Button variant="primary" fullWidth onClick={onComplete}>
            Inizia
          </Button>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={() => setStep((s) => Math.min(SLIDES.length - 1, s + 1))}
          >
            Avanti
          </Button>
        )}
      </div>
    </div>
  );
};
