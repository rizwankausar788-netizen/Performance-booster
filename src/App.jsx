import React, { useState, useEffect } from 'react';
import { useHardwareTelemetry } from './hooks/useHardwareTelemetry';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BoosterView } from './components/BoosterView';
import { GameLibraryView } from './components/GameLibraryView';
import { BenchmarkLabView } from './components/BenchmarkLabView';
import { ProcessManagerView } from './components/ProcessManagerView';
import { FloatingOverlayHUD } from './components/FloatingOverlayHUD';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { Tv, Sparkles, Zap } from 'lucide-react';
import { sound } from './utils/audio';

export default function App() {
  const telemetry = useHardwareTelemetry();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'booster' | 'games' | 'benchmark' | 'processes'
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('emerald');

  // Sync theme attribute to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Scanline CRT overlay filter */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50 opacity-20" />

      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0 opacity-40" />

      {/* Radial Ambient Glow Lights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Command Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOverlayOpen={isOverlayOpen}
        setIsOverlayOpen={setIsOverlayOpen}
        telemetry={telemetry}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      {/* Main Viewport Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 relative z-10">
        {currentView === 'dashboard' && (
          <DashboardView
            telemetry={telemetry}
            onOpenBoost={() => setCurrentView('booster')}
            onOpenOverlay={() => setIsOverlayOpen(true)}
            onOpenBenchmark={() => setCurrentView('benchmark')}
          />
        )}

        {currentView === 'booster' && (
          <BoosterView telemetry={telemetry} />
        )}

        {currentView === 'games' && (
          <GameLibraryView telemetry={telemetry} />
        )}

        {currentView === 'benchmark' && (
          <BenchmarkLabView telemetry={telemetry} />
        )}

        {currentView === 'processes' && (
          <ProcessManagerView telemetry={telemetry} />
        )}
      </main>

      {/* Floating In-Game Mini HUD Overlay Widget */}
      {isOverlayOpen && (
        <FloatingOverlayHUD
          telemetry={telemetry}
          onClose={() => setIsOverlayOpen(false)}
        />
      )}

      {/* Floating Quick Detach HUD Button (when overlay is closed) */}
      {!isOverlayOpen && (
        <button
          onClick={() => {
            sound.playClick();
            setIsOverlayOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 font-rajdhani font-bold text-xs tracking-wider backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,136,0.25)] hover:scale-105 transition-all flex items-center gap-2"
        >
          <Tv className="w-4 h-4 text-emerald-400" />
          <span>OPEN IN-GAME HUD</span>
        </button>
      )}

      {/* Diagnostics & Logs Modal */}
      {isDiagnosticsOpen && (
        <DiagnosticsModal
          telemetry={telemetry}
          onClose={() => setIsDiagnosticsOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-12 py-6 text-center text-xs font-mono-code text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>APEX TURBO // Hardware Architecture Command Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>DirectX 12 Ultimate</span>
            <span>•</span>
            <span>Vulkan 1.3</span>
            <span>•</span>
            <span>NVIDIA Reflex 2.0</span>
            <span>•</span>
            <span>FSR 3.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
