'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { soundManager } from '@/lib/sound/sound-effects';
import { saveGameRecord, getGameRecords } from '@/lib/storage/store';
import { COMMON_WORDS } from '@/lib/typing-engine/words-data';
import { Shield, Trophy, Flame, RotateCcw, ArrowLeft, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FallingWord {
  id: string;
  text: string;
  x: number;      // percent 10 to 80
  y: number;      // percent 0 to 100
  speed: number;
}

export default function FallingWordsGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shields, setShields] = useState(3);
  const [combo, setCombo] = useState(0);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number>(0);
  const difficultyRef = useRef<number>(1);

  useEffect(() => {
    const rec = getGameRecords();
    setHighScore(rec.fallingWordsHighScore);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setShields(3);
    setCombo(0);
    setWords([]);
    setCurrentInput('');
    difficultyRef.current = 1;
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const spawnWord = useCallback(() => {
    const chosen = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    const newWord: FallingWord = {
      id: Math.random().toString(36).substring(2, 9),
      text: chosen,
      x: 10 + Math.random() * 75,
      y: 0,
      speed: 0.15 + (difficultyRef.current * 0.05)
    };
    setWords(prev => [...prev, newWord]);
  }, []);

  // Main game animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16; // normalized frame delta
      lastTime = currentTime;

      // Spawn timer
      spawnTimerRef.current += delta;
      if (spawnTimerRef.current > Math.max(70, 140 - difficultyRef.current * 10)) {
        spawnWord();
        spawnTimerRef.current = 0;
        difficultyRef.current += 0.03;
      }

      // Move words
      setWords(prevWords => {
        const nextWords: FallingWord[] = [];
        let lostShields = 0;

        for (const w of prevWords) {
          const newY = w.y + w.speed * delta;
          if (newY >= 92) {
            // Word hit bottom
            lostShields++;
          } else {
            nextWords.push({ ...w, y: newY });
          }
        }

        if (lostShields > 0) {
          soundManager.playError();
          setCombo(0);
          setShields(curr => {
            const nextShield = curr - lostShields;
            if (nextShield <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextShield;
          });
        }

        return nextWords;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, spawnWord]);

  // Handle game-over state
  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        saveGameRecord('fallingWordsHighScore', score);
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        } catch {}
      }
    }
  }, [gameState, score, highScore]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);

    // Check if input matches any active word
    const matchedIdx = words.findIndex(w => w.text.toLowerCase() === val);
    if (matchedIdx !== -1) {
      soundManager.playBlast();
      const matched = words[matchedIdx];

      // Remove word
      setWords(prev => prev.filter((_, i) => i !== matchedIdx));
      setCurrentInput('');

      // Add points based on word length and combo
      const wordScore = (matched.text.length * 10) * (1 + Math.floor(combo / 5));
      setScore(prev => prev + wordScore);
      setCombo(prev => prev + 1);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
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
              <Shield className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span className="text-[#94A3B8]">Shields:</span>
              <span className="font-bold text-white">{shields}/3</span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-[#94A3B8]">Combo:</span>
              <span className="font-bold text-amber-400">{combo}x</span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-sm">
              <Trophy className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8]">Score:</span>
              <span className="font-bold text-[#38BDF8] tabular-nums">{score}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="relative h-[480px] w-full rounded-3xl bg-gradient-to-b from-[#080B14] via-[#0D1527] to-[#111827] border border-white/[0.1] shadow-2xl overflow-hidden cursor-text select-none"
        >
          {/* Ambient atmosphere grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          {/* Falling Words */}
          {gameState === 'playing' && words.map((w) => {
            const isPartiallyMatched = currentInput.length > 0 && w.text.toLowerCase().startsWith(currentInput);

            return (
              <div
                key={w.id}
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute px-3 py-1.5 rounded-xl font-mono text-sm font-bold tracking-wider transition-all duration-75 shadow-lg ${
                  isPartiallyMatched
                    ? 'bg-[#38BDF8] text-[#080B14] border border-white shadow-[#38BDF8]/50 scale-110'
                    : 'bg-[#182235]/90 text-white border border-white/[0.15] shadow-black/40'
                }`}
              >
                {w.text}
              </div>
            );
          })}

          {/* Danger Zone Line */}
          <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-rose-500/30 border-b border-dashed border-rose-500/50 flex items-center justify-end px-4">
            <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
              Shield Barrier
            </span>
          </div>

          {/* Bottom Active Input Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#080B14]/90 border-t border-white/[0.08] backdrop-blur-md flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                disabled={gameState !== 'playing'}
                placeholder={gameState === 'playing' ? 'Type falling word here...' : ''}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111827] border border-white/[0.15] focus:border-[#38BDF8] text-center font-mono text-white text-base focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 transition-all placeholder:text-[#94A3B8]/40"
              />
            </div>
          </div>

          {/* Start Screen Overlay */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-[#080B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#38BDF8]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Falling Words Arcade</h2>
              <p className="text-xs text-[#94A3B8] max-w-md">
                Words fall from the sky. Type each word completely and accurately before it breaches the shield barrier at the bottom.
              </p>
              <button
                onClick={startGame}
                className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#60A5FA] hover:to-[#0369A1] text-white font-bold text-sm shadow-xl shadow-[#38BDF8]/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Match</span>
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-[#080B14]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Shields Depleted!</h2>
              <p className="text-sm text-[#94A3B8]">
                Final Score: <span className="font-bold font-mono text-[#38BDF8]">{score}</span> points · Best: <span className="font-mono text-white">{highScore}</span>
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#38BDF8]/25 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
