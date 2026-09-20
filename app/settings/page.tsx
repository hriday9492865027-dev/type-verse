'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getPreferences, savePreferences, UserPreferences } from '@/lib/storage/store';
import { soundManager } from '@/lib/sound/sound-effects';
import { Settings, Volume2, Palette, Sliders, Trash2, Download, CheckCircle2, VolumeX, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreferences>({
    theme: 'cosmic',
    soundEnabled: true,
    soundVolume: 0.5,
    switchSound: 'mechanical',
    fontFamily: 'geist-mono',
    smoothCaret: true,
    reducedMotion: false,
    showLiveWpm: true,
    showVirtualKeyboard: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  const update = (partial: Partial<UserPreferences>) => {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    savePreferences(next);

    if (partial.soundEnabled !== undefined) {
      soundManager.setSoundEnabled(partial.soundEnabled);
    }
    if (partial.soundVolume !== undefined) {
      soundManager.setVolume(partial.soundVolume);
    }
    if (partial.switchSound !== undefined) {
      soundManager.setSwitchType(partial.switchSound);
      soundManager.playKeyClick(false);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  const handleTestSound = (switchType: 'mechanical' | 'thock' | 'tactile') => {
    soundManager.setSwitchType(switchType);
    soundManager.playKeyClick(false);
  };

  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const data = {
      preferences: localStorage.getItem('typeverse_prefs_v1'),
      sessions: localStorage.getItem('typeverse_sessions_v1'),
      profile: localStorage.getItem('typeverse_profile_v1'),
      lessons: localStorage.getItem('typeverse_lessons_v1'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeverse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to reset all local typing records and reset the academy progress?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Platform Settings</h1>
              <p className="text-xs text-[#94A3B8]">
                Configure audio switch profiles, visual themes, typography, and telemetry.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-[#34D399] font-mono animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences Saved</span>
            </div>
          )}
        </div>

        {/* Section 1: Audio Switch Simulation */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md space-y-6">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Volume2 className="w-5 h-5 text-[#8B5CF6]" />
            <h3>Mechanical Audio Synthesizer</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Audio Feedback</span>
                <p className="text-[11px] text-[#94A3B8]">Play procedural clicks on keystrokes and error notifications</p>
              </div>
              <button
                onClick={() => update({ soundEnabled: !prefs.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  prefs.soundEnabled ? 'bg-[#8B5CF6]' : 'bg-white/[0.1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    prefs.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Switch Profile Selection */}
            {prefs.soundEnabled && (
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-[#94A3B8] font-mono">Select Switch Profile</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'mechanical', title: 'Cherry MX Blue', desc: 'High pitch tactile click' },
                    { id: 'thock', title: 'Lubed Holy Panda', desc: 'Deep bass thock resonance' },
                    { id: 'tactile', title: 'Gateron Brown', desc: 'Crisp soft tactile snap' }
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      onClick={() => {
                        update({ switchSound: sw.id as 'mechanical' | 'thock' | 'tactile' });
                        handleTestSound(sw.id as 'mechanical' | 'thock' | 'tactile');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        prefs.switchSound === sw.id
                          ? 'bg-[#182235] border-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                          : 'bg-[#080B14]/60 border-white/[0.06] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-1 flex items-center justify-between">
                        <span>{sw.title}</span>
                        {prefs.switchSound === sw.id && <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                      </div>
                      <p className="text-[10px] text-[#94A3B8]">{sw.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Visual Themes */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md space-y-6">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Palette className="w-5 h-5 text-[#38BDF8]" />
            <h3>Visual Direction & Glassmorphism</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'cosmic', title: 'Cosmic Dark', bg: 'from-[#080B14] to-[#111827]', border: 'border-[#8B5CF6]/50', desc: 'PRD default dark cosmic glass' },
              { id: 'obsidian', title: 'Midnight Obsidian', bg: 'from-[#050505] to-[#121212]', border: 'border-slate-500/50', desc: 'High-contrast monochrome' },
              { id: 'cyberpunk', title: 'Cyber Neon', bg: 'from-[#0A071B] to-[#160B30]', border: 'border-pink-500/50', desc: 'Saturated magenta & cyan' }
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => update({ theme: th.id as 'cosmic' | 'obsidian' | 'cyberpunk' })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  prefs.theme === th.id
                    ? 'border-[#38BDF8] bg-white/[0.05] shadow-lg'
                    : 'border-white/[0.06] bg-[#080B14]/60 hover:border-white/20'
                }`}
              >
                <div className={`h-8 w-full rounded-xl bg-gradient-to-r ${th.bg} mb-3 border ${th.border}`} />
                <span className="font-bold text-xs text-white block">{th.title}</span>
                <span className="text-[10px] text-[#94A3B8]">{th.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Data Management */}
        <div className="p-6 rounded-3xl bg-[#111827]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3>Data Persistence & Export</h3>
          </div>

          <p className="text-xs text-[#94A3B8]">
            Your session metrics, accuracy data, and unlocked academy tiers are persisted locally in your browser.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#38BDF8]" />
              <span>Export Typing History (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Reset Local Records</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
