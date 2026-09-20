import { SessionResult, UserPreferences } from '../typing-engine/types';
export type { SessionResult, UserPreferences };

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface AcademyLesson {
  id: string;
  levelId: number;
  title: string;
  targetKeys: string[];
  sampleText: string;
  minAccuracy: number;
  unlocked: boolean;
  completed: boolean;
  bestAccuracy: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewardXp: number;
}

export interface GameRecords {
  fallingWordsHighScore: number;
  survivalMaxSeconds: number;
  typeQuestLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'quest' | 'arcade';
  rewardXp: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Steps', description: 'Complete your first typing session', icon: '🚀', category: 'streak', rewardXp: 100 },
  { id: 'precision_master', title: 'Precision Master', description: 'Achieve 98%+ accuracy in a test', icon: '🎯', category: 'accuracy', rewardXp: 200 },
  { id: 'velocity_demon', title: 'Velocity Demon', description: 'Reach 70+ WPM in any speed test', icon: '⚡', category: 'speed', rewardXp: 250 },
  { id: 'consistency_king', title: 'Consistent Typist', description: 'Maintain 85%+ consistency in a session', icon: '🔥', category: 'streak', rewardXp: 150 },
  { id: 'quest_champion', title: 'Quest Champion', description: 'Conquer Stage 1 in TypeQuest Campaign', icon: '⚔️', category: 'quest', rewardXp: 300 },
  { id: 'arcade_legend', title: 'Arcade Legend', description: 'Score 500+ points in Falling Words', icon: '🎮', category: 'arcade', rewardXp: 250 },
  { id: 'survival_expert', title: 'Survivalist', description: 'Survive for 40+ seconds in Survival Rush', icon: '⏱️', category: 'arcade', rewardXp: 200 },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'cosmic',
  soundEnabled: true,
  soundVolume: 0.5,
  switchSound: 'mechanical',
  fontFamily: 'geist-mono',
  smoothCaret: true,
  reducedMotion: false,
  showLiveWpm: true,
  showVirtualKeyboard: true,
};

const DEFAULT_PROFILE: UserProfile = {
  username: 'TypistPrime',
  displayName: 'Star Typist',
  avatarUrl: '⚡',
  level: 3,
  xp: 480,
  streakDays: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const INITIAL_LESSONS: AcademyLesson[] = [
  // Level 1: Home Row
  { id: 'l1-1', levelId: 1, title: 'F & J Anchors', targetKeys: ['F', 'J'], sampleText: 'fff jjj fjf jfj ff jj fj jf ffjj jjff ffff jjjj', minAccuracy: 95, unlocked: true, completed: true, bestAccuracy: 98 },
  { id: 'l1-2', levelId: 1, title: 'D & K Balance', targetKeys: ['D', 'K'], sampleText: 'ddd kkk dkd kdk dd kk dk kd fjdk kdjf ddkk ffjj', minAccuracy: 95, unlocked: true, completed: true, bestAccuracy: 96 },
  { id: 'l1-3', levelId: 1, title: 'S & L Reach', targetKeys: ['S', 'L'], sampleText: 'sss lll sls lsl ss ll sl ls flask salad skald fall', minAccuracy: 95, unlocked: true, completed: false, bestAccuracy: 91 },
  { id: 'l1-4', levelId: 1, title: 'A & Semicolon Final', targetKeys: ['A', ';'], sampleText: 'aaa ;;; a;a ;a; asdf ;lkj all fall ask flash lass', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
  
  // Level 2: Top Row
  { id: 'l2-1', levelId: 2, title: 'E & I Core Vowels', targetKeys: ['E', 'I'], sampleText: 'eee iii eie iei die kid feel lake life side files like', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
  { id: 'l2-2', levelId: 2, title: 'R & U Exploration', targetKeys: ['R', 'U'], sampleText: 'rrr uuu rur uru run rule user sure fire pure true surf', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
  { id: 'l2-3', levelId: 2, title: 'T & Y Extension', targetKeys: ['T', 'Y'], sampleText: 'ttt yyy tyt yty try type stay city text style today yet', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },

  // Level 3: Bottom Row
  { id: 'l3-1', levelId: 3, title: 'C & M Index', targetKeys: ['C', 'M'], sampleText: 'ccc mmm cmc mcm come calm music micro claim macro', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
  { id: 'l3-2', levelId: 3, title: 'V & N Precision', targetKeys: ['V', 'N'], sampleText: 'vvv nnn vnv nvn vine view never novel even oven vein', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
  { id: 'l3-3', levelId: 3, title: 'Z, X, & B Edges', targetKeys: ['Z', 'X', 'B'], sampleText: 'zzz xxx bbb box zero buzz extra bonus blend exact zone', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },

  // Level 4: Speed & Consistency
  { id: 'l4-1', levelId: 4, title: 'Capitalization & Shift', targetKeys: ['Shift'], sampleText: 'The Quick Brown Fox Jumps Over The Lazy Dog Today', minAccuracy: 96, unlocked: false, completed: false, bestAccuracy: 0 },
  { id: 'l4-2', levelId: 4, title: 'Numbers & Symbols', targetKeys: ['1-0', '!@#'], sampleText: 'Item 42 costs $19.99! Use code #TYPE99 for 25% discount.', minAccuracy: 95, unlocked: false, completed: false, bestAccuracy: 0 },
];

const INITIAL_MISSIONS: DailyMission[] = [
  { id: 'm1', title: 'Accuracy Sprint', description: 'Complete 2 tests with >96% accuracy', progress: 1, maxProgress: 2, completed: false, rewardXp: 150 },
  { id: 'm2', title: 'Velocity Target', description: 'Achieve at least 65 WPM in any 30s or 60s test', progress: 1, maxProgress: 1, completed: true, rewardXp: 100 },
  { id: 'm3', title: 'Game Zone Master', description: 'Score 500+ points in Falling Words arcade', progress: 320, maxProgress: 500, completed: false, rewardXp: 200 },
];

const STORAGE_KEYS = {
  PREFS: 'typeverse_prefs_v1',
  PROFILE: 'typeverse_profile_v1',
  SESSIONS: 'typeverse_sessions_v1',
  LESSONS: 'typeverse_lessons_v1',
  MISSIONS: 'typeverse_missions_v1',
  GAMES: 'typeverse_games_v1',
};

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch {}
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
}

export function getSessions(): SessionResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      // Seed 3 realistic initial sessions so analytics & dashboard look populated and authentic
      const seedSessions: SessionResult[] = [
        {
          id: 'seed-1',
          timestamp: Date.now() - 86400000 * 2,
          mode: 'time',
          durationSeconds: 60,
          wpm: 62,
          rawWpm: 66,
          accuracy: 96.5,
          consistency: 84,
          totalChars: 330,
          correctChars: 318,
          incorrectChars: 12,
          extraChars: 0,
          missedChars: 0,
          weakKeys: ['p', 'b'],
          wpmHistory: [
            { second: 15, wpm: 58, rawWpm: 60, errors: 2 },
            { second: 30, wpm: 62, rawWpm: 65, errors: 4 },
            { second: 45, wpm: 64, rawWpm: 67, errors: 8 },
            { second: 60, wpm: 62, rawWpm: 66, errors: 12 },
          ],
          keyStats: {
            p: { key: 'p', attempts: 18, errors: 4, totalLatencyMs: 4200 },
            b: { key: 'b', attempts: 14, errors: 3, totalLatencyMs: 3900 }
          }
        },
        {
          id: 'seed-2',
          timestamp: Date.now() - 86400000,
          mode: 'time',
          durationSeconds: 30,
          wpm: 68,
          rawWpm: 71,
          accuracy: 97.2,
          consistency: 89,
          totalChars: 180,
          correctChars: 175,
          incorrectChars: 5,
          extraChars: 0,
          missedChars: 0,
          weakKeys: ['y'],
          wpmHistory: [
            { second: 10, wpm: 65, rawWpm: 68, errors: 1 },
            { second: 20, wpm: 70, rawWpm: 72, errors: 3 },
            { second: 30, wpm: 68, rawWpm: 71, errors: 5 },
          ],
          keyStats: {
            y: { key: 'y', attempts: 12, errors: 2, totalLatencyMs: 2900 }
          }
        }
      ];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(seedSessions));
      return seedSessions;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSession(session: SessionResult) {
  if (typeof window === 'undefined') return;
  try {
    const list = getSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list.slice(0, 100))); // Keep last 100

    // Add XP to profile
    const profile = getUserProfile();
    const gainedXp = Math.round(session.wpm * (session.accuracy / 100) * 1.2);
    profile.xp += gainedXp;
    if (profile.xp >= profile.level * 300) {
      profile.level += 1;
    }
    saveUserProfile(profile);
  } catch {}
}

export function getLessons(): AcademyLesson[] {
  if (typeof window === 'undefined') return INITIAL_LESSONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return raw ? JSON.parse(raw) : INITIAL_LESSONS;
  } catch {
    return INITIAL_LESSONS;
  }
}

export function updateLessonCompletion(lessonId: string, accuracy: number) {
  if (typeof window === 'undefined') return;
  try {
    const lessons = getLessons();
    const targetIdx = lessons.findIndex(l => l.id === lessonId);
    if (targetIdx !== -1) {
      const lesson = lessons[targetIdx];
      lesson.bestAccuracy = Math.max(lesson.bestAccuracy, accuracy);
      if (accuracy >= lesson.minAccuracy) {
        lesson.completed = true;
        // Unlock next lesson
        if (targetIdx + 1 < lessons.length) {
          lessons[targetIdx + 1].unlocked = true;
        }
      }
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    }
  } catch {}
}

export function getDailyMissions(): DailyMission[] {
  if (typeof window === 'undefined') return INITIAL_MISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return raw ? JSON.parse(raw) : INITIAL_MISSIONS;
  } catch {
    return INITIAL_MISSIONS;
  }
}

export function getGameRecords(): GameRecords {
  const fallback: GameRecords = { fallingWordsHighScore: 420, survivalMaxSeconds: 45, typeQuestLevel: 2 };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveGameRecord(key: keyof GameRecords, score: number) {
  if (typeof window === 'undefined') return;
  try {
    const records = getGameRecords();
    if (score > records[key]) {
      records[key] = score;
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(records));
    }
  } catch {}
}

const ACHIEVEMENTS_KEY = 'typeverse_achievements_v1';

export function getUserAchievements(): UserAchievement[] {
  if (typeof window === 'undefined') {
    return [{ achievementId: 'first_step', unlockedAt: new Date().toISOString() }];
  }
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) {
      const seed: UserAchievement[] = [{ achievementId: 'first_step', unlockedAt: new Date().toISOString() }];
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [{ achievementId: 'first_step', unlockedAt: new Date().toISOString() }];
  }
}

export function unlockAchievement(achievementId: string): Achievement | null {
  if (typeof window === 'undefined') return null;
  try {
    const list = getUserAchievements();
    if (list.some(a => a.achievementId === achievementId)) return null;

    const ach = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return null;

    list.push({ achievementId, unlockedAt: new Date().toISOString() });
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list));

    // Award XP
    const profile = getUserProfile();
    profile.xp += ach.rewardXp;
    if (profile.xp >= profile.level * 300) {
      profile.level += 1;
    }
    saveUserProfile(profile);

    return ach;
  } catch {
    return null;
  }
}

export function evaluateSessionAchievements(session: SessionResult): Achievement[] {
  const unlocked: Achievement[] = [];
  
  // First step
  const a1 = unlockAchievement('first_step');
  if (a1) unlocked.push(a1);

  // Precision master
  if (session.accuracy >= 98) {
    const a = unlockAchievement('precision_master');
    if (a) unlocked.push(a);
  }

  // Velocity demon
  if (session.wpm >= 70) {
    const a = unlockAchievement('velocity_demon');
    if (a) unlocked.push(a);
  }

  // Consistent typist
  if (session.consistency >= 85) {
    const a = unlockAchievement('consistency_king');
    if (a) unlocked.push(a);
  }

  return unlocked;
}

