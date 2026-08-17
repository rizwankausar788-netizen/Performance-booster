import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Tv,
  Flame,
  Gamepad2,
  ListFilter,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FileText,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

export function Navbar({
  currentView,
  setCurrentView,
  isOverlayOpen,
  setIsOverlayOpen,
  telemetry,
  onOpenDiagnostics,
  currentTheme,
  setCurrentTheme,
}) {
  const { isBoostActive, isBoostingSequence, executeSuperBoost, stats } = telemetry;
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: Activity },
    { id: 'booster', label: 'TURBO BOOSTER', icon: Zap },
    { id: 'games', label: 'GAME LIBRARY', icon: Gamepad2 },
    { id: 'benchmark', label: '3D BENCHMARK', icon: Flame },
    { id: 'processes', label: 'TASK MANAGER', icon: ListFilter },
  ];

  const themes = [
    { id: 'emerald', name: 'Cyber Matrix', color: '#00ff88' },
    { id: 'cyan', name: 'Neon Cyberpunk', color: '#06b6d4' },
    { id: 'purple', name: 'Plasma Violet', color: '#c084fc' },
    { id: 'amber', name: 'Solar Amber', color: '#fbbf24' },
    { id: 'crimson', name: 'Rage Blood', color: '#ff4655' },
    { id: 'stealth', name: 'Obsidian Stealth', color: '#38bdf8' },
  ];

  const toggleAudio = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    sound.toggleSound(nextState);
    if (nextState) sound.playClick();
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-2xl px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black text-base lg:text-lg tracking-wider text-white">
                APEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TURBO</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO 2.0
              </span>
            </div>
            <div className="text-[10px] font-rajdhani font-semibold text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isBoostActive ? 'bg-emerald-400 shadow-[0_0_6px_#00ff88]' : 'bg-cyan-400'}`} />
              {isBoostActive ? 'SYSTEM FULLY OPTIMIZED' : 'HARDWARE MONITORING ACTIVE'}
            </div>
          </div>
        </div>

        {/* Center Main Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/90 p-1 rounded-2xl overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  sound.playClick();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-rajdhani font-bold tracking-wider transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(0,255,136,0.15)] font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Master Boost Action */}
        <div className="flex items-center gap-2.5">
          {/* Overlay HUD Detach Switch */}
          <button
            onClick={() => {
              setIsOverlayOpen(!isOverlayOpen);
              sound.playClick();
            }}
            title="Toggle Floating In-Game Mini HUD Overlay"
            className={`p-2 rounded-xl border transition-all ${
              isOverlayOpen
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_#06b6d433]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              title="RGB Lighting & UI Accent Theme"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-orbitron font-bold text-slate-400 uppercase">
                  RGB Chroma Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTheme(t.id);
                      setShowThemePicker(false);
                      sound.playClick();
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-rajdhani font-bold text-left transition-all ${
                      currentTheme === t.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleAudio}
            title={isSoundOn ? 'Mute Procedural Audio' : 'Unmute Audio'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Diagnostics Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenDiagnostics();
            }}
            title="System Diagnostics & Logs"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all hidden sm:flex"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Master 1-Click Super Boost Button */}
          <button
            onClick={executeSuperBoost}
            disabled={isBoostingSequence}
            className={`px-4 py-2 rounded-xl font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-lg ${
              isBoostActive
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_20px_#00ff8855]'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white shadow-[0_0_20px_#f59e0b55]'
            }`}
          >
            <Zap className={`w-4 h-4 ${isBoostingSequence ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isBoostingSequence ? 'BOOSTING...' : isBoostActive ? 'TURBO BOOSTED' : 'SUPER BOOST'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
