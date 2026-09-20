'use client';

import React from 'react';

interface VirtualKeyboardProps {
  activeKey?: string;
  lastPressedKey?: string;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

// Finger assignments for touch typing education
const FINGER_COLORS: Record<string, string> = {
  // Left Pinky
  '`': 'border-purple-500/40', '1': 'border-purple-500/40', 'q': 'border-purple-500/40', 'a': 'border-purple-500/40', 'z': 'border-purple-500/40',
  // Left Ring
  '2': 'border-blue-500/40', 'w': 'border-blue-500/40', 's': 'border-blue-500/40', 'x': 'border-blue-500/40',
  // Left Middle
  '3': 'border-emerald-500/40', 'e': 'border-emerald-500/40', 'd': 'border-emerald-500/40', 'c': 'border-emerald-500/40',
  // Left Index
  '4': 'border-amber-500/40', '5': 'border-amber-500/40', 'r': 'border-amber-500/40', 't': 'border-amber-500/40', 'f': 'border-amber-500/40', 'g': 'border-amber-500/40', 'v': 'border-amber-500/40', 'b': 'border-amber-500/40',
  // Right Index
  '6': 'border-amber-500/40', '7': 'border-amber-500/40', 'y': 'border-amber-500/40', 'u': 'border-amber-500/40', 'h': 'border-amber-500/40', 'j': 'border-amber-500/40', 'n': 'border-amber-500/40', 'm': 'border-amber-500/40',
  // Right Middle
  '8': 'border-emerald-500/40', 'i': 'border-emerald-500/40', 'k': 'border-emerald-500/40', ',': 'border-emerald-500/40',
  // Right Ring
  '9': 'border-blue-500/40', 'o': 'border-blue-500/40', 'l': 'border-blue-500/40', '.': 'border-blue-500/40',
  // Right Pinky
  '0': 'border-purple-500/40', '-': 'border-purple-500/40', '=': 'border-purple-500/40', 'p': 'border-purple-500/40', '[': 'border-purple-500/40', ']': 'border-purple-500/40', ';': 'border-purple-500/40', "'": 'border-purple-500/40', '/': 'border-purple-500/40',
};

export function VirtualKeyboard({ activeKey, lastPressedKey }: VirtualKeyboardProps) {
  const normActive = activeKey === ' ' ? 'Space' : activeKey?.toLowerCase();
  const normPressed = lastPressedKey === ' ' ? 'Space' : lastPressedKey?.toLowerCase();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 rounded-2xl bg-[#0F172A]/70 border border-white/[0.08] backdrop-blur-md select-none">
      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 w-full justify-center">
            {row.map((k) => {
              const lowerKey = k.toLowerCase();
              const isTarget = lowerKey === normActive || (k === 'Space' && normActive === 'space');
              const isPressed = lowerKey === normPressed || (k === 'Space' && normPressed === 'space');
              const isHomeAnchor = k.toLowerCase() === 'f' || k.toLowerCase() === 'j';

              let widthClass = 'w-10 h-10';
              if (k === 'Backspace') widthClass = 'w-20 h-10';
              else if (k === 'Tab') widthClass = 'w-14 h-10';
              else if (k === 'Caps') widthClass = 'w-16 h-10';
              else if (k === 'Enter') widthClass = 'w-20 h-10';
              else if (k === 'Shift') widthClass = 'w-24 h-10';
              else if (k === 'Space') widthClass = 'w-72 h-10';

              return (
                <div
                  key={k}
                  className={`relative flex items-center justify-center rounded-lg text-xs font-mono font-medium transition-all duration-150 border ${widthClass} ${
                    isPressed
                      ? 'bg-[#8B5CF6] text-white scale-95 shadow-lg shadow-[#8B5CF6]/50 border-white'
                      : isTarget
                      ? 'bg-[#38BDF8]/25 text-[#38BDF8] border-[#38BDF8] shadow-md shadow-[#38BDF8]/40 animate-pulse'
                      : 'bg-[#182235]/60 text-[#94A3B8] border-white/[0.06] hover:border-white/20'
                  } ${FINGER_COLORS[lowerKey] || ''}`}
                >
                  {k === 'Space' ? 'Space' : k}
                  {isHomeAnchor && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-[#94A3B8]/60 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Guide Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-[11px] text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>Next Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <span>Active Strike</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#94A3B8] rounded-full" />
          <span>Home Anchors (F/J)</span>
        </div>
      </div>
    </div>
  );
}
