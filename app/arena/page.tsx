'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ArenaControls } from '@/components/arena/ArenaControls';
import { VirtualKeyboard } from '@/components/arena/VirtualKeyboard';
import { ResultsModal } from '@/components/arena/ResultsModal';
import { TestMode, TimeDuration, WordCountOption, SessionResult, KeyStats } from '@/lib/typing-engine/types';
import { generateWordsPassage, QUOTES, CODE_SNIPPETS } from '@/lib/typing-engine/words-data';
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency, identifyWeakKeys } from '@/lib/scoring/metrics';
import { soundManager } from '@/lib/sound/sound-effects';
import { saveSession } from '@/lib/storage/store';
import { Zap, Clock, Target, AlertCircle } from 'lucide-react';

export default function ArenaPage() {
  const [mode, setMode] = useState<TestMode>('time');
  const [timeLimit, setTimeLimit] = useState<TimeDuration>(30);
  const [wordCount, setWordCount] = useState<WordCountOption>(25);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Passage and typing states
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeKey, setActiveKey] = useState<string>('');
  const [lastPressedKey, setLastPressedKey] = useState<string>('');

  // Performance snapshots
  const [wpmSnapshots, setWpmSnapshots] = useState<number[]>([]);
  const [keyStats, setKeyStats] = useState<Record<string, KeyStats>>({});
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);

  // Hidden input ref for capturing keystrokes cleanly on desktop/mobile
  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keyLatencyRef = useRef<number>(Date.now());

  // Generate target passage based on active mode
  const initPassage = useCallback(() => {
    let text = '';
    if (mode === 'time') {
      text = generateWordsPassage(60);
    } else if (mode === 'words') {
      text = generateWordsPassage(wordCount);
    } else if (mode === 'quote') {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      text = q.text;
    } else if (mode === 'code') {
      const jsSnippets = CODE_SNIPPETS.javascript;
      text = jsSnippets[Math.floor(Math.random() * jsSnippets.length)];
    }
    setTargetText(text);
    setUserInput('');
    setStatus('idle');
    setStartTime(null);
    setTimeLeft(mode === 'time' ? timeLimit : 0);
    setWpmSnapshots([]);
    setKeyStats({});
    setSessionResult(null);
    setActiveKey(text.length > 0 ? text[0] : '');
    setLastPressedKey('');

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [mode, timeLimit, wordCount]);

  useEffect(() => {
    initPassage();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [initPassage]);

  // Finish test and calculate official metrics
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setStatus('completed');

    const totalDuration = mode === 'time'
      ? timeLimit - timeLeft || 1
      : startTime ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : 1;

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const netWpm = calculateWpm(correctChars, totalDuration);
    const rawWpm = calculateRawWpm(userInput.length, totalDuration);
    const accuracy = calculateAccuracy(correctChars, userInput.length);
    const consistency = calculateConsistency(wpmSnapshots.length > 0 ? wpmSnapshots : [netWpm]);
    const weakKeys = identifyWeakKeys(keyStats);

    const result: SessionResult = {
      id: 'session-' + Date.now(),
      timestamp: Date.now(),
      mode,
      durationSeconds: totalDuration,
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      totalChars: userInput.length,
      correctChars,
      incorrectChars,
      extraChars: Math.max(0, userInput.length - targetText.length),
      missedChars: Math.max(0, targetText.length - userInput.length),
      weakKeys,
      wpmHistory: wpmSnapshots.map((w, idx) => ({
        second: idx + 1,
        wpm: w,
        rawWpm: w + 4,
        errors: 0
      })),
      keyStats
    };

    setSessionResult(result);
    saveSession(result);
    soundManager.playSuccess();
  }, [mode, timeLimit, timeLeft, startTime, userInput, targetText, wpmSnapshots, keyStats]);

  // Interval timer tick
  useEffect(() => {
    if (status === 'running') {
      timerIntervalRef.current = setInterval(() => {
        if (mode === 'time') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              finishTest();
              return 0;
            }
            return prev - 1;
          });
        }

        // Snapshot current WPM
        if (startTime) {
          const elapsedSecs = Math.max(1, (Date.now() - startTime) / 1000);
          let correct = 0;
          for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === targetText[i]) correct++;
          }
          const currentWpm = calculateWpm(correct, elapsedSecs);
          setWpmSnapshots(prev => [...prev, currentWpm]);
        }
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status, mode, startTime, userInput, targetText, finishTest]);

  // Handle keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick restart shortcut: Tab + Enter or Escape
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      initPassage();
      return;
    }

    if (status === 'completed') return;

    // Start timer on first keystroke
    if (status === 'idle' && e.key.length === 1) {
      setStatus('running');
      setStartTime(Date.now());
      keyLatencyRef.current = Date.now();
    }

    setLastPressedKey(e.key);

    if (e.key === 'Backspace') {
      soundManager.playKeyClick(false);
      setUserInput(prev => prev.slice(0, -1));
      const nextIdx = Math.max(0, userInput.length - 1);
      setActiveKey(targetText[nextIdx] || '');
      return;
    }

    // Normal character entry
    if (e.key.length === 1) {
      e.preventDefault();
      const nextChar = e.key;
      const expectedChar = targetText[userInput.length];
      const now = Date.now();
      const latency = Math.max(20, now - keyLatencyRef.current);
      keyLatencyRef.current = now;

      // Track key statistics
      setKeyStats(prev => {
        const existing = prev[expectedChar] || { key: expectedChar, attempts: 0, errors: 0, totalLatencyMs: 0 };
        const isError = nextChar !== expectedChar;
        return {
          ...prev,
          [expectedChar]: {
            ...existing,
            attempts: existing.attempts + 1,
            errors: existing.errors + (isError ? 1 : 0),
            totalLatencyMs: existing.totalLatencyMs + latency
          }
        };
      });

      if (nextChar === expectedChar) {
        soundManager.playKeyClick(nextChar === ' ');
      } else {
        soundManager.playError();
      }

      const updatedInput = userInput + nextChar;
      setUserInput(updatedInput);

      // Next required character
      const nextIdx = updatedInput.length;
      setActiveKey(targetText[nextIdx] || '');

      // Check for test completion in word or quote mode
      if (nextIdx >= targetText.length) {
        finishTest();
      }
    }
  };

  // Calculate live HUD metrics
  const elapsedSeconds = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
  let correctCount = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === targetText[i]) correctCount++;
  }
  const liveWpm = status === 'running' ? calculateWpm(correctCount, elapsedSeconds) : 0;
  const liveAccuracy = status === 'running' ? calculateAccuracy(correctCount, userInput.length) : 100;
  const progressPercent = targetText.length > 0 ? Math.min(100, Math.round((userInput.length / targetText.length) * 100)) : 0;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Controls Bar */}
        <ArenaControls
          mode={mode}
          onSelectMode={setMode}
          timeLimit={timeLimit}
          onSelectTime={setTimeLimit}
          wordCount={wordCount}
          onSelectWords={setWordCount}
          onRestart={initPassage}
          showKeyboard={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
        />

        {/* Live HUD Banner */}
        <div className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center space-x-3 px-3 border-r border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">WPM</span>
              <div className="text-2xl font-black font-mono text-white tabular-nums">
                {liveWpm}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-3 border-r border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#34D399]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Accuracy</span>
              <div className="text-2xl font-black font-mono text-[#34D399] tabular-nums">
                {liveAccuracy}%
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-3 border-r border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">
                {mode === 'time' ? 'Time Left' : 'Progress'}
              </span>
              <div className="text-2xl font-black font-mono text-white tabular-nums">
                {mode === 'time' ? `${timeLeft}s` : `${progressPercent}%`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Mistakes</span>
              <div className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                {userInput.length - correctCount}
              </div>
            </div>
          </div>
        </div>

        {/* Main Typing Surface Card */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="relative min-h-[260px] p-8 rounded-3xl bg-gradient-to-b from-[#111827]/90 to-[#0B101E]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl cursor-text select-none group"
        >
          {/* Hidden input to catch real key events */}
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {/* Start Guide if Idle */}
          {status === 'idle' && (
            <div className="absolute top-4 right-6 flex items-center space-x-2 text-xs text-[#94A3B8] font-mono animate-pulse">
              <span>Type any key to begin</span>
            </div>
          )}

          {/* Text Flow Container */}
          <div className="text-xl md:text-2xl font-mono leading-relaxed tracking-wider transition-all">
            {targetText.split('').map((char, index) => {
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

          {/* Shortcut hint footer */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#94A3B8] font-mono">
            <span>Click passage or start typing directly</span>
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white">Tab</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white">Enter</kbd> to restart</span>
          </div>
        </div>

        {/* Virtual Keyboard with Finger Map */}
        {showKeyboard && (
          <VirtualKeyboard
            activeKey={activeKey}
            lastPressedKey={lastPressedKey}
          />
        )}

        {/* Results Modal */}
        {sessionResult && (
          <ResultsModal
            result={sessionResult}
            onRetry={initPassage}
          />
        )}
      </div>
    </AppShell>
  );
}
