import { KeyStats } from '../typing-engine/types';

export function calculateWpm(correctChars: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

export function calculateRawWpm(totalTypedChars: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  const raw = (totalTypedChars / 5) / minutes;
  return Math.max(0, Math.round(raw));
}

export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars === 0) return 100;
  const acc = (correctChars / totalTypedChars) * 100;
  return Number(Math.max(0, Math.min(100, acc)).toFixed(1));
}

// Consistency measures how evenly paced the typing was (100 = perfectly even pace)
export function calculateConsistency(wpmSnapshots: number[]): number {
  if (wpmSnapshots.length < 3) return 100;
  const avg = wpmSnapshots.reduce((a, b) => a + b, 0) / wpmSnapshots.length;
  if (avg === 0) return 100;
  const variance = wpmSnapshots.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / wpmSnapshots.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / avg) * 100; // Coefficient of variation
  const score = Math.max(0, Math.min(100, 100 - cv));
  return Math.round(score);
}

// Identify top weak keys from key statistics
export function identifyWeakKeys(keyStats: Record<string, KeyStats>): string[] {
  const candidates: { key: string; score: number }[] = [];

  for (const [key, stat] of Object.entries(keyStats)) {
    if (stat.attempts < 2) continue; // Need minimum attempts before judging
    const errorRate = stat.errors / stat.attempts;
    const avgLatency = stat.totalLatencyMs / stat.attempts;
    
    // Score combines error rate heavily and latency moderately
    const score = (errorRate * 0.7) + (Math.min(avgLatency / 800, 1) * 0.3);
    if (errorRate > 0.1 || avgLatency > 400) {
      candidates.push({ key, score });
    }
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(c => c.key);
}
