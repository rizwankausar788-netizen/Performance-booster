import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  X,
  FileText,
  Activity,
  Cpu,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { sound } from '../utils/audio';

export function DiagnosticsModal({ telemetry, onClose }) {
  const { stats, sysInfo, eventLogs, optimizations, overclock } = telemetry;

  // Bottleneck analyzer
  const isGpuBound = stats.gpu > 90 && stats.cpu < 70;
  const isCpuBound = stats.cpu > 80 && stats.gpu < 75;
  const bottleneckText = isGpuBound
    ? 'GPU Bound (Optimal for 1440p/4K High Fidelity Gaming)'
    : isCpuBound
    ? 'CPU Limited (Consider dropping draw distance or enabling DLSS/FSR frame gen)'
    : 'Balanced Synergy (Excellent load balancing across CPU & GPU)';

  const handleExportReport = () => {
    sound.playSuccess();
    const reportData = {
      timestamp: new Date().toISOString(),
      systemSpecs: sysInfo,
      currentStats: stats,
      activeOptimizations: optimizations,
      overclockProfile: overclock,
      recentLogs: eventLogs,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexTurbo_Diagnostics_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-orbitron font-extrabold text-lg text-white">System Diagnostics & Logs</h2>
              <p className="text-xs font-rajdhani text-slate-400">Hardware bottleneck analysis and real-time execution log</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottleneck & Synergy Inspection */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              HARDWARE LOAD SYNERGY
            </span>
            <span className="text-emerald-400 font-bold">HEALTH 98/100</span>
          </div>

          <p className="text-sm font-rajdhani font-bold text-white">
            {bottleneckText}
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono-code text-slate-400">
            <div>CPU Temp: <strong className="text-emerald-400">{stats.cpuTemp}°C</strong></div>
            <div>GPU Temp: <strong className="text-emerald-400">{stats.gpuTemp}°C</strong></div>
            <div>RAM Pressure: <strong className="text-cyan-400">{stats.ramPercent}%</strong></div>
          </div>
        </div>

        {/* Real-time Event Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron font-bold text-slate-300">Live Optimization Log</span>
            <span className="text-[10px] font-mono-code text-slate-500">{eventLogs.length} Events Logged</span>
          </div>

          <div className="h-44 bg-slate-950 rounded-xl p-3 border border-slate-800/80 overflow-y-auto space-y-1.5 font-mono-code text-xs">
            {eventLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-[11px]">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    'text-slate-300'
                  }
                >
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <div className="text-[11px] font-mono-code text-slate-500">
            Format: JSON Diagnostic Snapshot
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              EXPORT REPORT
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-rajdhani font-bold text-xs transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
