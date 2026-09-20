export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'custom';

export type TimeDuration = 15 | 30 | 60 | 120;
export type WordCountOption = 10 | 25 | 50 | 100;

export interface TestConfig {
  mode: TestMode;
  timeLimit?: TimeDuration;
  wordCount?: WordCountOption;
  customText?: string;
  codeLanguage?: 'javascript' | 'python' | 'html';
  quoteAuthor?: string;
}

export type TestState = 'idle' | 'running' | 'paused' | 'completed';

export interface KeyStats {
  key: string;
  attempts: number;
  errors: number;
  totalLatencyMs: number;
}

export interface SessionResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  durationSeconds: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  weakKeys: string[];
  wpmHistory: { second: number; wpm: number; rawWpm: number; errors: number }[];
  keyStats: Record<string, KeyStats>;
}

export interface UserPreferences {
  theme: 'cosmic' | 'obsidian' | 'cyberpunk' | 'light';
  soundEnabled: boolean;
  soundVolume: number;
  switchSound: 'mechanical' | 'thock' | 'tactile' | 'silent';
  fontFamily: 'geist-mono' | 'jetbrains-mono' | 'fira-code';
  smoothCaret: boolean;
  reducedMotion: boolean;
  showLiveWpm: boolean;
  showVirtualKeyboard: boolean;
}
