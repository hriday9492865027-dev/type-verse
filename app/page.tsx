'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Keyboard, 
  Gamepad2, 
  GraduationCap, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Target, 
  ShieldCheck, 
  Flame, 
  Play 
} from 'lucide-react';
import { soundManager } from '@/lib/sound/sound-effects';

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState('');
  const demoTarget = "Type. Train. Compete. Evolve. Welcome to TYPEVERSE.";

  useEffect(() => {
    // Auto-typing animation on landing page preview
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= demoTarget.length) {
        setDemoInput(demoTarget.slice(0, idx));
        idx++;
      } else {
        setTimeout(() => { idx = 0; }, 2000);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/30">
      {/* Top Navigation */}
      <header className="h-20 border-b border-white/[0.08] bg-[#080B14]/80 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            TYPEVERSE
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#94A3B8]">
          <Link href="/arena" className="hover:text-white transition-colors">Arena</Link>
          <Link href="/academy" className="hover:text-white transition-colors">Skill Academy</Link>
          <Link href="/games" className="hover:text-white transition-colors">Game Zone</Link>
          <Link href="/challenges" className="hover:text-white transition-colors">Challenges</Link>
          <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/arena"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-xs font-bold text-white shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Typing</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#8B5CF6]/20 to-[#38BDF8]/20 blur-[130px] -z-10 pointer-events-none rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
            The Hybrid Typing Improvement Platform
          </span>
        </div>

        {/* Main headline */}
        <h1 className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
          Type. Train. Compete.{' '}
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#38BDF8] to-[#34D399] bg-clip-text text-transparent">
            Evolve.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#94A3B8] leading-relaxed">
          The desktop-first platform bridging distraction-free professional speed testing with immersive arcade games, touch-typing lessons, and algorithmically targeted drills.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/arena"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-bold text-sm shadow-xl shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Keyboard className="w-5 h-5" />
            <span>Enter Typing Arena</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/games"
            className="px-8 py-4 rounded-2xl bg-[#182235]/80 hover:bg-[#182235] border border-white/[0.1] text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
          >
            <Gamepad2 className="w-5 h-5 text-[#38BDF8]" />
            <span>Explore Game Zone</span>
          </Link>
        </div>

        {/* Live Typing Interactive Widget */}
        <div className="mt-16 w-full max-w-3xl p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.1] shadow-2xl backdrop-blur-xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-[#94A3B8]">terminal · focus_mode.sh</span>
            </div>
            <span className="text-xs font-mono text-[#38BDF8] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              LIVE ENGINE PREVIEW
            </span>
          </div>

          <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide min-h-[60px] flex items-center">
            <span className="text-white font-medium">{demoInput}</span>
            <span className="w-0.5 h-7 bg-[#8B5CF6] inline-block animate-caret ml-1 shadow-sm shadow-[#8B5CF6]" />
            <span className="text-[#94A3B8]/30 ml-0.5">
              {demoTarget.slice(demoInput.length)}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span>Latency: 1.2ms · Tabular scoring active</span>
            <Link href="/arena" className="text-[#8B5CF6] hover:underline font-medium">
              Try Full Test →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars (Focus Mode & Immersive Mode) */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Two Connected Experiences</h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Switch seamlessly between serious deliberate practice and arcade gaming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Focus Mode */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#182235]/60 to-[#111827]/80 border border-white/[0.08] relative group hover:border-[#8B5CF6]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center mb-6">
              <Keyboard className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6]">Professional Tool</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-3">Focus Mode: Typing Arena</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
              Distraction-free environment with customizable time limits (15s–120s), word bursts, real-world quotes, and programming code. Track net WPM, raw speed, consistency, and key-specific latency.
            </p>
            <ul className="space-y-2.5 text-xs text-[#94A3B8] font-mono mb-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Standardized WPM: (Correct Chars ÷ 5) ÷ Minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Zero latency keyboard event listener</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Full virtual keyboard with touch finger assignment</span>
              </li>
            </ul>
            <Link
              href="/arena"
              className="inline-flex items-center text-xs font-bold text-[#8B5CF6] hover:text-[#A78BFA] gap-1.5"
            >
              <span>Launch Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Immersive Mode */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#182235]/60 to-[#111827]/80 border border-white/[0.08] relative group hover:border-[#38BDF8]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/20 border border-[#38BDF8]/30 flex items-center justify-center mb-6">
              <Gamepad2 className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">Gamified Arcade</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-3">Immersive Mode: Game Zone</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
              Convert repetition into pure engagement. Battle through falling word storms, beat the ticking clock in Survival rush, and undertake RPG missions in TypeQuest with unlockable ranks and cosmetics.
            </p>
            <ul className="space-y-2.5 text-xs text-[#94A3B8] font-mono mb-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>Falling Words: Combo cascades and shields</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>Survival Mode: Escalating rush against time</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>TypeQuest: Precision & speed campaign progression</span>
              </li>
            </ul>
            <Link
              href="/games"
              className="inline-flex items-center text-xs font-bold text-[#38BDF8] hover:text-[#7DD3FC] gap-1.5"
            >
              <span>Enter Game Zone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Academy & Adaptive AI Strip */}
      <section className="py-16 px-6 lg:px-12 border-t border-white/[0.08] bg-[#0B101E]/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-[#34D399]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Skill Academy</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              4 progressive levels from Home Row to Speed & Punctuation. Enforces strict 95%+ accuracy gates to build flawless muscle memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Adaptive Weak-Key AI</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Weights errors, latency, and recency to pinpoint bottlenecks. Generates tailored drills explaining exactly why each letter is practiced.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Daily Missions & Ranks</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Earn XP, level up your typist profile, complete rotating daily objectives, and compete on the global daily challenge board.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-12 border-t border-white/[0.08] text-center text-xs text-[#94A3B8]">
        <p>© 2026 TYPEVERSE — Type. Train. Compete. Evolve. Built for high-performance typists.</p>
      </footer>
    </div>
  );
}
