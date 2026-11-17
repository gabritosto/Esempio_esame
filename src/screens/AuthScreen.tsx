import React, { useState } from 'react';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';

interface AuthScreenProps {
  defaultEmail: string;
  onSuccess: (email: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  defaultEmail,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim() || !email.includes('@')) {
      nextErrors.email = 'Inserisci un indirizzo email valido';
    }
    if (!password.trim() || password.trim().length < 6) {
      nextErrors.password = 'Inserisci una password di almeno 6 caratteri';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSuccess(email.trim());
  };

  const hasError = Boolean(errors.email || errors.password);

  return (
    <div className="flex-1 overflow-y-auto wireframe-scroll px-6 py-8 bg-white flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            MoodMap
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">
            {mode === 'login' ? 'Accedi al tuo account' : 'Crea un account'}
          </h1>
          <p className="text-xs text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="grid grid-cols-2 border border-neutral-900 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrors({});
            }}
            className={`min-h-[44px] text-sm font-medium cursor-pointer ${
              mode === 'login'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-900'
            }`}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrors({});
            }}
            className={`min-h-[44px] text-sm font-medium cursor-pointer ${
              mode === 'register'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-900'
            }`}
          >
            Registrati
          </button>
        </div>

        {hasError && (
          <Banner
            title="Dati non validi"
            message="Controlla i campi evidenziati prima di continuare."
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-email"
              className="text-xs font-semibold text-neutral-900"
            >
              Email universitaria
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@universita.it"
              className={`min-h-[44px] px-3 py-2 text-sm rounded-md border bg-white text-neutral-900 focus:outline-none ${
                errors.email
                  ? 'border-red-600'
                  : 'border-neutral-400 focus:border-neutral-900'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-700">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="auth-password"
              className="text-xs font-semibold text-neutral-900"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`min-h-[44px] px-3 py-2 text-sm rounded-md border bg-white text-neutral-900 focus:outline-none ${
                errors.password
                  ? 'border-red-600'
                  : 'border-neutral-400 focus:border-neutral-900'
              }`}
            />
            {errors.password && (
              <span className="text-xs text-red-700">{errors.password}</span>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth>
            {mode === 'login' ? 'Accedi' : 'Registrati'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-300" />
          <span className="text-xs text-neutral-500">oppure</span>
          <div className="flex-1 h-px bg-neutral-300" />
        </div>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => onSuccess(email.trim() || 'studente@universita.it')}
        >
          Accedi con Google
        </Button>
      </div>

      <p className="text-[11px] text-neutral-500 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  );
};
