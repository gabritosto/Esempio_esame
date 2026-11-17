import { AppDataState, BoardPost, CheckIn, MoodLabel, ZoneData, ZoneId } from '../types';

export const MOODS: { label: MoodLabel; baseScore: number }[] = [
  { label: 'Felice', baseScore: 5.0 },
  { label: 'Calmo', baseScore: 4.2 },
  { label: 'Carico', baseScore: 4.6 },
  { label: 'Stanco', baseScore: 2.4 },
  { label: 'Ansioso', baseScore: 2.0 },
  { label: 'Triste', baseScore: 1.6 },
  { label: 'Arrabbiato', baseScore: 1.4 },
  { label: 'Annoiato', baseScore: 2.6 },
  { label: 'Stressato', baseScore: 1.8 },
];

export const CAMPUSES: string[] = [
  'Campus Città Studi',
  'Campus Leonardo',
  'Campus Bovisa',
  'Campus Bicocca',
  'Campus Polo Centrale',
];

export function computeMoodScore(mood: MoodLabel, intensity: number): number {
  const found = MOODS.find((m) => m.label === mood);
  const base = found ? found.baseScore : 3.0;
  // Slightly modulate by intensity while staying within 1.0 - 5.0
  const delta = base >= 3.5 ? (intensity - 3) * 0.15 : -(intensity - 3) * 0.15;
  return Math.max(1, Math.min(5, Number((base + delta).toFixed(1))));
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getRelativeDateISO(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDateISO(d);
}

export function formatDateItalian(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function createMockCheckIns(): CheckIn[] {
  const pattern: {
    daysAgo: number;
    mood: MoodLabel;
    intensity: number;
    zoneId: ZoneId;
    time: string;
    note: string;
  }[] = [
    { daysAgo: 1, mood: 'Calmo', intensity: 4, zoneId: 'giardino', time: '16:20', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { daysAgo: 2, mood: 'Felice', intensity: 5, zoneId: 'cortile', time: '13:10', note: 'Lorem ipsum dolor sit amet.' },
    { daysAgo: 3, mood: 'Stanco', intensity: 3, zoneId: 'aula-studio', time: '18:45', note: '' },
    { daysAgo: 4, mood: 'Carico', intensity: 4, zoneId: 'palestra', time: '17:00', note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { daysAgo: 5, mood: 'Stressato', intensity: 4, zoneId: 'aula-studio', time: '15:30', note: 'Lorem ipsum dolor sit amet.' },
    { daysAgo: 6, mood: 'Calmo', intensity: 3, zoneId: 'mensa', time: '12:40', note: '' },
    { daysAgo: 7, mood: 'Felice', intensity: 4, zoneId: 'giardino', time: '11:15', note: 'Lorem ipsum dolor sit amet.' },
    { daysAgo: 8, mood: 'Annoiato', intensity: 2, zoneId: 'mensa', time: '14:00', note: '' },
    { daysAgo: 9, mood: 'Stanco', intensity: 4, zoneId: 'aula-studio', time: '19:05', note: 'Lorem ipsum dolor sit amet.' },
    { daysAgo: 10, mood: 'Ansioso', intensity: 3, zoneId: 'cortile', time: '09:30', note: '' },
    { daysAgo: 11, mood: 'Calmo', intensity: 4, zoneId: 'giardino', time: '15:10', note: 'Lorem ipsum dolor sit amet.' },
    { daysAgo: 12, mood: 'Carico', intensity: 5, zoneId: 'palestra', time: '18:00', note: '' },
    { daysAgo: 13, mood: 'Triste', intensity: 2, zoneId: 'mensa', time: '13:20', note: '' },
    { daysAgo: 14, mood: 'Felice', intensity: 4, zoneId: 'cortile', time: '10:45', note: 'Lorem ipsum dolor sit amet.' },
  ];

  return pattern.map((item, idx) => ({
    id: `mock-ci-${idx + 1}`,
    date: getRelativeDateISO(item.daysAgo),
    time: item.time,
    mood: item.mood,
    intensity: item.intensity,
    moodScore: computeMoodScore(item.mood, item.intensity),
    note: item.note,
    zoneId: item.zoneId,
    anonymous: true,
  }));
}

export function createMockZones(): ZoneData[] {
  return [
    {
      id: 'biblioteca',
      name: 'Biblioteca',
      todayAvg: 0,
      todayCount: 0,
      weekAvg: 0,
      weekCount: 0,
      hourly: [],
    },
    {
      id: 'mensa',
      name: 'Mensa',
      todayAvg: 3.6,
      todayCount: 18,
      weekAvg: 3.5,
      weekCount: 94,
      hourly: [
        { hour: '09', value: 3.2, count: 2 },
        { hour: '11', value: 3.5, count: 4 },
        { hour: '13', value: 4.1, count: 8 },
        { hour: '15', value: 3.4, count: 2 },
        { hour: '17', value: 3.0, count: 1 },
        { hour: '19', value: 3.3, count: 1 },
      ],
    },
    {
      id: 'aula-studio',
      name: 'Aula studio',
      todayAvg: 2.3,
      todayCount: 26,
      weekAvg: 2.5,
      weekCount: 142,
      hourly: [
        { hour: '09', value: 3.1, count: 4 },
        { hour: '11', value: 2.6, count: 6 },
        { hour: '13', value: 2.2, count: 4 },
        { hour: '15', value: 2.0, count: 7 },
        { hour: '17', value: 1.9, count: 3 },
        { hour: '19', value: 2.4, count: 2 },
      ],
    },
    {
      id: 'giardino',
      name: 'Giardino',
      todayAvg: 4.5,
      todayCount: 15,
      weekAvg: 4.3,
      weekCount: 78,
      hourly: [
        { hour: '09', value: 4.0, count: 2 },
        { hour: '11', value: 4.4, count: 3 },
        { hour: '13', value: 4.8, count: 5 },
        { hour: '15', value: 4.6, count: 3 },
        { hour: '17', value: 4.2, count: 2 },
        { hour: '19', value: 3.9, count: 0 },
      ],
    },
    {
      id: 'palestra',
      name: 'Palestra',
      todayAvg: 4.2,
      todayCount: 12,
      weekAvg: 4.1,
      weekCount: 64,
      hourly: [
        { hour: '09', value: 4.0, count: 2 },
        { hour: '11', value: 3.9, count: 1 },
        { hour: '13', value: 4.1, count: 2 },
        { hour: '15', value: 4.2, count: 2 },
        { hour: '17', value: 4.6, count: 3 },
        { hour: '19', value: 4.4, count: 2 },
      ],
    },
    {
      id: 'cortile',
      name: 'Cortile',
      todayAvg: 3.8,
      todayCount: 21,
      weekAvg: 3.9,
      weekCount: 110,
      hourly: [
        { hour: '09', value: 3.6, count: 3 },
        { hour: '11', value: 4.0, count: 5 },
        { hour: '13', value: 4.2, count: 6 },
        { hour: '15', value: 3.7, count: 4 },
        { hour: '17', value: 3.5, count: 2 },
        { hour: '19', value: 3.4, count: 1 },
      ],
    },
  ];
}

export function createMockPosts(): BoardPost[] {
  return [
    {
      id: 'post-1',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'aula-studio',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      timestamp: '20 min fa',
      likes: 14,
      likedByMe: false,
      replies: [
        {
          id: 'rep-1',
          author: 'Anonimo',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          timestamp: '12 min fa',
        },
        {
          id: 'rep-2',
          author: 'Anonimo',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
          timestamp: '5 min fa',
        },
      ],
    },
    {
      id: 'post-2',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'mensa',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
      timestamp: '1 ora fa',
      likes: 9,
      likedByMe: true,
      replies: [
        {
          id: 'rep-3',
          author: 'Anonimo',
          text: 'Duis aute irure dolor in reprehenderit in voluptate velit.',
          timestamp: '45 min fa',
        },
      ],
    },
    {
      id: 'post-3',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'giardino',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.',
      timestamp: '2 ore fa',
      likes: 22,
      likedByMe: false,
      replies: [
        {
          id: 'rep-4',
          author: 'Anonimo',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          timestamp: '1 ora fa',
        },
      ],
    },
    {
      id: 'post-4',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'cortile',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sunt in culpa qui officia deserunt.',
      timestamp: '3 ore fa',
      likes: 6,
      likedByMe: false,
      replies: [],
    },
    {
      id: 'post-5',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'aula-studio',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas.',
      timestamp: '5 ore fa',
      likes: 11,
      likedByMe: false,
      replies: [
        {
          id: 'rep-5',
          author: 'Anonimo',
          text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
          timestamp: '4 ore fa',
        },
      ],
    },
    {
      id: 'post-6',
      author: 'Anonimo',
      anonymous: true,
      zoneId: 'palestra',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis autem vel eum iure reprehenderit.',
      timestamp: 'Ieri',
      likes: 8,
      likedByMe: false,
      replies: [],
    },
  ];
}

export function createInitialAppState(): AppDataState {
  return {
    onboarded: false,
    authenticated: false,
    profileCompleted: false,
    settings: {
      nickname: 'Alex',
      campus: 'Campus Città Studi',
      email: 'studente@universita.it',
      theme: 'Chiaro (Wireframe)',
      language: 'Italiano',
      defaultAnonymous: true,
      showMoodOnMap: true,
      dailyReminder: true,
      reminderTime: '20:00',
    },
    checkIns: createMockCheckIns(),
    zones: createMockZones(),
    posts: createMockPosts(),
  };
}

export function calculateStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;
  const uniqueDates = new Set(checkIns.map((c) => c.date));
  let streak = 0;
  const todayISO = getRelativeDateISO(0);
  const yesterdayISO = getRelativeDateISO(1);

  let offset = uniqueDates.has(todayISO) ? 0 : uniqueDates.has(yesterdayISO) ? 1 : -1;
  if (offset === -1) return 0;

  while (uniqueDates.has(getRelativeDateISO(offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

export function calculateAverageMood(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;
  const sum = checkIns.reduce((acc, item) => acc + item.moodScore, 0);
  return Number((sum / checkIns.length).toFixed(1));
}

export function getZoneName(zones: ZoneData[], zoneId: ZoneId): string {
  return zones.find((z) => z.id === zoneId)?.name ?? zoneId;
}
