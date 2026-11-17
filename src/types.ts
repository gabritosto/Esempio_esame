export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'profile-setup'
  | 'home'
  | 'checkin-mood'
  | 'checkin-detail'
  | 'checkin-confirm'
  | 'map'
  | 'zone-detail'
  | 'stats'
  | 'history'
  | 'board'
  | 'board-detail'
  | 'board-new'
  | 'profile';

export type TabId = 'home' | 'map' | 'board' | 'profile';

export type MoodLabel =
  | 'Felice'
  | 'Calmo'
  | 'Carico'
  | 'Stanco'
  | 'Ansioso'
  | 'Triste'
  | 'Arrabbiato'
  | 'Annoiato'
  | 'Stressato';

export type ZoneId =
  | 'biblioteca'
  | 'mensa'
  | 'aula-studio'
  | 'giardino'
  | 'palestra'
  | 'cortile';

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: MoodLabel;
  intensity: number; // 1 to 5
  moodScore: number; // 1.0 to 5.0
  note: string;
  zoneId: ZoneId;
  anonymous: boolean;
}

export interface HourlyBar {
  hour: string;
  value: number; // 1 to 5
  count: number;
}

export interface ZoneData {
  id: ZoneId;
  name: string;
  todayAvg: number; // 0 when empty
  todayCount: number;
  weekAvg: number; // 0 when empty
  weekCount: number;
  hourly: HourlyBar[];
}

export interface PostReply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface BoardPost {
  id: string;
  author: string;
  anonymous: boolean;
  zoneId: ZoneId;
  text: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  replies: PostReply[];
}

export interface UserSettings {
  nickname: string;
  campus: string;
  email: string;
  theme: 'Chiaro (Wireframe)';
  language: 'Italiano' | 'English';
  defaultAnonymous: boolean;
  showMoodOnMap: boolean;
  dailyReminder: boolean;
  reminderTime: string;
}

export interface AppDataState {
  onboarded: boolean;
  authenticated: boolean;
  profileCompleted: boolean;
  settings: UserSettings;
  checkIns: CheckIn[];
  zones: ZoneData[];
  posts: BoardPost[];
}
