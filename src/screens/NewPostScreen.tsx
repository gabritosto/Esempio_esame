import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { Toggle } from '../components/ui/Toggle';
import { ZoneData, ZoneId } from '../types';

interface NewPostScreenProps {
  zones: ZoneData[];
  initialZoneId?: ZoneId;
  defaultAnonymous: boolean;
  onBack: () => void;
  onPublish: (data: { text: string; zoneId: ZoneId; anonymous: boolean }) => void;
}

export const NewPostScreen: React.FC<NewPostScreenProps> = ({
  zones,
  initialZoneId,
  defaultAnonymous,
  onBack,
  onPublish,
}) => {
  const [text, setText] = useState('');
  const [zoneId, setZoneId] = useState<ZoneId | null>(initialZoneId ?? null);
  const [anonymous, setAnonymous] = useState(defaultAnonymous);
  const [errors, setErrors] = useState<{ text?: string; zone?: string }>({});

  const handlePublish = () => {
    const nextErrors: { text?: string; zone?: string } = {};
    if (text.trim().length < 10) {
      nextErrors.text = 'Il testo deve contenere almeno 10 caratteri';
    }
    if (!zoneId) {
      nextErrors.zone = 'Seleziona una zona del campus';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onPublish({
      text: text.trim(),
      zoneId: zoneId!,
      anonymous,
    });
  };

  const hasError = Boolean(errors.text || errors.zone);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header title="Nuovo post" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          {hasError && (
            <Banner
              title="Impossibile pubblicare il post"
              message="Correggi i campi evidenziati qui sotto."
            />
          )}

          {/* Post Text */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="new-post-text"
                className="text-xs font-semibold text-neutral-900"
              >
                Testo del post
              </label>
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {text.trim().length} / 10 min
              </span>
            </div>
            <textarea
              id="new-post-text"
              rows={4}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text && e.target.value.trim().length >= 10) {
                  setErrors((prev) => ({ ...prev, text: undefined }));
                }
              }}
              placeholder="Condividi un pensiero sul campus..."
              className={`p-3 text-sm rounded-md border bg-white text-neutral-900 focus:outline-none resize-none ${
                errors.text
                  ? 'border-red-600 bg-red-50/20'
                  : 'border-neutral-400 focus:border-neutral-900'
              }`}
            />
            {errors.text && (
              <span className="text-xs font-medium text-red-700">
                {errors.text}
              </span>
            )}
          </div>

          {/* Zone Choice */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-900">
              Scegli la zona
            </span>
            <div
              className={`p-2.5 rounded-md border flex flex-wrap gap-2 ${
                errors.zone
                  ? 'border-red-600 bg-red-50/20'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              {zones.map((z) => (
                <Chip
                  key={z.id}
                  label={z.name}
                  selected={zoneId === z.id}
                  error={Boolean(errors.zone) && zoneId !== z.id}
                  onClick={() => {
                    setZoneId(z.id);
                    if (errors.zone) {
                      setErrors((prev) => ({ ...prev, zone: undefined }));
                    }
                  }}
                />
              ))}
            </div>
            {errors.zone && (
              <span className="text-xs font-medium text-red-700">
                {errors.zone}
              </span>
            )}
          </div>

          {/* Anonymous Toggle */}
          <div className="border border-neutral-300 rounded-md px-3 py-2 bg-white">
            <Toggle
              label="Pubblica in modo anonimo"
              description="Il tuo nickname verrà nascosto"
              checked={anonymous}
              onChange={setAnonymous}
            />
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={handlePublish}>
          Pubblica
        </Button>
      </div>
    </div>
  );
};
