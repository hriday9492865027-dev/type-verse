// Adaptive Practice Algorithm matching TYPEVERSE PRD Specification (Page 12)
// Formula: Wk = a*Ek + b*Tk + c*Rk

import { KeyStats } from '../typing-engine/types';
import { COMMON_WORDS } from '../typing-engine/words-data';

export interface KeyWeight {
  key: string;
  errorRate: number;      // Ek
  timeDifficulty: number; // Tk
  recencyWeight: number;  // Rk
  weaknessScore: number;  // Wk
  explanation: string;
}

export interface AdaptiveRecommendation {
  recommendedKeys: string[];
  rationale: string;
  generatedDrillText: string;
  drillType: 'weak-key-burst' | 'balanced-pattern' | 'general-flow';
}

const A_WEIGHT = 0.55; // Weight on Error Rate
const B_WEIGHT = 0.25; // Weight on Latency / Time Difficulty
const C_WEIGHT = 0.20; // Weight on Recency / Frequency

export function computeKeyWeights(
  keyStats: Record<string, KeyStats>,
  recentKeyErrors: Record<string, number> = {}
): KeyWeight[] {
  const results: KeyWeight[] = [];

  for (const [key, stat] of Object.entries(keyStats)) {
    // PRD: "Use sufficient data before labeling a weakness" (at least 3 attempts)
    if (stat.attempts < 3) continue;

    const Ek = stat.errors / stat.attempts; // 0 to 1
    const avgLatencyMs = stat.totalLatencyMs / stat.attempts;
    const Tk = Math.min(1, Math.max(0, (avgLatencyMs - 150) / 450)); // Normalize 150ms-600ms
    const recentErrors = recentKeyErrors[key] || 0;
    const Rk = Math.min(1, recentErrors / 4);

    const Wk = (A_WEIGHT * Ek) + (B_WEIGHT * Tk) + (C_WEIGHT * Rk);

    let explanation = `Normal proficiency (${Math.round((1 - Ek) * 100)}% accuracy)`;
    if (Wk > 0.35) {
      explanation = `High error rate (${Math.round(Ek * 100)}%) with ${Math.round(avgLatencyMs)}ms response latency.`;
    } else if (Ek > 0.2) {
      explanation = `Frequently missed key with ${(Ek * 100).toFixed(0)}% mis-hits.`;
    } else if (Tk > 0.6) {
      explanation = `Slow reaction time (${Math.round(avgLatencyMs)}ms).`;
    }

    results.push({
      key,
      errorRate: Ek,
      timeDifficulty: Tk,
      recencyWeight: Rk,
      weaknessScore: Wk,
      explanation
    });
  }

  // Sort by highest weakness score descending
  return results.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

// Generate tailored drills focusing on weak keys
export function generateAdaptiveDrill(weights: KeyWeight[]): AdaptiveRecommendation {
  const weakKeys = weights.filter(w => w.weaknessScore > 0.25).slice(0, 3).map(w => w.key.toLowerCase());

  if (weakKeys.length === 0) {
    return {
      recommendedKeys: [],
      rationale: "All monitored keys show strong accuracy (>92%). Recommending high-tempo rhythm practice.",
      generatedDrillText: "the quick rhythm flows naturally when each keystroke strikes with steady confidence and focus across the entire keyboard matrix",
      drillType: 'general-flow'
    };
  }

  // Find words containing these weak letters
  const targetedWords = COMMON_WORDS.filter(w => {
    const lower = w.toLowerCase();
    return weakKeys.some(k => lower.includes(k));
  });

  // Build targeted sentences
  const drillWords: string[] = [];
  
  // Mix specific key repetitions with real words containing the target keys
  weakKeys.forEach(k => {
    drillWords.push(`${k}${k} ${k}e ${k}a ${k}o`);
  });

  const selectedWords = targetedWords.slice(0, 16);
  if (selectedWords.length > 0) {
    drillWords.push(...selectedWords);
  } else {
    drillWords.push("practice", "progress", "precision", "pattern");
  }

  const generatedDrillText = drillWords.join(" ");
  const formattedKeys = weakKeys.map(k => `"${k.toUpperCase()}"`).join(", ");
  const topWeight = weights[0];

  return {
    recommendedKeys: weakKeys,
    rationale: `Targeting keys ${formattedKeys}: ${topWeight.explanation}`,
    generatedDrillText,
    drillType: 'weak-key-burst'
  };
}
