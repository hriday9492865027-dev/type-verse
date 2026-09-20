'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Keyboard, 
  GraduationCap, 
  Gamepad2, 
  Trophy, 
  BarChart3, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Arena', href: '/arena', icon: Keyboard, badge: 'Focus' },
    { label: 'Academy', href: '/academy', icon: GraduationCap },
    { label: 'Game Zone', href: '/games', icon: Gamepad2, badge: 'Arcade' },
    { label: 'Challenges', href: '/challenges', icon: Trophy },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-white/[0.08] bg-[#0B101E]/90 backdrop-blur-xl transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TYPEVERSE
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#38BDF8]">
                Hybrid Platform
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent text-white border-l-4 border-[#8B5CF6] pl-3'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon 
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[#8B5CF6]' : 'text-[#94A3B8] group-hover:text-white'
                }`} 
              />
              {!collapsed && (
                <span className="ml-3.5 tracking-wide flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                  item.badge === 'Focus' 
                    ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30' 
                    : 'bg-[#38BDF8]/20 text-[#7DD3FC] border border-[#38BDF8]/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Streak and Status Mini-Card */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-[#182235]/80 to-[#111827]/80 border border-white/[0.08] shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              Daily Streak
            </span>
            <span className="text-amber-400 font-mono font-bold">7 Days</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full w-[70%]" />
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2 leading-tight">
            Keep practicing daily to maintain your multiplier!
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.06] flex items-center justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
