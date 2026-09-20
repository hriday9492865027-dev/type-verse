'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { VirtualKeyboard } from '@/components/arena/VirtualKeyboard';
import { getLessons, updateLessonCompletion, AcademyLesson } from '@/lib/storage/store';
import { soundManager } from '@/lib/sound/sound-effects';
import { calculateWpm, calculateAccuracy } from '@/lib/scoring/metrics';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  CheckCircle2, 
  Lock, 
  Play, 
  RotateCcw, 
  Award, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const LEVEL_NAMES = [
  { id: 1, title: 'Level 1: Home Row Mastery', desc: 'Anchor positions and resting finger foundation' },
  { id: 2, title: 'Level 2: Top Row Reach', desc: 'Upward extensions, high-frequency vowels, and index keys' },
  { id: 3, title: 'Level 3: Bottom Row Precision', desc: 'Downward hand equilibrium, wrist stability, and pinky edges' },
  { id: 4, title: 'Level 4: Speed & Consistency', desc: 'Capitalization, punctuation, and numeric cadence' },
];

export default function AcademyPage() {
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Lesson typing state
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [lessonAccuracy, setLessonAccuracy] = useState(100);
  const [lessonWpm, setLessonWpm] = useState(0);
  const [activeKey, setActiveKey] = useState('');
  const [lastPressedKey, setLastPressedKey] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = getLessons();
    setLessons(list);
    if (!selectedLesson && list.length > 0) {
      // Find first uncompleted or unlocked lesson
      const active = list.find(l => l.unlocked && !l.completed) || list[0];
      setSelectedLesson(active);
    }
  }, [selectedLesson]);

  const startLesson = (lesson: AcademyLesson) => {
    if (!lesson.unlocked) return;
    setSelectedLesson(lesson);
    setUserInput('');
    setStartTime(null);
    setCompleted(false);
    setLessonAccuracy(100);
    setLessonWpm(0);
    setActiveKey(lesson.sampleText[0] || '');
    setLastPressedKey('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selectedLesson || completed) return;

    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      startLesson(selectedLesson);
      return;
    }

    if (!startTime && e.key.length === 1) {
      setStartTime(Date.now());
    }

    setLastPressedKey(e.key);

    if (e.key === 'Backspace') {
      soundManager.playKeyClick(false);
      setUserInput(prev => prev.slice(0, -1));
      const nextIdx = Math.max(0, userInput.length - 1);
      setActiveKey(selectedLesson.sampleText[nextIdx] || '');
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const expected = selectedLesson.sampleText[userInput.length];
      const char = e.key;

      if (char === expected) {
        soundManager.playKeyClick(char === ' ');
      } else {
        soundManager.playError();
      }

      const updated = userInput + char;
      setUserInput(updated);

      const nextIdx = updated.length;
      setActiveKey(selectedLesson.sampleText[nextIdx] || '');

      // Check if finished
      if (nextIdx >= selectedLesson.sampleText.length) {
        const durationSec = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
        let correct = 0;
        for (let i = 0; i < updated.length; i++) {
          if (updated[i] === selectedLesson.sampleText[i]) correct++;
        }
        const acc = calculateAccuracy(correct, updated.length);
        const wpm = calculateWpm(correct, durationSec);

        setLessonAccuracy(acc);
        setLessonWpm(wpm);
        setCompleted(true);

        updateLessonCompletion(selectedLesson.id, acc);
        setLessons(getLessons());

        if (acc >= selectedLesson.minAccuracy) {
          soundManager.playSuccess();
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#34D399]/20 border border-[#34D399]/30 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#34D399]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Skill Academy</h1>
              <p className="text-xs text-[#94A3B8]">
                Structured touch-typing syllabus with strict 95%+ accuracy progression gates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-[#38BDF8]">
              {lessons.filter(l => l.completed).length} / {lessons.length} Completed
            </span>
          </div>
        </div>

        {/* Level Roadmap Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {LEVEL_NAMES.map((lvl) => {
            const levelLessons = lessons.filter(l => l.levelId === lvl.id);
            const completedCount = levelLessons.filter(l => l.completed).length;
            const isFullyDone = levelLessons.length > 0 && completedCount === levelLessons.length;
            const isUnlocked = levelLessons.some(l => l.unlocked);

            return (
              <div
                key={lvl.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#111827]/80 border-white/[0.08]'
                    : 'bg-[#0B101E]/40 border-white/[0.04] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2 font-mono">
                  <span className={isUnlocked ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}>
                    LEVEL 0{lvl.id}
                  </span>
                  {isFullyDone ? (
                    <span className="text-[#34D399] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  ) : (
                    <span className="text-[#94A3B8]">{completedCount}/{levelLessons.length}</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">{lvl.title.split(':')[1]}</h3>
                <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">{lvl.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Lesson Interactive Practice Box */}
        {selectedLesson && (
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#182235]/90 to-[#111827]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
            {/* Lesson Title & Objective */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                  Active Lesson · Level {selectedLesson.levelId}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{selectedLesson.title}</h2>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Target Keys: {selectedLesson.targetKeys.map(k => `[${k}]`).join(' ')} · Minimum Accuracy Gate: {selectedLesson.minAccuracy}%
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => startLesson(selectedLesson)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Lesson</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Exercise Text */}
            {!completed ? (
              <div 
                onClick={() => inputRef.current?.focus()}
                className="min-h-[140px] p-6 rounded-2xl bg-[#080B14]/80 border border-white/[0.08] cursor-text select-none text-xl md:text-2xl font-mono leading-relaxed tracking-wider"
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                  onKeyDown={handleKeyDown}
                  autoFocus
                />

                {selectedLesson.sampleText.split('').map((char, index) => {
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
                        <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-[#34D399] rounded-full animate-caret shadow-sm shadow-[#34D399]" />
                      )}
                      <span className={`${colorClass} transition-colors duration-100`}>
                        {char}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              /* Completed Result Banner */
              <div className="p-6 rounded-2xl bg-[#080B14]/80 border border-white/[0.08] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-[#34D399] to-[#059669]">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {lessonAccuracy >= selectedLesson.minAccuracy ? 'Lesson Passed!' : 'Accuracy Below Threshold'}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {lessonAccuracy >= selectedLesson.minAccuracy
                      ? `Great job! You achieved ${lessonAccuracy}% accuracy and ${lessonWpm} WPM.`
                      : `You achieved ${lessonAccuracy}%. A minimum of ${selectedLesson.minAccuracy}% is required to unlock the next tier.`}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startLesson(selectedLesson)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Practice Again</span>
                  </button>

                  {lessonAccuracy >= selectedLesson.minAccuracy && (
                    <button
                      onClick={() => {
                        const next = lessons.find(l => l.unlocked && !l.completed);
                        if (next) startLesson(next);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#34D399] to-[#059669] text-xs font-bold text-[#080B14] shadow-lg shadow-[#34D399]/20 transition-all flex items-center gap-2"
                    >
                      <span>Next Exercise</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Virtual Finger Guide */}
            <div className="mt-8">
              <VirtualKeyboard
                activeKey={activeKey}
                lastPressedKey={lastPressedKey}
              />
            </div>
          </div>
        )}

        {/* Lesson Catalog List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Lesson Curriculum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lessons.map((lesson) => {
              const isCurrent = selectedLesson?.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => lesson.unlocked && startLesson(lesson)}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-[#182235] border-[#38BDF8]/40 shadow-md shadow-[#38BDF8]/10'
                      : lesson.unlocked
                      ? 'bg-[#111827]/70 border-white/[0.06] hover:bg-white/[0.04] cursor-pointer'
                      : 'bg-[#0B101E]/40 border-white/[0.03] opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      lesson.completed
                        ? 'bg-[#34D399]/20 text-[#34D399]'
                        : lesson.unlocked
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                        : 'bg-white/[0.05] text-[#94A3B8]'
                    }`}>
                      {lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : lesson.unlocked ? <Play className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{lesson.title}</span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">Lvl {lesson.levelId}</span>
                      </div>
                      <span className="text-[11px] text-[#94A3B8]">
                        Keys: {lesson.targetKeys.join(', ')} · Gate: {lesson.minAccuracy}%
                      </span>
                    </div>
                  </div>

                  {lesson.completed && (
                    <span className="text-xs font-mono text-[#34D399] font-bold">
                      {lesson.bestAccuracy}% Best
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
