import React, { useEffect } from 'react';
import { Button } from '../components/ui/Button';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onFinish();
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 py-12 bg-white">
      <div />

      <div className="flex flex-col items-center gap-4">
        {/* Simple geometric wireframe logo */}
        <div className="w-20 h-20 border-2 border-neutral-900 rounded-2xl flex items-center justify-center bg-white">
          <div className="w-10 h-10 rounded-full border-2 border-neutral-900 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-neutral-900" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            MoodMap
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Campus Mood Wireframe
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        {/* Static wireframe loading indicator */}
        <div className="w-48 flex flex-col gap-1.5 items-center">
          <div className="w-full h-2 border border-neutral-900 rounded-full overflow-hidden bg-white">
            <div className="h-full w-2/3 bg-neutral-900" />
          </div>
          <span className="text-xs text-neutral-600">Caricamento...</span>
        </div>
        <Button variant="secondary" size="sm" onClick={onFinish}>
          Continua
        </Button>
      </div>
    </div>
  );
};
