import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  calculateAverageMood,
  calculateStreak,
  formatDateISO,
} from '../data/mockData';
import { CheckIn } from '../types';

interface HomeScreenProps {
  nickname: string;
  checkIns: CheckIn[];
  onStartCheckIn: () => void;
}

const WEEK_LETTERS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

const LUMINOSITY_SCALE: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-[#FAFAFA]', text: 'text-neutral-900' },
  2: { bg: 'bg-[#EDEDED]', text: 'text-neutral-900' },
  3: { bg: 'bg-[#DCDCDC]', text: 'text-neutral-900' },
  4: { bg: 'bg-[#C4C4C4]', text: 'text-neutral-900' },
  5: { bg: 'bg-[#A8A8A8]', text: 'text-neutral-900' },
  6: { bg: 'bg-[#8C8C8C]', text: 'text-white' },
  7: { bg: 'bg-[#6E6E6E]', text: 'text-white' },
  8: { bg: 'bg-[#4F4F4F]', text: 'text-white' },
  9: { bg: 'bg-[#2E2E2E]', text: 'text-white' },
  10: { bg: 'bg-[#111111]', text: 'text-white' },
};

function getCurrentWeekDates(): { letter: string; iso: string }[] {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon..6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  return WEEK_LETTERS.map((letter, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    return {
      letter,
      iso: formatDateISO(d),
    };
  });
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  nickname,
  checkIns,
  onStartCheckIn,
}) => {
  const streak = calculateStreak(checkIns);
  const avgMood = calculateAverageMood(checkIns);
  const weekDates = getCurrentWeekDates();
  const todayISO = formatDateISO(new Date());
  const hasTodayCheckIn = checkIns.some((c) => c.date === todayISO);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 pt-6 pb-4 flex flex-col gap-4">
        {/* Greeting */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold text-neutral-900">
            Ciao, {nickname}
          </h2>
          <p className="text-xs text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Main CTA Card */}
        <Card tone="subtle" className="flex flex-col gap-3 border-neutral-900">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-neutral-900">
              Come ti senti oggi?
            </h3>
            <p className="text-xs text-neutral-600">
              {hasTodayCheckIn
                ? 'Hai già registrato un check-in oggi. Puoi aggiungerne un altro.'
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
            </p>
          </div>
          <Button variant="primary" fullWidth onClick={onStartCheckIn}>
            Registra il tuo umore
          </Button>
        </Card>

        {/* Summary 3 metrics */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Riepilogo
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 flex flex-col gap-1 items-center text-center">
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                {streak}g
              </span>
              <span className="text-[11px] text-neutral-600">Streak</span>
            </Card>
            <Card className="p-3 flex flex-col gap-1 items-center text-center">
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                {checkIns.length}
              </span>
              <span className="text-[11px] text-neutral-600">Check-in</span>
            </Card>
            <Card className="p-3 flex flex-col gap-1 items-center text-center">
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                {avgMood > 0 ? avgMood.toFixed(1) : '-'}
              </span>
              <span className="text-[11px] text-neutral-600">Umore medio</span>
            </Card>
          </div>
        </div>

        {/* Weekly Trend Circles (1-10 luminosity scale: 1 near white -> 10 near black) */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">
              Andamento della settimana
            </h3>
            <span className="text-[11px] text-neutral-500">1 – 10</span>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-1">
            {weekDates.map((day) => {
              const dayCheckIns = checkIns.filter((c) => c.date === day.iso);
              const latest = dayCheckIns[0];
              const isToday = day.iso === todayISO;

              const score10 = latest
                ? Math.max(1, Math.min(10, Math.round(latest.moodScore * 2)))
                : null;

              let circleStyle = 'bg-white border-neutral-400 text-neutral-400';
              if (score10 !== null) {
                const step = LUMINOSITY_SCALE[score10];
                circleStyle = `${step.bg} ${step.text} border-neutral-900`;
              } else if (isToday) {
                circleStyle =
                  'bg-white border-neutral-900 border-dashed text-neutral-900';
              }

              return (
                <div
                  key={day.iso}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-9 h-9 rounded-full border flex items-center justify-center text-[11px] font-semibold tabular-nums ${circleStyle}`}
                    title={
                      latest && score10 !== null
                        ? `${latest.mood} (${score10}/10)`
                        : 'Nessun check-in'
                    }
                  >
                    {score10 !== null ? score10 : ''}
                  </div>
                  <span
                    className={`text-[11px] ${
                      isToday
                        ? 'font-bold text-neutral-900 underline'
                        : 'text-neutral-600'
                    }`}
                  >
                    {day.letter}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
