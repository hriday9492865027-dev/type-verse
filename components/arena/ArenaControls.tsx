'use client';

import React from 'react';
import { Clock, Type, Quote as QuoteIcon, Code2, RotateCcw, Keyboard, SlidersHorizontal } from 'lucide-react';
import { TestMode, TimeDuration, WordCountOption } from '@/lib/typing-engine/types';

interface ArenaControlsProps {
  mode: TestMode;
  onSelectMode: (mode: TestMode) => void;
  timeLimit: TimeDuration;
  onSelectTime: (time: TimeDuration) => void;
  wordCount: WordCountOption;
  onSelectWords: (count: WordCountOption) => void;
  onRestart: () => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
}

export function ArenaControls({
  mode,
  onSelectMode,
  timeLimit,
  onSelectTime,
  wordCount,
  onSelectWords,
  onRestart,
  showKeyboard,
  onToggleKeyboard,
}: ArenaControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-[#111827]/70 border border-white/[0.08] backdrop-blur-md">
      {/* Primary Mode Tabs */}
      <div className="flex items-center space-x-1 bg-[#080B14]/80 p-1 rounded-xl border border-white/[0.06]">
        <button
          onClick={() => onSelectMode('time')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'time'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Time</span>
        </button>

        <button
          onClick={() => onSelectMode('words')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'words'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Words</span>
        </button>

        <button
          onClick={() => onSelectMode('quote')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'quote'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <QuoteIcon className="w-3.5 h-3.5" />
          <span>Quote</span>
        </button>

        <button
          onClick={() => onSelectMode('code')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'code'
              ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
      </div>

      {/* Sub-Options (Time length or Word Count) */}
      <div className="flex items-center space-x-2">
        {mode === 'time' && (
          <div className="flex items-center space-x-1 bg-[#080B14]/80 p-1 rounded-xl border border-white/[0.06]">
            {([15, 30, 60, 120] as TimeDuration[]).map((t) => (
              <button
                key={t}
                onClick={() => onSelectTime(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  timeLimit === t
                    ? 'bg-[#38BDF8] text-[#080B14] font-bold shadow-sm shadow-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        )}

        {mode === 'words' && (
          <div className="flex items-center space-x-1 bg-[#080B14]/80 p-1 rounded-xl border border-white/[0.06]">
            {([10, 25, 50, 100] as WordCountOption[]).map((w) => (
              <button
                key={w}
                onClick={() => onSelectWords(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  wordCount === w
                    ? 'bg-[#38BDF8] text-[#080B14] font-bold shadow-sm shadow-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        )}

        {/* Toggle Virtual Keyboard */}
        <button
          onClick={onToggleKeyboard}
          className={`p-2 rounded-xl border transition-all ${
            showKeyboard
              ? 'bg-[#182235] border-[#38BDF8]/40 text-[#38BDF8]'
              : 'bg-[#080B14]/80 border-white/[0.06] text-[#94A3B8] hover:text-white'
          }`}
          title="Toggle on-screen keyboard guide"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-medium transition-all"
          title="Restart Test (Tab + Enter)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </div>
  );
}
