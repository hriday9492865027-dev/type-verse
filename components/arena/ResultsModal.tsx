'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Target, LayoutDashboard, Zap, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SessionResult } from '@/lib/typing-engine/types';
import { evaluateSessionAchievements, Achievement } from '@/lib/storage/store';
import { AchievementToast } from '@/components/achievements/AchievementToast';

interface ResultsModalProps {
  result: SessionResult;
  onRetry: () => void;
}

export function ResultsModal({ result, onRetry }: ResultsModalProps) {
  const [unlocked, setUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    // Fire festive celebration if performance is exceptional
    if (result.accuracy >= 96 && result.wpm >= 50) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    // Evaluate session achievements
    const newlyUnlocked = evaluateSessionAchievements(result);
    if (newlyUnlocked.length > 0) {
      setUnlocked(newlyUnlocked[0]);
    }
  }, [result]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <AchievementToast achievement={unlocked} onClose={() => setUnlocked(null)} />
      <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#182235] to-[#111827] border border-white/[0.12] p-8 shadow-2xl shadow-[#8B5CF6]/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">Test Completed</h2>
              <p className="text-xs text-[#94A3B8]">
                Session recorded • Mode: <span className="uppercase font-mono text-[#38BDF8]">{result.mode}</span> • {result.durationSeconds}s
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-mono">Consistency</span>
            <div className="text-lg font-bold font-mono text-[#34D399]">{result.consistency}%</div>
          </div>
        </div>

        {/* Primary Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
          <div className="p-4 rounded-2xl bg-[#080B14]/60 border border-white/[0.06] text-center">
            <span className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider">Net WPM</span>
            <div className="text-4xl font-extrabold font-mono text-white mt-1 tabular-nums">
              {result.wpm}
            </div>
            <span className="text-[11px] text-[#38BDF8] mt-1 block">Raw {result.rawWpm} WPM</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B14]/60 border border-white/[0.06] text-center">
            <span className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider">Accuracy</span>
            <div className="text-4xl font-extrabold font-mono text-[#34D399] mt-1 tabular-nums">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">{result.correctChars} correct</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B14]/60 border border-white/[0.06] text-center">
            <span className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider">Errors</span>
            <div className="text-4xl font-extrabold font-mono text-[#FB7185] mt-1 tabular-nums">
              {result.incorrectChars}
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">missed strikes</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B14]/60 border border-white/[0.06] text-center">
            <span className="text-xs text-[#94A3B8] uppercase font-mono tracking-wider">Duration</span>
            <div className="text-4xl font-extrabold font-mono text-white mt-1 tabular-nums">
              {result.durationSeconds}s
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">Total time</span>
          </div>
        </div>

        {/* Diagnostic Key Breakdown */}
        {result.weakKeys && result.weakKeys.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FB7185]/10 border border-[#FB7185]/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#FB7185]/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#FB7185]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Targeted Weak Keys Detected</span>
                <p className="text-[11px] text-[#94A3B8]">
                  High mis-hit rate detected on keys: {result.weakKeys.map(k => `"${k.toUpperCase()}"`).join(', ')}
                </p>
              </div>
            </div>
            <Link
              href="/practice"
              className="px-3 py-1.5 rounded-xl bg-[#FB7185] hover:bg-[#F43F5E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#FB7185]/30 transition-all"
            >
              <span>Practice Keys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white text-xs font-medium flex items-center gap-2 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test (Tab + Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
