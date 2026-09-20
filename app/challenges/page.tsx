'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Trophy, Calendar, Sparkles, Play, Award, ShieldCheck, Flame, Users } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  timeSec: number;
  badge: string;
}

const DAILY_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'QuantumTyper', wpm: 124, accuracy: 99.4, timeSec: 60, badge: 'Grandmaster' },
  { rank: 2, username: 'CyberGhost', wpm: 118, accuracy: 98.8, timeSec: 60, badge: 'Master' },
  { rank: 3, username: 'Velociraptor', wpm: 109, accuracy: 98.2, timeSec: 60, badge: 'Diamond' },
  { rank: 4, username: 'TypistPrime', wpm: 68, accuracy: 97.2, timeSec: 60, badge: 'Gold' },
  { rank: 5, username: 'SilentSwitch', wpm: 64, accuracy: 96.5, timeSec: 60, badge: 'Silver' },
];

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'leaderboard'>('daily');

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Challenge Hub</h1>
              <p className="text-xs text-[#94A3B8]">
                Daily standardized trials with verified scoring, ghost replays, and competitive rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Daily Challenge Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E1B4B]/80 via-[#182235]/90 to-[#0F172A]/90 border border-white/[0.1] shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                DAILY CHALLENGE #142
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">Resets in 08h 24m</span>
            </div>

            <span className="text-xs font-mono text-[#38BDF8] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              Verified Standard Passage
            </span>
          </div>

          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The Matrix of Speed & Discipline
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Standard 60-second trial featuring balanced alphanumeric punctuation. All typists worldwide type the exact same synchronized passage.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">Target:</span> 60s Duration
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">Min Gate:</span> 95% Accuracy
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">Reward:</span> +250 XP & Badge
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 flex items-center justify-between">
            <Link
              href="/arena"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#080B14] font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Daily Trial</span>
            </Link>
          </div>
        </div>

        {/* Daily Leaderboard */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-lg font-bold text-white">Verified Global Rankings</h3>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">60s Standard Mode</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#94A3B8]">
                  <th className="pb-3 font-semibold w-16">Rank</th>
                  <th className="pb-3 font-semibold">Typist</th>
                  <th className="pb-3 font-semibold">Division</th>
                  <th className="pb-3 font-semibold">Speed</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {DAILY_LEADERBOARD.map((item) => (
                  <tr key={item.rank} className={`hover:bg-white/[0.02] ${item.username === 'TypistPrime' ? 'bg-[#8B5CF6]/10' : ''}`}>
                    <td className="py-3.5 font-bold">
                      {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                    </td>
                    <td className="py-3.5 text-white font-semibold flex items-center gap-2">
                      <span>{item.username}</span>
                      {item.username === 'TypistPrime' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#8B5CF6] text-white">YOU</span>
                      )}
                    </td>
                    <td className="py-3.5 text-[#38BDF8]">{item.badge}</td>
                    <td className="py-3.5 text-white font-bold text-sm">{item.wpm} WPM</td>
                    <td className="py-3.5 text-[#34D399] font-bold">{item.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
