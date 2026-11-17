import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { CAMPUSES } from '../data/mockData';
import { UserSettings } from '../types';

interface ProfileScreenProps {
  settings: UserSettings;
  onUpdateSettings: (next: UserSettings) => void;
  onClearCheckIns: () => void;
  onResetMock: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearCheckIns,
  onResetMock,
  onLogout,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const updateField = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    onUpdateSettings({ ...settings, [key]: value });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header
        title="Profilo"
        rightSlot={
          savedNotice ? (
            <span className="text-[11px] font-medium text-neutral-600">
              Salvato
            </span>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col gap-5">
        {/* User Summary */}
        <Card tone="subtle" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-900 bg-white flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-neutral-900">
              {settings.nickname.slice(0, 2).toUpperCase() || 'ST'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-neutral-900 truncate">
              {settings.nickname}
            </span>
            <span className="text-xs text-neutral-600 truncate">
              {settings.campus}
            </span>
            <span className="text-[11px] text-neutral-500 truncate">
              {settings.email}
            </span>
          </div>
        </Card>

        {/* Impostazioni */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Impostazioni
          </h2>

          <Card className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="prof-nickname"
                className="text-xs font-semibold text-neutral-900"
              >
                Nickname
              </label>
              <input
                id="prof-nickname"
                type="text"
                value={settings.nickname}
                onChange={(e) => updateField('nickname', e.target.value)}
                className="min-h-[44px] px-3 text-sm rounded-md border border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="prof-campus"
                className="text-xs font-semibold text-neutral-900"
              >
                Campus
              </label>
              <select
                id="prof-campus"
                value={settings.campus}
                onChange={(e) => updateField('campus', e.target.value)}
                className="min-h-[44px] px-3 text-sm rounded-md border border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prof-theme"
                  className="text-xs font-semibold text-neutral-900"
                >
                  Tema
                </label>
                <select
                  id="prof-theme"
                  value={settings.theme}
                  disabled
                  className="min-h-[44px] px-2.5 text-xs rounded-md border border-neutral-300 bg-neutral-100 text-neutral-700"
                >
                  <option value="Chiaro (Wireframe)">Chiaro (Wireframe)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prof-lang"
                  className="text-xs font-semibold text-neutral-900"
                >
                  Lingua
                </label>
                <select
                  id="prof-lang"
                  value={settings.language}
                  onChange={(e) =>
                    updateField(
                      'language',
                      e.target.value as 'Italiano' | 'English'
                    )
                  }
                  className="min-h-[44px] px-2.5 text-xs rounded-md border border-neutral-400 bg-white text-neutral-900 focus:border-neutral-900 focus:outline-none"
                >
                  <option value="Italiano">Italiano</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Privacy e notifiche */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Privacy e notifiche
          </h2>

          <Card className="flex flex-col gap-2">
            <Toggle
              label="Check-in anonimi"
              description="Imposta l'anonimato come predefinito"
              checked={settings.defaultAnonymous}
              onChange={(val) => updateField('defaultAnonymous', val)}
            />
            <div className="h-px bg-neutral-200" />
            <Toggle
              label="Mostra il mio umore sulla mappa"
              description="Contribuisci alle medie delle zone"
              checked={settings.showMoodOnMap}
              onChange={(val) => updateField('showMoodOnMap', val)}
            />
            <div className="h-px bg-neutral-200" />
            <Toggle
              label="Promemoria giornaliero"
              checked={settings.dailyReminder}
              onChange={(val) => updateField('dailyReminder', val)}
            />

            {settings.dailyReminder && (
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <label
                  htmlFor="reminder-time"
                  className="text-xs font-medium text-neutral-700"
                >
                  Orario promemoria
                </label>
                <input
                  id="reminder-time"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateField('reminderTime', e.target.value)}
                  className="min-h-[44px] px-2.5 text-sm rounded border border-neutral-400 bg-white text-neutral-900 tabular-nums"
                />
              </div>
            )}
          </Card>
        </section>

        {/* Wireframe test controls */}
        <section className="flex flex-col gap-2 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Controlli wireframe
          </h2>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="sm" fullWidth onClick={onClearCheckIns}>
              Svuota storico check-in (test stato vuoto)
            </Button>
            <Button variant="secondary" size="sm" fullWidth onClick={onResetMock}>
              Ripristina dati mock iniziali
            </Button>
            <Button variant="secondary" size="sm" fullWidth onClick={onLogout}>
              Esci e ripeti onboarding
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
