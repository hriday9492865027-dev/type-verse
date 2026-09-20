'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { 
  getSessions, 
  getUserProfile, 
  getDailyMissions, 
  getUserAchievements, 
  ALL_ACHIEVEMENTS, 
  SessionResult, 
  UserProfile, 
  DailyMission, 
  UserAchievement 
} from '@/lib/storage/store';
import { 
  Zap, 
  Target, 
  Clock, 
  Flame, 
  ArrowRight, 
  Play, 
  GraduationCap, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    setProfile(getUserProfile());
    setSessions(getSessions());
    setMissions(getDailyMissions());
    setUserAchievements(getUserAchievements());
  }, []);

  const bestWpm = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);
  const avgAccuracy = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length).toFixed(1)
    : '100';
  const totalPracticeMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  ) + 42; // includes seed session practice

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#182235]/90 via-[#111827]/90 to-[#0F172A]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[11px] font-mono text-[#A78BFA] mb-2">
              <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
              <span>TYPIST PROFILE DASHBOARD</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {profile?.displayName || 'Typist'}
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Your next improvement starts here. Continue your streak or jump straight into the Arena.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/arena"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-[#8B5CF6]/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Speed Test</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Stat Cards (Matching PRD Page 6) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase font-mono mb-2">
              <span>Best WPM</span>
              <Zap className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white tabular-nums">
              {bestWpm || 68}
            </div>
            <span className="text-[11px] text-[#34D399] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Peak Velocity
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase font-mono mb-2">
              <span>Avg Accuracy</span>
              <Target className="w-4 h-4 text-[#34D399]" />
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#34D399] tabular-nums">
              {avgAccuracy}%
            </div>
            <span className="text-[11px] text-[#94A3B8] mt-1">
              Across recent sessions
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase font-mono mb-2">
              <span>Practice Time</span>
              <Clock className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white tabular-nums">
              {totalPracticeMinutes}m
            </div>
            <span className="text-[11px] text-[#38BDF8] mt-1">
              Active keystrokes
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase font-mono mb-2">
              <span>Daily Streak</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tabular-nums">
              {profile?.streakDays || 7} Days
            </div>
            <span className="text-[11px] text-amber-300 mt-1">
              Active consistency
            </span>
          </div>
        </div>

        {/* 2 Column Section: Performance Trend & Daily Mission (Matching PRD Page 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Trend Card (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Performance Trend</h3>
                  <p className="text-xs text-[#94A3B8]">Keystroke speed over recent typing sessions</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30">
                  WPM Trajectory
                </span>
              </div>

              {/* Trend SVG Sparkline Graph */}
              <div className="h-44 w-full flex items-end pt-4 pb-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                  <defs>
                    <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d="M 20 90 Q 90 80, 160 65 T 300 45 T 440 30 L 440 120 L 20 120 Z"
                    fill="url(#trendGrad)"
                  />

                  {/* Line path */}
                  <path
                    d="M 20 90 Q 90 80, 160 65 T 300 45 T 440 30"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data point glowing circles */}
                  <circle cx="20" cy="90" r="5" fill="#8B5CF6" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="160" cy="65" r="5" fill="#38BDF8" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="300" cy="45" r="5" fill="#34D399" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="440" cy="30" r="6" fill="#8B5CF6" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] border-t border-white/[0.06] pt-3">
                <span>Session 1 (55 WPM)</span>
                <span>Session 2 (62 WPM)</span>
                <span>Session 3 (65 WPM)</span>
                <span className="text-[#8B5CF6] font-bold">Latest (68 WPM)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Velocity improved by +23.6% over the last 7 days</span>
              <Link href="/analytics" className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold">
                <span>Deep Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Daily Mission Card (1 col, PRD Page 6) */}
          <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Daily Missions</h3>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>

              <div className="space-y-4">
                {missions.map((m) => {
                  const percent = Math.min(100, Math.round((m.progress / m.maxProgress) * 100));

                  return (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-[#182235]/60 border border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                        <span>{m.title}</span>
                        <span className="text-[11px] font-mono text-[#38BDF8]">+{m.rewardXp} XP</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mb-2">{m.description}</p>
                      
                      <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${
                            m.completed ? 'bg-[#34D399]' : 'bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8]'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] mt-1.5">
                        <span>{percent}% complete</span>
                        <span>{m.completed ? 'COMPLETED' : `${m.progress}/${m.maxProgress}`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <Link
                href="/academy"
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-[#34D399]" />
                <span>Resume Academy Lesson</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Achievements Showcase Section */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8B5CF6]" />
                <span>Achievements & Honor Badges</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Track milestones earned across speed, accuracy, and games</p>
            </div>
            <span className="text-xs font-mono text-[#38BDF8]">
              {userAchievements.length} / {ALL_ACHIEVEMENTS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = userAchievements.some(u => u.achievementId === ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-[#182235]/90 border-[#8B5CF6]/40 shadow-lg shadow-[#8B5CF6]/10'
                      : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                  }`}
                  title={`${ach.title}: ${ach.description}`}
                >
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-[11px] font-bold text-white truncate">{ach.title}</div>
                  <div className="text-[9px] font-mono text-[#94A3B8] mt-0.5 truncate">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Typing Sessions</h3>
            <span className="text-xs text-[#94A3B8] font-mono">Last {sessions.length} tests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#94A3B8]">
                  <th className="pb-3 font-semibold">Mode</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">WPM</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                  <th className="pb-3 font-semibold">Consistency</th>
                  <th className="pb-3 font-semibold">Weak Keys</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 uppercase text-white font-bold">{s.mode}</td>
                    <td className="py-3 text-[#94A3B8]">{s.durationSeconds}s</td>
                    <td className="py-3 text-[#8B5CF6] font-bold text-sm">{s.wpm}</td>
                    <td className="py-3 text-[#34D399] font-bold">{s.accuracy}%</td>
                    <td className="py-3 text-white">{s.consistency}%</td>
                    <td className="py-3 text-[#FB7185]">
                      {s.weakKeys && s.weakKeys.length > 0 ? s.weakKeys.join(', ') : 'None'}
                    </td>
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
