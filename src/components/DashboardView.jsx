import React from 'react';
import {
  Zap,
  Cpu,
  Tv,
  HardDrive,
  Wifi,
  Flame,
  Fan,
  Activity,
  ShieldCheck,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ArcGauge } from './ArcGauge';
import { MiniSparkline } from './MiniSparkline';
import { MultiLineChart } from './MultiLineChart';

export function DashboardView({
  telemetry,
  onOpenBoost,
  onOpenOverlay,
  onOpenBenchmark,
}) {
  const { stats, history, optimizations, toggleOptimization, isBoostActive, executeSuperBoost, isBoostingSequence } = telemetry;

  const fpsColor = stats.fps >= 100 ? '#00ff88' : stats.fps >= 60 ? '#06b6d4' : stats.fps >= 45 ? '#fbbf24' : '#f87171';
  const fpsLabel = stats.fps >= 100 ? 'ULTRA SMOOTH' : stats.fps >= 60 ? 'STABLE 60FPS+' : stats.fps >= 45 ? 'MODERATE' : 'FRAME DROPS';

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* ================= HERO STATS & FPS COMMAND DECK ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Big FPS Master Deck (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl group">
          {/* Ambient Glow Aura */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: fpsColor }}
          />

          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-10 border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ff88]" />
              <span className="font-orbitron text-xs font-bold tracking-widest text-slate-200 uppercase">
                DirectX 12 / Vulkan Display Pipeline
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                DISPLAY: 165Hz G-SYNC
              </span>
              <span
                className="text-[10px] font-rajdhani font-bold px-2 py-0.5 rounded-md tracking-wider uppercase border"
                style={{
                  backgroundColor: `${fpsColor}15`,
                  color: fpsColor,
                  borderColor: `${fpsColor}44`,
                }}
              >
                {fpsLabel}
              </span>
            </div>
          </div>

          {/* Core Numbers Display */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center z-10">
            {/* FPS Hero Counter */}
            <div className="sm:col-span-6 flex flex-col items-start pl-2">
              <span className="font-rajdhani font-bold text-xs uppercase tracking-[3px] text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Render Framerate
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-orbitron font-black text-6xl md:text-7xl tracking-tighter leading-none transition-all duration-200"
                  style={{
                    color: fpsColor,
                    textShadow: `0 0 25px ${fpsColor}66, 0 0 50px ${fpsColor}22`,
                  }}
                >
                  {stats.fps}
                </span>
                <span className="font-orbitron font-bold text-slate-500 text-sm tracking-wider">
                  FPS
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono-code text-slate-400">
                <span>1% Low: <strong className="text-white">{stats.fps1PercentLow}</strong></span>
                <span>•</span>
                <span>0.1% Low: <strong className="text-white">{stats.fps01PercentLow}</strong></span>
              </div>
            </div>

            {/* Frame Time Sparkline & Variance */}
            <div className="sm:col-span-6 flex flex-col gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-rajdhani font-bold text-slate-400 tracking-wider">FRAME DELIVERY</span>
                <span className="font-mono-code font-bold text-emerald-400">{stats.frameTime} ms</span>
              </div>

              {/* Real-time mini sparkline */}
              <MiniSparkline
                data={history.frameTime}
                color={fpsColor}
                height={40}
                filled={true}
              />

              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono-code text-center pt-1 border-t border-slate-800/60">
                <div>
                  <div className="text-slate-500">JITTER</div>
                  <div className="text-slate-200 font-bold">±{stats.frameVariance}ms</div>
                </div>
                <div>
                  <div className="text-slate-500">DROPPED</div>
                  <div className={`font-bold ${stats.droppedFrames > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {stats.droppedFrames}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">STABILITY</div>
                  <div className="text-emerald-400 font-bold">{stats.stabilityScore}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Frametime Progress Meter */}
          <div className="z-10 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-rajdhani font-semibold text-xs tracking-wider">
              <span>LATENCY PIPELINE:</span>
              <span className="text-emerald-400 font-bold font-mono-code">
                {optimizations.ultraLowLatency ? 'REFLEX ULTRA (2.8ms)' : 'STANDARD (14.2ms)'}
              </span>
            </div>

            <button
              onClick={onOpenOverlay}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-rajdhani font-bold text-xs tracking-wider transition-all border border-slate-700"
            >
              <Tv className="w-3 h-3 text-cyan-400" />
              DETACH MINI HUD
            </button>
          </div>
        </div>

        {/* Quick Boost & Hardware Health (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="font-orbitron text-xs font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Engine Performance Mode
            </span>
            <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {stats.gamingRating}
            </span>
          </div>

          {/* Performance Score Gauge Card */}
          <div className="my-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="font-rajdhani text-xs font-bold text-slate-400 tracking-wider uppercase block">
                Total System Index
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-orbitron font-extrabold text-3xl text-white">
                  {stats.performanceScore}
                </span>
                <span className="text-slate-500 font-mono-code text-xs">/ 100</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {isBoostActive ? '⚡ System running at peak unlocked thermal target' : '⚠️ Background tasks active. Boost recommended.'}
              </p>
            </div>

            {/* Turbo Boost Action Button */}
            <button
              onClick={executeSuperBoost}
              disabled={isBoostingSequence}
              className={`relative px-4 py-3 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all flex flex-col items-center justify-center gap-1 shadow-lg ${
                isBoostActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_#00ff8844]'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white shadow-[0_0_20px_#f59e0b44]'
              }`}
            >
              <Zap className={`w-5 h-5 ${isBoostingSequence ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{isBoostingSequence ? 'BOOSTING...' : isBoostActive ? 'TURBO ON' : 'BOOST NOW'}</span>
            </button>
          </div>

          {/* Mini Quick Toggles Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <button
              onClick={() => toggleOptimization('ultraLowLatency')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                optimizations.ultraLowLatency
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
              }`}
            >
              <span className="font-rajdhani font-bold tracking-wide">Reflex Latency</span>
              <span className="font-mono-code text-[10px] font-bold">
                {optimizations.ultraLowLatency ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => toggleOptimization('ramCleaner')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                optimizations.ramCleaner
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
              }`}
            >
              <span className="font-rajdhani font-bold tracking-wide">RAM Auto Purge</span>
              <span className="font-mono-code text-[10px] font-bold">
                {optimizations.ramCleaner ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4 RADIAL TELEMETRY GAUGES ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ArcGauge
          value={stats.cpu}
          max={100}
          color="#38bdf8"
          label="CPU LOAD"
          unit="%"
          subtitle={`${stats.cpuClock} GHz • ${stats.cpuTemp}°C`}
        />
        <ArcGauge
          value={stats.gpu}
          max={100}
          color="#c084fc"
          label="GPU LOAD"
          unit="%"
          subtitle={`${stats.gpuClock} MHz • ${stats.gpuTemp}°C`}
        />
        <ArcGauge
          value={stats.ramPercent}
          max={100}
          color="#fb923c"
          label="RAM USED"
          unit="%"
          subtitle={`${stats.ramUsed} / ${stats.ramTotal} GB`}
        />
        <ArcGauge
          value={Math.round((stats.gpuVramUsed / stats.gpuVramTotal) * 100)}
          max={100}
          color="#ec4899"
          label="VRAM USAGE"
          unit="%"
          subtitle={`${stats.gpuVramUsed} / ${stats.gpuVramTotal} GB`}
        />
      </div>

      {/* ================= MULTI-CORE CPU LOAD MATRIX ================= */}
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-orbitron text-xs font-bold tracking-wider text-slate-200 uppercase">
              Multi-Core Thread Allocation (16 Threads)
            </span>
          </div>
          <span className="text-[11px] font-mono-code text-slate-400">
            Turbo Lock: <strong className="text-cyan-400">{stats.cpuClock} GHz</strong> | Voltage: <strong className="text-white">{stats.cpuVoltage}V</strong>
          </span>
        </div>

        {/* 16 Cores Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-1.5">
          {stats.cpuCores.map((load, idx) => {
            const heatColor = load > 75 ? '#ef4444' : load > 50 ? '#f59e0b' : '#38bdf8';
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex flex-col items-center justify-between text-center group hover:border-cyan-500/50 transition-all"
              >
                <span className="text-[8px] font-rajdhani font-bold text-slate-500">T{idx + 1}</span>
                {/* Vertical Mini Bar */}
                <div className="w-2 h-10 bg-slate-900 rounded-full my-1 relative overflow-hidden">
                  <div
                    className="w-full absolute bottom-0 rounded-full transition-all duration-300"
                    style={{
                      height: `${load}%`,
                      backgroundColor: heatColor,
                      boxShadow: `0 0 6px ${heatColor}88`,
                    }}
                  />
                </div>
                <span
                  className="font-mono-code text-[9px] font-bold"
                  style={{ color: heatColor }}
                >
                  {load}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LIVE MULTI-METRIC CANVAS CHART ================= */}
      <MultiLineChart history={history} />

      {/* ================= HARDWARE DEEP TELEMETRY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GPU Deep Telemetry */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-400" />
              <span className="font-orbitron text-xs font-bold text-slate-200">GPU TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono-code text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              GDDR6X
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono-code">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Core Clock</span>
              <span className="text-white font-bold">{stats.gpuClock} MHz</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Memory Clock</span>
              <span className="text-white font-bold">{stats.gpuMemClock} MHz</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">GPU Core Temp</span>
              <span className={`font-bold ${stats.gpuTemp > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                {stats.gpuTemp}°C
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Hotspot Temp</span>
              <span className="text-slate-300 font-bold">{stats.gpuHotspotTemp}°C</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">TDP Power Draw</span>
              <span className="text-amber-400 font-bold">{stats.gpuPower} Watts</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Fan RPM</span>
              <span className="text-cyan-400 font-bold">{stats.gpuFanRpm} RPM</span>
            </div>
          </div>
        </div>

        {/* CPU Deep Telemetry */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-orbitron text-xs font-bold text-slate-200">CPU TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              x86_64
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono-code">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">All-Core Turbo</span>
              <span className="text-white font-bold">{stats.cpuClock} GHz</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Package Temp</span>
              <span className={`font-bold ${stats.cpuTemp > 85 ? 'text-red-400' : 'text-emerald-400'}`}>
                {stats.cpuTemp}°C
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Core Voltage</span>
              <span className="text-white font-bold">{stats.cpuVoltage} V</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Package Power</span>
              <span className="text-amber-400 font-bold">{stats.cpuPower} Watts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Cooler Fan</span>
              <span className="text-cyan-400 font-bold">{stats.cpuFanRpm} RPM</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">L3 Cache Hit</span>
              <span className="text-emerald-400 font-bold">99.4%</span>
            </div>
          </div>
        </div>

        {/* Network & Memory Telemetry */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="font-orbitron text-xs font-bold text-slate-200">NETWORK & I/O</span>
            </div>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              QoS ACTIVE
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono-code">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Gaming Server Ping</span>
              <span className="text-emerald-400 font-bold">{stats.ping} ms</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Network Jitter</span>
              <span className="text-white font-bold">{stats.jitter} ms</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Packet Loss</span>
              <span className="text-emerald-400 font-bold">{stats.packetLoss}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">NVMe Read Speed</span>
              <span className="text-white font-bold">{stats.diskReadSpeed} MB/s</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Standby RAM Cache</span>
              <span className="text-cyan-400 font-bold">{stats.ramStandby} GB</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Free Physical RAM</span>
              <span className="text-emerald-400 font-bold">{stats.ramFree} GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
