'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { 
  Swords, 
  Shield, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Zap, 
  Award,
  Lock
} from 'lucide-react';
import { soundManager } from '@/lib/sound/sound-effects';
import { saveGameRecord, getGameRecords, unlockAchievement } from '@/lib/storage/store';
import { AchievementToast } from '@/components/achievements/AchievementToast';
import { Achievement } from '@/lib/storage/store';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  bossName: string;
  bossAvatar: string;
  bossMaxHp: number;
  targetWpm: number;
  targetAccuracy: number;
  passage: string;
  xpReward: number;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Stage 1: Precision Gate',
    subtitle: 'Demonstrate absolute finger precision under pressure.',
    bossName: 'Precision Sentinel',
    bossAvatar: '🛡️',
    bossMaxHp: 100,
    targetWpm: 40,
    targetAccuracy: 95,
    passage: 'the quick brown fox jumps over the lazy dog with calm focus and exact finger alignment',
    xpReward: 300
  },
  {
    id: 2,
    title: 'Stage 2: Velocity Rush',
    subtitle: 'Accelerate keystroke rhythm to break through the speed barrier.',
    bossName: 'Speed Overlord',
    bossAvatar: '⚡',
    bossMaxHp: 150,
    targetWpm: 60,
    targetAccuracy: 92,
    passage: 'rapid execution separates master typists from beginners velocity flows like lightning through code',
    xpReward: 450
  },
  {
    id: 3,
    title: 'Stage 3: Endurance Realm',
    subtitle: 'Maintain unwavering accuracy over a sustained technical text.',
    bossName: 'Endurance Titan',
    bossAvatar: '🌋',
    bossMaxHp: 200,
    targetWpm: 55,
    targetAccuracy: 96,
    passage: 'scalable architecture depends on resilient state management functional design pattern and clean code standards',
    xpReward: 600
  },
  {
    id: 4,
    title: 'Stage 4: Weak-Key Purge',
    subtitle: 'Master complex key switches and uncommon symbol patterns.',
    bossName: 'Chaos Phantom',
    bossAvatar: '🌀',
    bossMaxHp: 250,
    targetWpm: 50,
    targetAccuracy: 94,
    passage: 'function processInput(key) { const score = (key.length * 100) / 2.5; return score >= 90; }',
    xpReward: 750
  },
  {
    id: 5,
    title: 'Stage 5: TypeVerse Overlord',
    subtitle: 'The ultimate boss trial combining peak WPM and zero error tolerance.',
    bossName: 'TypeVerse Sovereign',
    bossAvatar: '👑',
    bossMaxHp: 350,
    targetWpm: 75,
    targetAccuracy: 98,
    passage: 'supreme typing mastery demands speed accuracy consistency and complete focus under intense competition',
    xpReward: 1000
  }
];

export default function TypeQuestPage() {
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState<number>(1);

  // Game state
  const [status, setStatus] = useState<'selecting' | 'playing' | 'victory' | 'defeat'>('selecting');
  const [userInput, setUserInput] = useState<string>('');
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerShield, setPlayerShield] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];

  useEffect(() => {
    const records = getGameRecords();
    setMaxUnlockedStage(Math.max(1, records.typeQuestLevel || 1));
  }, []);

  const startStage = (stageId: number) => {
    const stage = STAGES.find(s => s.id === stageId) || STAGES[0];
    setCurrentStageId(stageId);
    setBossHp(stage.bossMaxHp);
    setPlayerShield(100);
    setUserInput('');
    setCombo(0);
    setStartTime(null);
    setStatus('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'playing') return;

    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());

    // Evaluate last key typed
    const target = activeStage.passage;
    const currentIdx = value.length - 1;

    if (currentIdx >= 0) {
      if (value[currentIdx] === target[currentIdx]) {
        // Correct hit! Deal damage to boss
        soundManager.playKeyClick();
        const nextCombo = combo + 1;
        setCombo(nextCombo);

        const damage = Math.round(10 * (1 + nextCombo * 0.1));
        setBossHp(prev => {
          const next = Math.max(0, prev - damage);
          if (next <= 0) {
            // Check victory condition
            finishBattle(value, true);
          }
          return next;
        });
      } else {
        // Error! Break combo and damage shield
        soundManager.playError();
        setCombo(0);
        setPlayerShield(prev => {
          const next = Math.max(0, prev - 15);
          if (next <= 0) {
            finishBattle(value, false);
          }
          return next;
        });
      }
    }

    setUserInput(value);

    // If passage finished
    if (value.length >= target.length) {
      finishBattle(value, bossHp <= 0);
    }
  };

  const finishBattle = (input: string, isBossDefeated: boolean) => {
    const elapsedMinutes = startTime ? Math.max(0.1, (Date.now() - startTime) / 60000) : 0.5;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === activeStage.passage[i]) correct++;
    }

    const calculatedWpm = Math.round((correct / 5) / elapsedMinutes);
    const calculatedAcc = Math.round((correct / Math.max(1, input.length)) * 100);

    const meetsRequirements = calculatedWpm >= activeStage.targetWpm && calculatedAcc >= activeStage.targetAccuracy;

    if (isBossDefeated || meetsRequirements) {
      setStatus('victory');
      soundManager.playSuccess();

      // Unlock next stage if applicable
      const nextLevel = Math.max(maxUnlockedStage, currentStageId + 1);
      setMaxUnlockedStage(nextLevel);
      saveGameRecord('typeQuestLevel', nextLevel);

      // Check Quest Champion achievement
      const ach = unlockAchievement('quest_champion');
      if (ach) setUnlockedAchievement(ach);
    } else {
      setStatus('defeat');
      soundManager.playError();
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <AchievementToast achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">TypeQuest Campaign</h1>
              <p className="text-xs text-[#94A3B8]">
                Conquer trial bosses, strike flawless key combos, and unlock master typist titles.
              </p>
            </div>
          </div>
          <Link
            href="/games"
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-white transition-all w-fit"
          >
            ← Back to Game Zone
          </Link>
        </div>

        {/* Mode 1: Stage Selection Map */}
        {status === 'selecting' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#182235]/90 via-[#111827]/90 to-[#0F172A]/90 border border-white/[0.1] backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-2">Select Campaign Stage</h2>
              <p className="text-xs text-[#94A3B8]">
                Each stage features an aggressive boss. Maintain speed & accuracy targets to inflict fatal damage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STAGES.map((s) => {
                const isUnlocked = s.id <= maxUnlockedStage;
                return (
                  <div
                    key={s.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-[#182235]/80 border-white/[0.12] hover:border-[#8B5CF6]/60 shadow-xl'
                        : 'bg-[#111827]/40 border-white/[0.04] opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{s.bossAvatar}</span>
                        {isUnlocked ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 text-[#94A3B8] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white">{s.title}</h3>
                      <div className="text-xs font-semibold text-[#8B5CF6] mt-0.5">{s.bossName}</div>
                      <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{s.subtitle}</p>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Target Speed:</span>
                          <span className="text-white font-bold">{s.targetWpm} WPM</span>
                        </div>
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Target Precision:</span>
                          <span className="text-[#34D399] font-bold">{s.targetAccuracy}%</span>
                        </div>
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>XP Reward:</span>
                          <span className="text-[#38BDF8] font-bold">+{s.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!isUnlocked}
                      onClick={() => startStage(s.id)}
                      className={`mt-6 w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#9333EA] shadow-lg shadow-[#8B5CF6]/30'
                          : 'bg-white/5 text-[#94A3B8] cursor-not-allowed'
                      }`}
                    >
                      <Swords className="w-4 h-4" />
                      <span>{isUnlocked ? 'Engage Boss' : 'Stage Locked'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 2: Active Battle View */}
        {status === 'playing' && (
          <div className="space-y-8">
            {/* Boss & Typist HUD */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#182235] to-[#111827] border border-white/[0.12] shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Boss Health Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-bold flex items-center gap-2">
                      <span className="text-2xl">{activeStage.bossAvatar}</span>
                      <span>{activeStage.bossName}</span>
                    </span>
                    <span className="text-[#FB7185] font-bold">{bossHp} / {activeStage.bossMaxHp} HP</span>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      style={{ width: `${(bossHp / activeStage.bossMaxHp) * 100}%` }}
                      className="h-full bg-gradient-to-r from-[#FB7185] to-[#E11D48] rounded-full transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Player Shield & Combo */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#38BDF8]" />
                      <span>Typist Shield</span>
                    </span>
                    <span className="text-[#38BDF8] font-bold">{playerShield}%</span>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      style={{ width: `${playerShield}%` }}
                      className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] rounded-full transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Combo Multiplier indicator */}
              <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Combo Multiplier: {combo}x ({Math.round(10 * (1 + combo * 0.1))} Dmg/Hit)
                  </span>
                </div>
                <div className="text-xs font-mono text-[#94A3B8]">
                  Goal: {activeStage.targetWpm} WPM | {activeStage.targetAccuracy}% Acc
                </div>
              </div>
            </div>

            {/* Target Passage Container */}
            <div
              onClick={() => inputRef.current?.focus()}
              className="p-8 rounded-3xl bg-[#080B14]/90 border border-[#8B5CF6]/30 shadow-2xl backdrop-blur-xl relative cursor-text min-h-[160px] flex items-center justify-center text-xl sm:text-2xl font-mono leading-relaxed select-none"
            >
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-text"
                autoFocus
              />

              <div className="flex flex-wrap gap-x-1.5 gap-y-2 justify-center">
                {activeStage.passage.split('').map((char, index) => {
                  let style = 'text-[#94A3B8]/40';
                  if (index < userInput.length) {
                    style = userInput[index] === char ? 'text-[#34D399] font-bold' : 'text-[#FB7185] bg-[#FB7185]/20 rounded';
                  } else if (index === userInput.length) {
                    style = 'text-white border-b-2 border-[#8B5CF6] animate-pulse';
                  }
                  return (
                    <span key={index} className={style}>
                      {char === ' ' ? '␣' : char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {status === 'victory' && (
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#182235] to-[#111827] border border-[#34D399]/40 shadow-2xl text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#34D399]/20 text-[#34D399] flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">STAGE VICTORY!</h2>
              <p className="text-xs text-[#94A3B8] mt-1">You vanquished {activeStage.bossName} with supreme typing precision.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex justify-around font-mono text-xs">
              <div>
                <span className="text-[#94A3B8]">XP Earned</span>
                <div className="text-lg font-bold text-[#38BDF8]">+{activeStage.xpReward} XP</div>
              </div>
              <div>
                <span className="text-[#94A3B8]">Next Stage</span>
                <div className="text-lg font-bold text-[#34D399]">Unlocked</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStatus('selecting')}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
              >
                Campaign Map
              </button>
              {currentStageId < STAGES.length && (
                <button
                  onClick={() => startStage(currentStageId + 1)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold text-xs shadow-lg shadow-[#8B5CF6]/30 transition-all"
                >
                  Next Boss →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Defeat Modal */}
        {status === 'defeat' && (
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#182235] to-[#111827] border border-[#FB7185]/40 shadow-2xl text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FB7185]/20 text-[#FB7185] flex items-center justify-center mx-auto text-3xl">
              💀
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">DEFLECTIONS OVERCOME</h2>
              <p className="text-xs text-[#94A3B8] mt-1">{activeStage.bossName} breached your shield. Sharpen your accuracy and try again.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStatus('selecting')}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
              >
                Campaign Map
              </button>
              <button
                onClick={() => startStage(currentStageId)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white font-bold text-xs shadow-lg shadow-[#FB7185]/30 transition-all"
              >
                Retry Battle
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
