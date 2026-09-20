'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Gamepad2, Flame, Play, Trophy, Sparkles, Zap, Shield, Swords } from 'lucide-react';
import { getGameRecords, GameRecords } from '@/lib/storage/store';

export default function GameZonePage() {
  const [records, setRecords] = useState<GameRecords>({
    fallingWordsHighScore: 0,
    survivalMaxSeconds: 0,
    typeQuestLevel: 1
  });

  useEffect(() => {
    setRecords(getGameRecords());
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Game Zone</h1>
              <p className="text-xs text-[#94A3B8]">
                Immersive arcade challenges that convert mechanical typing practice into high-speed reflexes.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game 1: Falling Words */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#182235]/80 to-[#111827]/90 border border-white/[0.1] hover:border-[#38BDF8]/40 transition-all group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  Arcade Cascade
                </span>
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Best: {records.fallingWordsHighScore} pts
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/20 flex items-center justify-center mb-4 text-[#38BDF8]">
                <Zap className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                Falling Words
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Words cascade down the atmosphere. Strike every letter before they hit the ground shields. Chain combos for massive multipliers.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="text-[11px] font-mono text-[#94A3B8]">
                Escalating Gravity
              </div>
              <Link
                href="/games/falling-words"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#38BDF8]/30 hover:shadow-[#38BDF8]/50 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Game</span>
              </Link>
            </div>
          </div>

          {/* Game 2: Survival Mode */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#182235]/80 to-[#111827]/90 border border-white/[0.1] hover:border-[#FB7185]/40 transition-all group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30">
                  Time Attack
                </span>
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Record: {records.survivalMaxSeconds}s
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#FB7185]/20 flex items-center justify-center mb-4 text-[#FB7185]">
                <Flame className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#FB7185] transition-colors">
                Survival Rush
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                The clock starts at 15 seconds and drains rapidly. Every correct word gives you bonus seconds. How long can you survive?
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="text-[11px] font-mono text-[#94A3B8]">
                Continuous Drain
              </div>
              <Link
                href="/games/survival"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FB7185]/30 hover:shadow-[#FB7185]/50 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Rush</span>
              </Link>
            </div>
          </div>

          {/* Game 3: TypeQuest */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#182235]/80 to-[#111827]/90 border border-white/[0.1] hover:border-[#8B5CF6]/40 transition-all group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  Mission Campaign
                </span>
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Chapter {records.typeQuestLevel}
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mb-4 text-[#8B5CF6]">
                <Swords className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                TypeQuest
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                RPG typing trial missions: unlock character titles, clear rhythmic boss gates, and earn XP rewards for your master profile.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="text-[11px] font-mono text-[#94A3B8]">
                Story Progression
              </div>
              <Link
                href="/games/typequest"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Trial</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
