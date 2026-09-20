'use client';

import React from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Achievement } from '@/lib/storage/store';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#182235] via-[#111827] to-[#1F2937] border border-[#8B5CF6]/40 shadow-2xl shadow-[#8B5CF6]/30 backdrop-blur-xl max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center text-2xl shadow-lg shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#A78BFA] font-bold">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            <span>ACHIEVEMENT UNLOCKED</span>
          </div>
          <h4 className="text-sm font-bold text-white truncate">{achievement.title}</h4>
          <p className="text-xs text-[#94A3B8] truncate">{achievement.description}</p>
          <div className="text-[10px] font-mono text-[#38BDF8] mt-1">+{achievement.rewardXp} XP</div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
