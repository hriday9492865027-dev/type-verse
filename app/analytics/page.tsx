'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getSessions, SessionResult } from '@/lib/storage/store';
import { BarChart3, TrendingUp, Target, Clock, ShieldCheck, Flame, Zap, Award, Info } from 'lucide-react';

const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const totalSessions = sessions.length;
  const bestWpm = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);
  const avgWpm = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / totalSessions)
    : 0;
  const avgAccuracy = totalSessions > 0
    ? (sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions).toFixed(1)
    : '100';
  const totalDurationMin = Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);

  // Keyboard heatmap data extraction
  const errorMap: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.keyStats) {
      Object.entries(s.keyStats).forEach(([k, stat]) => {
        const errorCount = (stat as { errors?: number })?.errors || 0;
        errorMap[k.toLowerCase()] = (errorMap[k.toLowerCase()] || 0) + errorCount;
      });
    }
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">In-Depth Analytics</h1>
              <p className="text-xs text-[#94A3B8]">
                Keystroke telemetry, speed trajectories, and keyboard error density heatmap.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <span className="text-xs text-[#94A3B8] font-mono uppercase">Top Speed</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1 tabular-nums">
              {bestWpm} <span className="text-xs text-[#8B5CF6]">WPM</span>
            </div>
            <span className="text-[11px] text-[#34D399] mt-1 block">Peak record</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <span className="text-xs text-[#94A3B8] font-mono uppercase">Average Velocity</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1 tabular-nums">
              {avgWpm} <span className="text-xs text-[#38BDF8]">WPM</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">Sustained speed</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <span className="text-xs text-[#94A3B8] font-mono uppercase">Avg Accuracy</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#34D399] mt-1 tabular-nums">
              {avgAccuracy}%
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">Error resilience</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <span className="text-xs text-[#94A3B8] font-mono uppercase">Completed Tests</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1 tabular-nums">
              {totalSessions}
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">{totalDurationMin} min total</span>
          </div>
        </div>

        {/* Keyboard Heatmap Analysis */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Keyboard Heatmap Density</h3>
              <p className="text-xs text-[#94A3B8]">
                Visualizing keys with highest mistake frequency across your typing history.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#182235] border border-white/10" /> 0 Errors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#8B5CF6]/30 border border-[#8B5CF6]/50" /> 1-2 Errors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500/60 border border-rose-400" /> High Mis-hits
              </span>
            </div>
          </div>

          {/* Render Interactive Heatmap */}
          <div className="flex flex-col gap-2 items-center py-4 bg-[#080B14]/60 p-6 rounded-2xl border border-white/[0.06]">
            {KEYBOARD_LAYOUT.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2">
                {row.map((k) => {
                  const errCount = errorMap[k] || 0;
                  let bgClass = 'bg-[#182235]/60 text-[#94A3B8] border-white/[0.06]';

                  if (errCount >= 4) {
                    bgClass = 'bg-rose-500/40 text-rose-200 border-rose-500/80 shadow-md shadow-rose-500/20';
                  } else if (errCount >= 1) {
                    bgClass = 'bg-[#8B5CF6]/30 text-purple-200 border-[#8B5CF6]/50';
                  }

                  return (
                    <div
                      key={k}
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl border flex flex-col items-center justify-center font-mono font-bold transition-transform hover:scale-105 ${bgClass}`}
                    >
                      <span className="text-sm sm:text-base uppercase">{k}</span>
                      <span className="text-[10px] font-normal opacity-70">
                        {errCount > 0 ? `${errCount} err` : '✓'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* PRD Metric Definitions Card */}
        <div className="p-6 rounded-3xl bg-[#182235]/60 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-sm font-bold text-white mb-3">
            <Info className="w-4 h-4 text-[#38BDF8]" />
            <span>Standard Metric Policies & Definitions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#94A3B8] leading-relaxed">
            <div className="p-3.5 rounded-xl bg-[#080B14]/50 border border-white/[0.04]">
              <strong className="text-white block font-mono mb-1">Standard Net WPM</strong>
              Calculated strictly as <code>(Correct Characters ÷ 5) ÷ Test Duration (Minutes)</code>. Uncorrected errors do not contribute to net score.
            </div>
            <div className="p-3.5 rounded-xl bg-[#080B14]/50 border border-white/[0.04]">
              <strong className="text-white block font-mono mb-1">Gross / Raw WPM</strong>
              Calculated as <code>(Total Typed Characters ÷ 5) ÷ Test Duration (Minutes)</code>, representing raw kinetic output independent of accuracy.
            </div>
            <div className="p-3.5 rounded-xl bg-[#080B14]/50 border border-white/[0.04]">
              <strong className="text-white block font-mono mb-1">Consistency Score</strong>
              Measures pacing stability across 1-second rolling windows using standard deviation. Higher scores indicate minimal pausing and fluid rhythm.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
