import React, { useState } from 'react';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { CAMPUSES } from '../data/mockData';

interface ProfileSetupScreenProps {
  initialNickname: string;
  initialCampus: string;
  onComplete: (nickname: string, campus: string) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  initialNickname,
  initialCampus,
  onComplete,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [campus, setCampus] = useState(initialCampus);
  const [errors, setErrors] = useState<{ nickname?: string; campus?: string }>({});

  const handleSave = () => {
    const nextErrors: { nickname?: string; campus?: string } = {};
    if (!nickname.trim()) {
      nextErrors.nickname = 'Inserisci un nickname per continuare';
    }
    if (!campus) {
      nextErrors.campus = 'Seleziona il tuo campus';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onComplete(nickname.trim(), campus);
  };

  return (
    <div className="flex-1 overflow-y-auto wireframe-scroll px-6 py-8 bg-white flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Setup profilo
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">
            Completa il tuo profilo
          </h1>
          <p className="text-xs text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {(errors.nickname || errors.campus) && (
          <Banner
            title="Profilo incompleto"
            message="Compila i campi obbligatori per proseguire."
          />
        )}

        <div className="flex flex-col gap-1">
          <label
            htmlFor="setup-nickname"
            className="text-xs font-semibold text-neutral-900"
          >
            Nickname
          </label>
          <input
            id="setup-nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Es. Alex"
            className={`min-h-[44px] px-3 py-2 text-sm rounded-md border bg-white text-neutral-900 focus:outline-none ${
              errors.nickname
                ? 'border-red-600'
                : 'border-neutral-400 focus:border-neutral-900'
            }`}
          />
          {errors.nickname && (
            <span className="text-xs text-red-700">{errors.nickname}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-900">
            Scegli il campus
          </span>
          <div
            className={`flex flex-col gap-2 p-2 rounded-md border ${
              errors.campus ? 'border-red-600' : 'border-neutral-300'
            }`}
          >
            {CAMPUSES.map((item) => {
              const selected = campus === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCampus(item)}
                  className={`min-h-[44px] px-3 py-2 rounded border text-left text-sm flex items-center justify-between cursor-pointer ${
                    selected
                      ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900'
                      : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
                  }`}
                >
                  <span>{item}</span>
                  <span
                    className={`w-4 h-4 rounded-full border border-neutral-900 flex items-center justify-center`}
                  >
                    {selected && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.campus && (
            <span className="text-xs text-red-700">{errors.campus}</span>
          )}
        </div>
      </div>

      <Button variant="primary" fullWidth onClick={handleSave}>
        Salva e continua
      </Button>
    </div>
  );
};
