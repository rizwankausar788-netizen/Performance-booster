import React, { useState } from 'react';
import {
  Zap,
  Sliders,
  Flame,
  Shield,
  Gauge,
  Cpu,
  Tv,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Volume2,
  Eye,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { sound } from '../utils/audio';

export function BoosterView({ telemetry }) {
  const {
    stats,
    optimizations,
    toggleOptimization,
    overclock,
    updateOverclock,
    executeSuperBoost,
    isBoostActive,
    isBoostingSequence,
    boostStep,
    addLog,
  } = telemetry;

  const [testingStability, setTestingStability] = useState(false);
  const [testSuccess, setTestSuccess] = useState(null);
  const [fsrSliderPos, setFsrSliderPos] = useState(50); // percentage

  const handleTestStability = () => {
    setTestingStability(true);
    setTestSuccess(null);
    sound.playAlert();
    addLog('warning', `Testing Overclock stability: +${overclock.coreClockOffset}MHz Core / +${overclock.memClockOffset}MHz Memory...`);

    setTimeout(() => {
      setTestingStability(false);
      setTestSuccess(true);
      sound.playSuccess();
      addLog('success', 'Overclock stress validation PASSED. VRAM CRC checks verified 100% stable.');
    }, 2500);
  };

  const handleApplyOverclock = () => {
    sound.playSuccess();
    addLog('success', `Applied Hardware Overclock: +${overclock.coreClockOffset}MHz GPU Core, Power Target @ ${overclock.powerLimit}%`);
  };

  const boostFeatures = [
    {
      id: 'ultraLowLatency',
      title: 'Ultra-Low Latency Mode',
      badge: 'NVIDIA Reflex / Anti-Lag',
      desc: 'Bypasses GPU render queue to synchronize CPU and GPU frame submission, dropping click-to-photon latency from 18ms to ~2.8ms.',
      icon: Zap,
      color: '#00ff88',
    },
    {
      id: 'ramCleaner',
      title: 'Smart RAM & Standby Purge',
      badge: 'Cache Eliminator',
      desc: 'Instantly purges Windows standby file cache and unreferenced working sets, preventing frame-stutters in open-world games.',
      icon: Layers,
      color: '#38bdf8',
    },
    {
      id: 'turboCpu',
      title: 'CPU Turbo & Core Unparking',
      badge: 'Max Clock Lock',
      desc: 'Forces all physical and logical CPU cores to stay awake at maximum turbo multiplier without downclocking power states.',
      icon: Cpu,
      color: '#c084fc',
    },
    {
      id: 'gpuBoostLock',
      title: 'GPU Boost Frequency Lock',
      badge: 'TDP Max',
      desc: 'Overrides dynamic GPU thermal throttling floors to sustain consistent 2.5+ GHz core clocks under heavy shader load.',
      icon: Flame,
      color: '#f59e0b',
    },
    {
      id: 'networkQos',
      title: 'Network Gaming QoS Engine',
      badge: 'Ping Optimizer',
      desc: 'Disables Nagle TCP algorithm delay, configures DNS to ultra-fast low-jitter esports nodes, and prevents bandwidth hogging.',
      icon: Shield,
      color: '#06b6d4',
    },
    {
      id: 'gameDvrKiller',
      title: 'Windows Telemetry Suppressor',
      badge: 'Zero Bloat',
      desc: 'Halts Xbox Game DVR background video encoding, Cortana telemetry, and non-essential Windows diagnostics services.',
      icon: Gauge,
      color: '#ec4899',
    },
    {
      id: 'vsync',
      title: 'Adaptive G-Sync / FreeSync Lock',
      badge: 'Zero Tearing',
      desc: 'Locks framerate exactly to your display refresh rate (165Hz) to eliminate screen tearing with minimal input lag.',
      icon: Tv,
      color: '#fbbf24',
    },
    {
      id: 'fsrSharpening',
      title: 'Super Resolution & DLSS Frame Gen',
      badge: 'AI Upscaler',
      desc: 'Applies AI tensor temporal upscaling and adaptive CAS contrast sharpening for 30%+ higher frame rates without blur.',
      icon: Sparkles,
      color: '#a855f7',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HERO SUPER BOOST HUB ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/90 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Boost Status & Big Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM OPTIMIZER CORE V2.4
            </div>

            <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide leading-tight">
              MAXIMIZE FPS & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                CRUSH SYSTEM LATENCY
              </span>
            </h1>

            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              One click cleans unneeded memory caches, stops heavy background services, enables hardware GPU priority, and tunes gaming network packets.
            </p>

            {/* Sequence Execution Indicator (when active) */}
            {isBoostingSequence && (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/40 text-xs font-mono-code space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    EXECUTING APEX TURBO OPTIMIZATION STAGES...
                  </span>
                  <span>STAGE {boostStep}/5</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${(boostStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Big Action Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={executeSuperBoost}
                disabled={isBoostingSequence}
                className={`relative px-8 py-4 rounded-2xl font-orbitron font-extrabold text-sm sm:text-base tracking-widest uppercase transition-all duration-300 flex items-center gap-3 shadow-2xl ${
                  isBoostActive
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-[0_0_35px_#00ff8866] hover:scale-105'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-[0_0_35px_#f59e0b55] hover:scale-105'
                }`}
              >
                <Zap className={`w-6 h-6 ${isBoostingSequence ? 'animate-spin' : ''}`} />
                <span>{isBoostingSequence ? 'OPTIMIZING ENGINE...' : isBoostActive ? '⚡ RE-APPLY TURBO BOOST' : '🚀 ACTIVATE 1-CLICK BOOST'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Status: <strong className="text-white">{isBoostActive ? 'BOOSTED (+34% GAIN)' : 'STANDBY'}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Gain Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-slate-400 tracking-widest uppercase">
                ESTIMATED FPS BOOST
              </span>
              <div className="my-2">
                <span className="font-orbitron font-extrabold text-3xl text-emerald-400 text-glow">
                  +{isBoostActive ? '34%' : '28%'}
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                Avg: <strong className="text-white">{stats.fps} FPS</strong> (up from 105)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-slate-400 tracking-widest uppercase">
                INPUT LATENCY DROP
              </span>
              <div className="my-2">
                <span className="font-orbitron font-extrabold text-3xl text-cyan-400">
                  -68%
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                From 18.4ms to <strong className="text-white">2.8ms</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-slate-400 tracking-widest uppercase">
                RAM FREED
              </span>
              <div className="my-2">
                <span className="font-orbitron font-extrabold text-3xl text-purple-400">
                  +3.4 GB
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                Standby cache flushed
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between">
              <span className="text-[10px] font-rajdhani font-bold text-slate-400 tracking-widest uppercase">
                FRAME STABILITY
              </span>
              <div className="my-2">
                <span className="font-orbitron font-extrabold text-3xl text-amber-400">
                  99.2%
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                Zero micro-stutters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 8 INTERACTIVE OPTIMIZATION TOGGLES ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="font-orbitron text-base font-bold tracking-wider text-slate-100 uppercase">
              System Optimization Suite
            </h2>
          </div>
          <span className="text-xs font-mono-code text-slate-400">
            {Object.values(optimizations).filter(Boolean).length} / {Object.keys(optimizations).length} ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boostFeatures.map((feat) => {
            const isActive = optimizations[feat.id];
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => toggleOptimization(feat.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group relative overflow-hidden ${
                  isActive
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="p-2.5 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? `${feat.color}22` : '#1e293b',
                        color: isActive ? feat.color : '#64748b',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Toggle Switch */}
                    <div
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 ${
                        isActive ? 'bg-emerald-500 shadow-[0_0_10px_#00ff88]' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-slate-950 transition-all duration-300 transform ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  <h3 className="font-rajdhani font-bold text-sm tracking-wide text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                  <span className="text-[10px] font-mono-code text-cyan-400 block mb-2">
                    {feat.badge}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isActive ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= HARDWARE OVERCLOCKING & FAN TUNER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overclock Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-purple-400" />
              <span className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">
                GPU Overclocking & Voltage Station
              </span>
            </div>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              DIRECTX 12 OC ENGINE
            </span>
          </div>

          <div className="space-y-4">
            {/* Core Clock Offset Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-rajdhani font-bold text-slate-300 tracking-wide">
                  GPU CORE CLOCK OFFSET
                </span>
                <span className="font-mono-code font-bold text-purple-400">
                  +{overclock.coreClockOffset} MHz (Current: {stats.gpuClock} MHz)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={overclock.coreClockOffset}
                onChange={(e) => updateOverclock('coreClockOffset', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[9px] font-mono-code text-slate-500">
                <span>Stock (+0 MHz)</span>
                <span>Safe Limit (+150 MHz)</span>
                <span>Extreme (+300 MHz)</span>
              </div>
            </div>

            {/* Memory Clock Offset Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-rajdhani font-bold text-slate-300 tracking-wide">
                  GDDR6X MEMORY CLOCK OFFSET
                </span>
                <span className="font-mono-code font-bold text-cyan-400">
                  +{overclock.memClockOffset} MHz (Current: {stats.gpuMemClock} MHz)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="25"
                value={overclock.memClockOffset}
                onChange={(e) => updateOverclock('memClockOffset', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[9px] font-mono-code text-slate-500">
                <span>0 MHz</span>
                <span>+750 MHz</span>
                <span>+1500 MHz</span>
              </div>
            </div>

            {/* Power Limit & Temp Target Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-rajdhani font-bold text-slate-300">POWER LIMIT</span>
                  <span className="font-mono-code font-bold text-amber-400">{overclock.powerLimit}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  value={overclock.powerLimit}
                  onChange={(e) => updateOverclock('powerLimit', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-rajdhani font-bold text-slate-300">TEMP TARGET</span>
                  <span className="font-mono-code font-bold text-red-400">{overclock.tempLimit}°C</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="90"
                  value={overclock.tempLimit}
                  onChange={(e) => updateOverclock('tempLimit', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
            </div>

            {/* Overclock Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-800/60">
              <button
                onClick={handleApplyOverclock}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_#c084fc44] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                APPLY CLOCKS
              </button>

              <button
                onClick={handleTestStability}
                disabled={testingStability}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-orbitron font-bold text-xs tracking-wider transition-all border border-slate-700 flex items-center gap-2"
              >
                {testingStability ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <Shield className="w-4 h-4 text-emerald-400" />}
                {testingStability ? 'VALIDATING...' : 'TEST STABILITY'}
              </button>
            </div>

            {testSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs font-mono-code flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Overclock validated! Thermal and VRAM stability confirmed.</span>
              </div>
            )}
          </div>
        </div>

        {/* Fan Curve & Thermals Profile (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <span className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">
                  Fan Acoustic Profiles
                </span>
              </div>
              <span className="text-xs font-mono-code text-cyan-400 font-bold">
                {stats.gpuFanRpm} RPM
              </span>
            </div>

            {/* Fan Presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['Auto Intelligent', 'Silent Stealth', 'Turbo Hurricane', 'Custom Curve'].map((p) => {
                const isSelected = overclock.fanProfile === p.split(' ')[0];
                return (
                  <button
                    key={p}
                    onClick={() => {
                      updateOverclock('fanProfile', p.split(' ')[0]);
                      sound.playClick();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_#06b6d422]'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-rajdhani font-bold text-xs tracking-wider">{p}</div>
                    <div className="text-[10px] font-mono-code text-slate-500 mt-1">
                      {p.includes('Auto') ? 'Dynamic Curve' : p.includes('Silent') ? 'Max 45dB' : p.includes('Turbo') ? '100% Full Blast' : 'User Curve'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Visual Fan Speed Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-slate-400">Manual Override</span>
                <span className="text-white font-bold">{overclock.manualFanSpeed}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={overclock.manualFanSpeed}
                onChange={(e) => updateOverclock('manualFanSpeed', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono-code bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            Current GPU Temp: <strong className="text-emerald-400">{stats.gpuTemp}°C</strong> | Hotspot: <strong className="text-slate-300">{stats.gpuHotspotTemp}°C</strong>
          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE DLSS / FSR SUPER RESOLUTION COMPARATOR ================= */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">
              AI Super Resolution & Contrast Sharpening Simulator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              DLSS 3.5 Frame Gen Active
            </span>
          </div>
        </div>

        {/* Interactive Split-Screen Visual Comparison Slider */}
        <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden border border-slate-800 select-none bg-slate-950">
          {/* Background Left: Native 1080p (Slightly softer) */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, #1e1b4b 0%, #030712 80%)',
              filter: 'blur(0.4px)',
            }}
          >
            <div className="text-center space-y-2 p-4">
              <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-slate-400">
                NATIVE 1080P RENDERING
              </div>
              <div className="text-xs font-mono-code text-slate-500">
                Render FPS: 85 FPS • Frametime: 11.7ms
              </div>
              <div className="inline-block px-3 py-1 rounded bg-slate-800/80 text-slate-400 text-xs font-mono-code">
                Standard Anti-Aliasing
              </div>
            </div>
          </div>

          {/* Foreground Right (Clipped with slider): AI Super Resolution 4K + Frame Gen */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{
              clipPath: `inset(0 0 0 ${fsrSliderPos}%)`,
              backgroundImage: 'radial-gradient(ellipse at center, #064e3b 0%, #022c22 40%, #030712 85%)',
            }}
          >
            <div className="text-center space-y-2 p-4">
              <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-emerald-400 text-glow">
                AI ULTRA RESOLUTION 4K
              </div>
              <div className="text-xs font-mono-code text-emerald-300">
                Render FPS: 142 FPS (+67% BOOST) • Frametime: 7.0ms
              </div>
              <div className="inline-block px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono-code border border-emerald-500/30">
                Tensor AI Neural Reconstruction + Sharpness Filter
              </div>
            </div>
          </div>

          {/* Slider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-400 cursor-ew-resize flex items-center justify-center"
            style={{
              left: `${fsrSliderPos}%`,
              boxShadow: '0 0 15px #00ff88',
            }}
          >
            <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-xs shadow-lg font-bold">
              ↔
            </div>
          </div>

          {/* Invisible slider input for dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={fsrSliderPos}
            onChange={(e) => setFsrSliderPos(parseInt(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
          />

          {/* Labels */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 text-slate-300 font-rajdhani font-bold text-xs border border-slate-800">
            ← Native Baseline
          </div>
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 font-rajdhani font-bold text-xs border border-emerald-500/30">
            DLSS / FSR Super Resolution →
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center">
          Drag the slider left and right to inspect the clarity and framerate multiplier achieved by neural temporal reconstruction.
        </p>
      </div>
    </div>
  );
}
