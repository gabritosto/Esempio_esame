import { useCallback, useEffect, useState } from 'react';
import { TabBar } from './components/layout/TabBar';
import {
  calculateStreak,
  computeMoodScore,
  createInitialAppState,
  createMockZones,
  formatDateISO,
  getZoneName,
} from './data/mockData';
import { AuthScreen } from './screens/AuthScreen';
import { BoardScreen } from './screens/BoardScreen';
import { CheckInConfirmScreen } from './screens/CheckInConfirmScreen';
import { CheckInDetailScreen } from './screens/CheckInDetailScreen';
import { CheckInMoodScreen } from './screens/CheckInMoodScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { NewPostScreen } from './screens/NewPostScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PostDetailScreen } from './screens/PostDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { SplashScreen } from './screens/SplashScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ZoneDetailScreen } from './screens/ZoneDetailScreen';
import {
  AppDataState,
  BoardPost,
  CheckIn,
  MoodLabel,
  ScreenId,
  TabId,
  UserSettings,
  ZoneId,
} from './types';

const STORAGE_KEY = 'moodmap_wireframe_state_v1';

function loadInitialState(): AppDataState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppDataState;
      if (parsed && Array.isArray(parsed.checkIns) && Array.isArray(parsed.zones)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial mock state
  }
  return createInitialAppState();
}

const TOP_LEVEL_SCREENS: ScreenId[] = ['home', 'map', 'board', 'profile'];

export default function App() {
  const [data, setData] = useState<AppDataState>(() => loadInitialState());
  const [screen, setScreen] = useState<ScreenId>('splash');

  // Navigation context state
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('mensa');
  const [selectedPostId, setSelectedPostId] = useState<string>('post-1');
  const [newPostZoneId, setNewPostZoneId] = useState<ZoneId | undefined>(undefined);
  const [historyOrigin, setHistoryOrigin] = useState<'home' | 'stats'>('stats');
  const [checkInOrigin, setCheckInOrigin] = useState<'home' | 'zone-detail' | 'history'>('home');

  // Check-in draft state
  const [draftMood, setDraftMood] = useState<MoodLabel | null>(null);
  const [draftIntensity, setDraftIntensity] = useState<number | null>(null);
  const [draftNote, setDraftNote] = useState<string>('');
  const [draftZoneId, setDraftZoneId] = useState<ZoneId>('mensa');
  const [draftAnonymous, setDraftAnonymous] = useState<boolean>(
    data.settings.defaultAnonymous
  );
  const [lastSavedCheckIn, setLastSavedCheckIn] = useState<{
    mood: MoodLabel;
    intensity: number;
    zoneId: ZoneId;
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota errors
    }
  }, [data]);

  const handleSplashFinish = useCallback(() => {
    setScreen(() => {
      if (!data.onboarded) return 'onboarding';
      if (!data.authenticated) return 'auth';
      if (!data.profileCompleted) return 'profile-setup';
      return 'home';
    });
  }, [data.onboarded, data.authenticated, data.profileCompleted]);

  const startCheckInFlow = (
    origin: 'home' | 'zone-detail' | 'history',
    preselectedZone?: ZoneId
  ) => {
    setCheckInOrigin(origin);
    setDraftMood(null);
    setDraftIntensity(null);
    setDraftNote('');
    setDraftZoneId(preselectedZone ?? 'mensa');
    setDraftAnonymous(data.settings.defaultAnonymous);
    setScreen('checkin-mood');
  };

  const handleSaveCheckIn = () => {
    if (!draftMood || draftIntensity === null) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const moodScore = computeMoodScore(draftMood, draftIntensity);

    const newCheckIn: CheckIn = {
      id: `ci-${Date.now()}`,
      date: formatDateISO(now),
      time: `${hh}:${mm}`,
      mood: draftMood,
      intensity: draftIntensity,
      moodScore,
      note: draftNote.trim(),
      zoneId: draftZoneId,
      anonymous: draftAnonymous,
    };

    setData((prev) => {
      const updatedZones = prev.zones.map((z) => {
        if (z.id !== draftZoneId) return z;

        const nextTodayCount = z.todayCount + 1;
        const nextTodayAvg = Number(
          ((z.todayAvg * z.todayCount + moodScore) / nextTodayCount).toFixed(1)
        );
        const nextWeekCount = z.weekCount + 1;
        const nextWeekAvg = Number(
          ((z.weekAvg * z.weekCount + moodScore) / nextWeekCount).toFixed(1)
        );

        const defaultHours = ['09', '11', '13', '15', '17', '19'];
        const currentHour = now.getHours();
        const closestHour = defaultHours.reduce((best, h) =>
          Math.abs(Number(h) - currentHour) < Math.abs(Number(best) - currentHour)
            ? h
            : best
        );

        const baseHourly =
          z.hourly.length > 0
            ? z.hourly
            : defaultHours.map((hour) => ({
                hour,
                value: hour === closestHour ? moodScore : 0,
                count: hour === closestHour ? 1 : 0,
              }));

        const nextHourly =
          z.hourly.length === 0
            ? baseHourly
            : baseHourly.map((bar) => {
                if (bar.hour !== closestHour) return bar;
                const nextBarCount = bar.count + 1;
                const nextBarVal = Number(
                  ((bar.value * bar.count + moodScore) / nextBarCount).toFixed(1)
                );
                return {
                  ...bar,
                  value: nextBarVal,
                  count: nextBarCount,
                };
              });

        return {
          ...z,
          todayCount: nextTodayCount,
          todayAvg: nextTodayAvg,
          weekCount: nextWeekCount,
          weekAvg: nextWeekAvg,
          hourly: nextHourly,
        };
      });

      return {
        ...prev,
        checkIns: [newCheckIn, ...prev.checkIns],
        zones: updatedZones,
      };
    });

    setLastSavedCheckIn({
      mood: draftMood,
      intensity: draftIntensity,
      zoneId: draftZoneId,
    });
    setSelectedZoneId(draftZoneId);
    setScreen('checkin-confirm');
  };

  const handleTogglePostLike = (postId: string) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;
        const likedByMe = !p.likedByMe;
        return {
          ...p,
          likedByMe,
          likes: likedByMe ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }),
    }));
  };

  const handleAddPostReply = (postId: string, text: string) => {
    setData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: [
            ...p.replies,
            {
              id: `rep-${Date.now()}`,
              author: 'Anonimo',
              text,
              timestamp: 'Adesso',
            },
          ],
        };
      }),
    }));
  };

  const handlePublishPost = (payload: {
    text: string;
    zoneId: ZoneId;
    anonymous: boolean;
  }) => {
    const newPost: BoardPost = {
      id: `post-${Date.now()}`,
      author: payload.anonymous ? 'Anonimo' : data.settings.nickname,
      anonymous: payload.anonymous,
      zoneId: payload.zoneId,
      text: payload.text,
      timestamp: 'Adesso',
      likes: 0,
      likedByMe: false,
      replies: [],
    };
    setData((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
    setScreen('board');
  };

  const handleUpdateSettings = (nextSettings: UserSettings) => {
    setData((prev) => ({
      ...prev,
      settings: nextSettings,
    }));
  };

  const handleClearCheckIns = () => {
    setData((prev) => ({
      ...prev,
      checkIns: [],
    }));
    setHistoryOrigin('home');
    setScreen('history');
  };

  const handleResetMock = () => {
    const fresh = createInitialAppState();
    setData({
      ...fresh,
      onboarded: true,
      authenticated: true,
      profileCompleted: true,
      settings: data.settings,
    });
    setScreen('home');
  };

  const handleLogout = () => {
    setData((prev) => ({
      ...prev,
      onboarded: false,
      authenticated: false,
      profileCompleted: false,
      zones: createMockZones(),
    }));
    setScreen('onboarding');
  };

  const activeTab: TabId =
    screen === 'map' || screen === 'zone-detail'
      ? 'map'
      : screen === 'board' || screen === 'board-detail' || screen === 'board-new'
      ? 'board'
      : screen === 'profile'
      ? 'profile'
      : 'home';

  const showTabBar = TOP_LEVEL_SCREENS.includes(screen);
  const currentZone =
    data.zones.find((z) => z.id === selectedZoneId) ?? data.zones[0];
  const currentPost =
    data.posts.find((p) => p.id === selectedPostId) ?? data.posts[0];

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center sm:p-4">
      {/* iPhone 16 fixed smartphone container 393x852 px */}
      <main
        aria-label="MoodMap Smartphone Wireframe"
        className="w-[393px] h-[852px] max-w-full max-h-[100dvh] bg-white border-2 border-neutral-900 sm:rounded-[32px] overflow-hidden flex flex-col"
      >
        {screen === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}

        {screen === 'onboarding' && (
          <OnboardingScreen
            onComplete={() => {
              setData((prev) => ({ ...prev, onboarded: true }));
              setScreen('auth');
            }}
          />
        )}

        {screen === 'auth' && (
          <AuthScreen
            defaultEmail={data.settings.email}
            onSuccess={(email) => {
              setData((prev) => ({
                ...prev,
                authenticated: true,
                settings: { ...prev.settings, email },
              }));
              setScreen(data.profileCompleted ? 'home' : 'profile-setup');
            }}
          />
        )}

        {screen === 'profile-setup' && (
          <ProfileSetupScreen
            initialNickname={data.settings.nickname}
            initialCampus={data.settings.campus}
            onComplete={(nickname, campus) => {
              setData((prev) => ({
                ...prev,
                profileCompleted: true,
                settings: { ...prev.settings, nickname, campus },
              }));
              setScreen('home');
            }}
          />
        )}

        {screen === 'home' && (
          <HomeScreen
            nickname={data.settings.nickname}
            checkIns={data.checkIns}
            onStartCheckIn={() => startCheckInFlow('home')}
          />
        )}

        {screen === 'checkin-mood' && (
          <CheckInMoodScreen
            selectedMood={draftMood}
            onSelectMood={setDraftMood}
            onBack={() => setScreen(checkInOrigin)}
            onContinue={() => setScreen('checkin-detail')}
          />
        )}

        {screen === 'checkin-detail' && draftMood && (
          <CheckInDetailScreen
            mood={draftMood}
            intensity={draftIntensity}
            note={draftNote}
            zoneId={draftZoneId}
            anonymous={draftAnonymous}
            zones={data.zones}
            onChangeIntensity={setDraftIntensity}
            onChangeNote={setDraftNote}
            onChangeZone={setDraftZoneId}
            onChangeAnonymous={setDraftAnonymous}
            onBack={() => setScreen('checkin-mood')}
            onSave={handleSaveCheckIn}
          />
        )}

        {screen === 'checkin-confirm' && lastSavedCheckIn && (
          <CheckInConfirmScreen
            mood={lastSavedCheckIn.mood}
            intensity={lastSavedCheckIn.intensity}
            zoneName={getZoneName(data.zones, lastSavedCheckIn.zoneId)}
            streak={calculateStreak(data.checkIns)}
            onGoHome={() => setScreen('home')}
            onGoMap={() => setScreen('map')}
          />
        )}

        {screen === 'map' && (
          <MapScreen
            zones={data.zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            onOpenZoneDetail={(id) => {
              setSelectedZoneId(id);
              setScreen('zone-detail');
            }}
          />
        )}

        {screen === 'zone-detail' && (
          <ZoneDetailScreen
            zone={currentZone}
            onBack={() => setScreen('map')}
            onFirstCheckIn={(zoneId) => startCheckInFlow('zone-detail', zoneId)}
            onOpenStats={() => setScreen('stats')}
          />
        )}

        {screen === 'stats' && (
          <StatsScreen
            checkIns={data.checkIns}
            onBack={() => setScreen('zone-detail')}
            onOpenHistory={() => {
              setHistoryOrigin('stats');
              setScreen('history');
            }}
          />
        )}

        {screen === 'history' && (
          <HistoryScreen
            checkIns={data.checkIns}
            zones={data.zones}
            onBack={() => setScreen(historyOrigin)}
            onStartCheckIn={() => startCheckInFlow('history')}
          />
        )}

        {screen === 'board' && (
          <BoardScreen
            posts={data.posts}
            zones={data.zones}
            onToggleLike={handleTogglePostLike}
            onOpenPost={(postId) => {
              setSelectedPostId(postId);
              setScreen('board-detail');
            }}
            onOpenNewPost={(zoneId) => {
              setNewPostZoneId(zoneId);
              setScreen('board-new');
            }}
          />
        )}

        {screen === 'board-detail' && currentPost && (
          <PostDetailScreen
            post={currentPost}
            zones={data.zones}
            onBack={() => setScreen('board')}
            onToggleLike={handleTogglePostLike}
            onAddReply={handleAddPostReply}
          />
        )}

        {screen === 'board-new' && (
          <NewPostScreen
            zones={data.zones}
            initialZoneId={newPostZoneId}
            defaultAnonymous={data.settings.defaultAnonymous}
            onBack={() => setScreen('board')}
            onPublish={handlePublishPost}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            settings={data.settings}
            onUpdateSettings={handleUpdateSettings}
            onClearCheckIns={handleClearCheckIns}
            onResetMock={handleResetMock}
            onLogout={handleLogout}
          />
        )}

        {showTabBar && (
          <TabBar
            activeTab={activeTab}
            onSelectTab={(tab) => setScreen(tab)}
          />
        )}
      </main>
    </div>
  );
}
