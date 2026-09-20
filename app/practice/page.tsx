'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getSessions } from '@/lib/storage/store';
import { computeKeyWeights, generateAdaptiveDrill, AdaptiveRecommendation, KeyWeight } from '@/lib/adaptive/algorithm';
import { soundManager } from '@/lib/sound/sound-effects';
import { calculateWpm, calculateAccuracy } from '@/lib/scoring/metrics';
import { Target, Sparkles, RotateCcw, Award, CheckCircle2, ArrowRight, BrainCircuit, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticePage() {
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [keyWeights, setKeyWeights] = useState<KeyWeight[]>([]);
  
  // Interactive drill state
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [drillWpm, setDrillWpm] = useState(0);
  const [drillAccuracy, setDrillAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Gather all key statistics from recent sessions
    const sessions = getSessions();
    const aggregateKeyStats: Record<string, { key: string; attempts: number; errors: number; totalLatencyMs: number }> = {};
    const recentErrors: Record<string, number> = {};

    sessions.forEach((s) => {
      if (s.keyStats) {
        Object.entries(s.keyStats).forEach(([k, stat]) => {
          if (!aggregateKeyStats[k]) {
            aggregateKeyStats[k] = { key: k, attempts: 0, errors: 0, totalLatencyMs: 0 };
          }
          aggregateKeyStats[k].attempts += stat.attempts;
          aggregateKeyStats[k].errors += stat.errors;
          aggregateKeyStats[k].totalLatencyMs += stat.totalLatencyMs;
        });
      }
      if (s.weakKeys) {
        s.weakKeys.forEach(k => {
          recentErrors[k] = (recentErrors[k] || 0) + 1;
        });
      }
    });

    // Fallback seed weak keys if user just started fresh
    if (Object.keys(aggregateKeyStats).length === 0) {
      aggregateKeyStats['p'] = { key: 'p', attempts: 18, errors: 5, totalLatencyMs: 5200 };
      aggregateKeyStats['b'] = { key: 'b', attempts: 14, errors: 4, totalLatencyMs: 4100 };
      aggregateKeyStats['y'] = { key: 'y', attempts: 12, errors: 3, totalLatencyMs: 3800 };
    }

    const weights = computeKeyWeights(aggregateKeyStats, recentErrors);
    setKeyWeights(weights);
    const rec = generateAdaptiveDrill(weights);
    setRecommendation(rec);
  }, []);

  const restartDrill = () => {
    setUserInput('');
    setStartTime(null);
    setCompleted(false);
    setDrillWpm(0);
    setDrillAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!recommendation || completed) return;

    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      restartDrill();
      return;
    }

    if (!startTime && e.key.length === 1) {
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      soundManager.playKeyClick(false);
      setUserInput(prev => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const expected = recommendation.generatedDrillText[userInput.length];
      const char = e.key;

      if (char === expected) {
        soundManager.playKeyClick(char === ' ');
      } else {
        soundManager.playError();
      }

      const updated = userInput + char;
      setUserInput(updated);

      // Finish check
      if (updated.length >= recommendation.generatedDrillText.length) {
        const durationSec = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
        let correct = 0;
        for (let i = 0; i < updated.length; i++) {
          if (updated[i] === recommendation.generatedDrillText[i]) correct++;
        }
        const acc = calculateAccuracy(correct, updated.length);
        const wpm = calculateWpm(correct, durationSec);

        setDrillAccuracy(acc);
        setDrillWpm(wpm);
        setCompleted(true);
        soundManager.playSuccess();
        try {
          confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Adaptive Practice Engine</h1>
            <p className="text-xs text-[#94A3B8]">
              Targeted drills synthesized from your keystroke error rates, reaction latencies, and recency model.
            </p>
          </div>
        </div>

        {/* Algorithm Diagnostics Banner */}
        {recommendation && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#182235] to-[#111827] border border-white/[0.1] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FB7185]/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#FB7185]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#FB7185] tracking-wider font-semibold">
                    Dynamic Rationale
                  </span>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {recommendation.rationale}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {recommendation.recommendedKeys.map(k => (
                  <span key={k} className="px-3 py-1 rounded-xl bg-[#FB7185]/20 border border-[#FB7185]/40 text-xs font-mono font-bold text-white uppercase">
                    Key: {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Drill Practice Card */}
        {recommendation && (
          <div className="p-8 rounded-3xl bg-[#111827]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                  Targeted Exercise Session
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Weak-Key Precision Drill</h3>
              </div>

              <button
                onClick={restartDrill}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Drill</span>
              </button>
            </div>

            {!completed ? (
              <div
                onClick={() => inputRef.current?.focus()}
                className="min-h-[160px] p-6 rounded-2xl bg-[#080B14]/80 border border-white/[0.08] cursor-text select-none text-xl md:text-2xl font-mono leading-relaxed tracking-wider"
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                  onKeyDown={handleKeyDown}
                  autoFocus
                />

                {recommendation.generatedDrillText.split('').map((char, index) => {
                  const isTyped = index < userInput.length;
                  const isCorrect = isTyped && userInput[index] === char;
                  const isCurrent = index === userInput.length;

                  let colorClass = 'text-[#94A3B8]/40';
                  if (isTyped) {
                    colorClass = isCorrect ? 'text-[#34D399]' : 'text-[#FB7185] bg-[#FB7185]/20 rounded-sm';
                  }

                  return (
                    <span key={index} className="relative inline">
                      {isCurrent && (
                        <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-[#8B5CF6] rounded-full animate-caret shadow-sm shadow-[#8B5CF6]" />
                      )}
                      <span className={`${colorClass} transition-colors duration-100`}>
                        {char}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#080B14]/80 border border-white/[0.08] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8]">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Targeted Drill Completed!</h3>
                <p className="text-xs text-[#94A3B8]">
                  Speed: <span className="font-bold text-white font-mono">{drillWpm} WPM</span> · Accuracy: <span className="font-bold text-[#34D399] font-mono">{drillAccuracy}%</span>
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={restartDrill}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Practice Another Set</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monitored Key Weights Table */}
        <div className="p-6 rounded-3xl bg-[#111827]/70 border border-white/[0.08]">
          <h3 className="text-lg font-bold text-white mb-1">Monitored Keystroke Health</h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Model weights: 55% Error Rate ($E_k$) + 25% Latency ($T_k$) + 20% Recency ($R_k$)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {keyWeights.slice(0, 6).map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-[#182235]/60 border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#080B14] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-white text-sm">
                    {item.key.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">
                      {item.weaknessScore > 0.25 ? 'High Bottleneck' : 'Proficient'}
                    </span>
                    <span className="block text-[11px] text-[#94A3B8]">
                      {(item.errorRate * 100).toFixed(0)}% mis-hits
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className={item.weaknessScore > 0.25 ? 'text-[#FB7185] font-bold' : 'text-[#34D399]'}>
                    W: {item.weaknessScore.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
