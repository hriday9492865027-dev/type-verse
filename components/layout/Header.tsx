'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Shield, Zap, Sparkles, User } from 'lucide-react';
import { soundManager } from '@/lib/sound/sound-effects';
import { getUserProfile, UserProfile } from '@/lib/storage/store';

export function Header() {
  const [soundOn, setSoundOn] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
    setSoundOn(soundManager.isEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundEnabled(next);
    if (next) {
      soundManager.playKeyClick(false);
    }
  };

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#080B14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left indicator */}
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse mr-2" />
          TYPEVERSE ENGINE v1.0
        </span>
        <span className="text-xs text-[#94A3B8] hidden md:inline-block">
          Low-latency Desktop Optimized
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-4">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
            soundOn
              ? 'bg-[#182235] border-[#8B5CF6]/40 text-white shadow-sm shadow-[#8B5CF6]/20'
              : 'bg-white/[0.03] border-white/[0.08] text-[#94A3B8] hover:text-white'
          }`}
          title={soundOn ? 'Mechanical Audio Enabled' : 'Audio Muted'}
          aria-label="Toggle Mechanical Switch Sound"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-[#8B5CF6]" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono">{soundOn ? 'AUDIO ON' : 'MUTED'}</span>
        </button>

        {/* Quick Arena Launch CTA */}
        <Link
          href="/arena"
          className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white text-xs font-semibold shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Quick Test</span>
        </Link>

        {/* User Level Capsule */}
        {profile && (
          <div className="flex items-center space-x-3 pl-2 border-l border-white/[0.08]">
            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                {profile.displayName}
                <Sparkles className="w-3 h-3 text-[#38BDF8]" />
              </span>
              <span className="text-[10px] font-mono text-[#38BDF8]">
                Lvl {profile.level} • {profile.xp} XP
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#38BDF8]/40 flex items-center justify-center text-sm font-bold shadow-inner">
              {profile.avatarUrl}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
