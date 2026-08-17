import React, { useState, useEffect, useRef } from 'react';
import { ArcGauge } from './ArcGauge';
import { MiniSparkline } from './MiniSparkline';
import { sound } from '../utils/audio';
import {
  Zap,
  Cpu,
  Layers,
  Flame,
  Activity,
  X,
  Minimize2,
  Maximize2,
  Sliders,
  Sparkles,
  Move
} from 'lucide-react';

export function FloatingOverlayHUD({ telemetry, onClose }) {
  const { stats, history, sysInfo, optimizations, toggleOptimization, isBoostActive, executeSuperBoost } = telemetry;

  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'graphs' | 'optimize' | 'specs'
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 24, posY: 24 });

  const fpsColor = stats.fps >= 90 ? '#00ff88' : stats.fps >= 60 ? '#facc15' : '#f87171';
  const fpsLabel = stats.fps >= 90 ? 'SMOOTH' : stats.fps >= 60 ? 'GOOD' : 'LAG';

  // Draggable logic
  const handleMouseDown = (e) => {
    // Only allow drag if clicking the header / drag handle
    if (e.target.closest('.no-drag')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 380, dragRef.current.posX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        width: '380px',
      }}
      className="select-none transition-shadow"
    >
      {/* ================= FLOATING FPS WIDGET BAR ================= */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move bg-slate-950/95 border rounded-2xl p-3.5 backdrop-blur-2xl shadow-2xl transition-all relative overflow-hidden"
        style={{
          borderColor: `${fpsColor}55`,
          boxShadow: `0 0 30px ${fpsColor}22, 0 10px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top Mini Drag Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron font-bold text-slate-400">
            <Move className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400">APEX HUD OVERLAY</span>
          </div>

          <div className="flex items-center gap-1.5 no-drag">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                sound.playClick();
              }}
              className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isOpen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-5 h-5 rounded flex items-center justify-center bg-red-950/60 hover:bg-red-800 text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Big Glowing FPS */}
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-10 rounded-full"
              style={{
                backgroundColor: fpsColor,
                boxShadow: `0 0 10px ${fpsColor}`,
              }}
            />
            <div className="flex flex-col">
              <div
                className="font-orbitron font-black text-4xl leading-none tracking-tighter"
                style={{
                  color: fpsColor,
                  textShadow: `0 0 15px ${fpsColor}77`,
                }}
              >
                {stats.fps}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="font-rajdhani font-bold text-[9px] tracking-widest uppercase"
                  style={{ color: fpsColor }}
                >
                  {fpsLabel}
                </span>
                <span className="text-[8px] font-mono-code text-slate-500">• FRAMES/S</span>
              </div>
            </div>
          </div>

          {/* Mini Hardware Metrics */}
          <div className="flex items-center gap-3 text-center">
            <div>
              <div className="font-orbitron font-bold text-sm text-cyan-400">{stats.cpu}%</div>
              <div className="text-[8px] font-rajdhani font-bold text-slate-500">CPU</div>
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm text-purple-400">{stats.gpu}%</div>
              <div className="text-[8px] font-rajdhani font-bold text-slate-500">GPU</div>
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm text-orange-400">{stats.ramPercent}%</div>
              <div className="text-[8px] font-rajdhani font-bold text-slate-500">RAM</div>
            </div>
          </div>

          {/* Toggle Expand Button */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              sound.playClick();
            }}
            className="no-drag w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all border"
            style={{
              backgroundColor: isOpen ? `${fpsColor}22` : '#1e293b',
              borderColor: isOpen ? `${fpsColor}66` : '#334155',
              color: isOpen ? fpsColor : '#94a3b8',
              boxShadow: isOpen ? `0 0 12px ${fpsColor}33` : 'none',
            }}
          >
            {isOpen ? '✕' : '📊'}
          </button>
        </div>

        {/* Frametime Mini Bar */}
        <div className="mt-2.5 flex items-center gap-2 text-[9px] font-mono-code">
          <span className="text-slate-500 tracking-wider">FRTIME</span>
          <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (stats.frameTime / 20) * 100)}%`,
                backgroundColor: fpsColor,
                boxShadow: `0 0 6px ${fpsColor}`,
              }}
            />
          </div>
          <span style={{ color: fpsColor }} className="font-bold">{stats.frameTime}ms</span>
        </div>
      </div>

      {/* ================= EXPANDABLE POPUP TRAY ================= */}
      {isOpen && (
        <div className="mt-2 bg-slate-950/95 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl space-y-3 p-3.5 animate-popIn no-drag">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 pb-1 text-[11px] font-rajdhani font-bold tracking-wider">
            {['OVERVIEW', 'GRAPHS', 'OPTIMIZE', 'SPECS'].map((tab) => {
              const tabKey = tab.toLowerCase();
              const isTabActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tabKey);
                    sound.playClick();
                  }}
                  className={`flex-1 py-1 text-center transition-all border-b-2 ${
                    isTabActive
                      ? 'border-emerald-400 text-emerald-400 font-extrabold bg-emerald-500/10 rounded-t'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-1.5">
                <ArcGauge value={stats.fps} max={165} color="#00ff88" label="FPS" unit="fps" size="sm" />
                <ArcGauge value={stats.cpu} max={100} color="#38bdf8" label="CPU" unit="%" size="sm" />
                <ArcGauge value={stats.gpu} max={100} color="#c084fc" label="GPU" unit="%" size="sm" />
                <ArcGauge value={stats.ramPercent} max={100} color="#fb923c" label="RAM" unit="%" size="sm" />
              </div>

              <div className="bg-slate-900/80 rounded-xl p-2.5 text-xs font-mono-code space-y-1.5 border border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>CPU ALL-CORE CLOCK</span>
                  <span className="text-cyan-400 font-bold">{stats.cpuClock} GHz</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GPU FREQUENCY</span>
                  <span className="text-purple-400 font-bold">{stats.gpuClock} MHz</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CPU / GPU TEMPS</span>
                  <span className="text-white font-bold">{stats.cpuTemp}°C / {stats.gpuTemp}°C</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>AVERAGE FRAMERATE</span>
                  <span className="text-emerald-400 font-bold">{stats.fps} FPS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NETWORK PING (QoS)</span>
                  <span className="text-emerald-400 font-bold">{stats.ping} ms</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRAPHS */}
          {activeTab === 'graphs' && (
            <div className="space-y-2">
              {[
                { label: 'FPS HISTORY', data: history.fps, color: '#00ff88', cur: stats.fps, unit: 'fps' },
                { label: 'CPU LOAD', data: history.cpu, color: '#38bdf8', cur: stats.cpu, unit: '%' },
                { label: 'GPU LOAD', data: history.gpu, color: '#c084fc', cur: stats.gpu, unit: '%' },
                { label: 'FRAME TIME', data: history.frameTime, color: '#f59e0b', cur: stats.frameTime, unit: 'ms' },
              ].map((g) => (
                <div key={g.label} className="bg-slate-900/70 p-2 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between text-[10px] font-rajdhani font-bold mb-1">
                    <span style={{ color: g.color }} className="tracking-wider">{g.label}</span>
                    <span className="font-mono-code text-white">{g.cur}{g.unit}</span>
                  </div>
                  <MiniSparkline data={g.data} color={g.color} height={28} filled={true} />
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: OPTIMIZE */}
          {activeTab === 'optimize' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ultraLowLatency', label: 'Reflex Latency', icon: '⚡' },
                  { id: 'ramCleaner', label: 'RAM Auto Purge', icon: '🧹' },
                  { id: 'turboCpu', label: 'CPU Turbo Lock', icon: '🔥' },
                  { id: 'networkQos', label: 'Net QoS Boost', icon: '📡' },
                ].map((opt) => {
                  const isActive = optimizations[opt.id];
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOptimization(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span>{opt.icon}</span>
                        <span className={`text-[9px] font-mono-code font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isActive ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <div className="font-rajdhani font-bold text-xs mt-1 text-slate-200">{opt.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Master Super Boost Trigger */}
              <button
                onClick={executeSuperBoost}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider transition-all shadow-[0_0_15px_#00ff8844] flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                {isBoostActive ? 'RE-APPLY SUPER BOOST' : 'SUPER BOOST NOW'}
              </button>
            </div>
          )}

          {/* TAB 4: SPECS */}
          {activeTab === 'specs' && (
            <div className="bg-slate-900/80 rounded-xl p-3 text-xs font-mono-code space-y-1.5 border border-slate-800">
              <div className="text-slate-500 text-[10px]">DETECTED HARDWARE:</div>
              <div className="text-white font-bold truncate">{sysInfo.gpu}</div>
              <div className="text-slate-400">Logical Cores: <strong className="text-cyan-400">{sysInfo.cores} Threads</strong></div>
              <div className="text-slate-400">System Memory: <strong className="text-purple-400">{sysInfo.memoryGB} GB RAM</strong></div>
              <div className="text-slate-400">OS Architecture: <strong className="text-slate-200">{sysInfo.os}</strong></div>
              <div className="text-slate-400">Display Sync: <strong className="text-emerald-400">{sysInfo.screenRes}</strong></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
