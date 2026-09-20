'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { soundManager } from '@/lib/sound/sound-effects';
import { saveGameRecord, getGameRecords } from '@/lib/storage/store';
import { COMMON_WORDS } from '@/lib/typing-engine/words-data';
import { Flame, Trophy, RotateCcw, ArrowLeft, Play, Zap, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SurvivalModePage() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [secondsSurvived, setSecondsSurvived] = useState(0);
  const [highRecord, setHighRecord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordsCleared, setWordsCleared] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const rec = getGameRecords();
    setHighRecord(rec.survivalMaxSeconds);
  }, []);

  const nextWord = () => {
    // Pick words based on words cleared (longer words later)
    const filtered = COMMON_WORDS.filter(w => {
      if (wordsCleared < 10) return w.length <= 5;
      if (wordsCleared < 25) return w.length <= 8;
      return true;
    });
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentWord(chosen);
    setUserInput('');
  };

  const startGame = () => {
    setGameState('playing');
    setSecondsSurvived(0);
    setTimeLeft(15);
    setWordsCleared(0);
    nextWord();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setSecondsSurvived(s => s + 1);
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('gameover');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Game over check
  useEffect(() => {
    if (gameState === 'gameover') {
      soundManager.playError();
      if (secondsSurvived > highRecord) {
        setHighRecord(secondsSurvived);
        saveGameRecord('survivalMaxSeconds', secondsSurvived);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }
    }
  }, [gameState, secondsSurvived, highRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (val === currentWord) {
      soundManager.playBlast();
      // Add bonus time: +2.5s
      setTimeLeft(t => Math.min(30, t + 3));
      setWordsCleared(c => c + 1);
      nextWord();
    } else if (currentWord.startsWith(val)) {
      soundManager.playKeyClick(false);
    } else {
      soundManager.playError();
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md">
          <Link
            href="/games"
            className="flex items-center space-x-2 text-xs text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game Zone</span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-[#94A3B8]">Survived:</span>
              <span className="font-bold text-white tabular-nums">{secondsSurvived}s</span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <Zap className="w-4 h-4 text-[#34D399]" />
              <span className="text-[#94A3B8]">Cleared:</span>
              <span className="font-bold text-[#34D399]">{wordsCleared}</span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <Trophy className="w-4 h-4 text-[#FB7185]" />
              <span className="text-[#94A3B8]">Record:</span>
              <span className="font-bold text-[#FB7185]">{highRecord}s</span>
            </div>
          </div>
        </div>

        {/* Time Remaining Bar */}
        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#94A3B8]">OXYGEN LEVEL / TIMER</span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              {timeLeft} SECONDS REMAINING
            </span>
          </div>
          <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${Math.min(100, (timeLeft / 30) * 100)}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                timeLeft <= 5
                  ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                  : 'bg-gradient-to-r from-amber-500 via-emerald-400 to-[#38BDF8]'
              }`}
            />
          </div>
        </div>

        {/* Play Surface */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="relative min-h-[320px] rounded-3xl bg-gradient-to-b from-[#182235]/90 to-[#0F172A]/90 border border-white/[0.1] flex flex-col items-center justify-center p-8 text-center select-none shadow-2xl cursor-text"
        >
          {gameState === 'playing' && (
            <div className="space-y-6 w-full max-w-md">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                TYPE TO REFILL CLOCK (+3s)
              </span>

              {/* Target Word with live char comparison */}
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-white">
                {currentWord.split('').map((char, idx) => {
                  const isTyped = idx < userInput.length;
                  const isCorrect = isTyped && userInput[idx] === char;
                  return (
                    <span
                      key={idx}
                      className={
                        isTyped
                          ? isCorrect
                            ? 'text-[#34D399]'
                            : 'text-[#FB7185] underline'
                          : 'text-[#94A3B8]/40'
                      }
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Input field */}
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  autoFocus
                  placeholder="Type word..."
                  className="w-full px-5 py-3 rounded-2xl bg-[#080B14] border border-white/[0.15] focus:border-[#FB7185] text-center font-mono text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#FB7185]/20 shadow-inner transition-all placeholder:text-[#94A3B8]/40"
                />
              </div>
            </div>
          )}

          {gameState === 'start' && (
            <div className="space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-[#FB7185]/20 border border-[#FB7185]/30 flex items-center justify-center mx-auto text-[#FB7185]">
                <Flame className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Survival Rush</h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                The clock drains without mercy. Each completed word rewards +3 precious seconds. Keep typing to stay alive.
              </p>
              <button
                onClick={startGame}
                className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white font-bold text-sm shadow-xl shadow-[#FB7185]/30 transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Rush</span>
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Time Expired!</h2>
              <p className="text-sm text-[#94A3B8]">
                You survived for <span className="font-bold font-mono text-[#FB7185]">{secondsSurvived}s</span> and cleared <span className="font-mono text-white">{wordsCleared}</span> words!
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FB7185]/25 transition-all mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
