import React, { useState } from 'react';
import {
  ListFilter,
  Trash2,
  Zap,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { sound } from '../utils/audio';

const INITIAL_PROCESSES = [
  { id: 1, name: 'Cyberpunk2077.exe', category: 'Game', cpu: 28.4, ram: 4200, gpu: 72.1, priority: 'Realtime', impact: 'High' },
  { id: 2, name: 'chrome.exe (14 tabs)', category: 'Background', cpu: 6.2, ram: 1680, gpu: 2.4, priority: 'Normal', impact: 'Medium' },
  { id: 3, name: 'Discord.exe (Hardware Accel)', category: 'Background', cpu: 3.8, ram: 620, gpu: 4.1, priority: 'Normal', impact: 'Medium' },
  { id: 4, name: 'steamwebhelper.exe', category: 'Launcher', cpu: 1.4, ram: 480, gpu: 0.8, priority: 'Low', impact: 'Low' },
  { id: 5, name: 'EpicGamesLauncher.exe', category: 'Launcher', cpu: 2.1, ram: 540, gpu: 1.2, priority: 'Low', impact: 'Low' },
  { id: 6, name: 'Antivirus_Realtime_Scan.exe', category: 'Bloatware', cpu: 8.5, ram: 790, gpu: 0.0, priority: 'High', impact: 'High' },
  { id: 7, name: 'Spotify.exe', category: 'Background', cpu: 1.1, ram: 310, gpu: 0.5, priority: 'Low', impact: 'Low' },
  { id: 8, name: 'NVIDIA_Share_ShadowPlay.exe', category: 'Utility', cpu: 2.4, ram: 410, gpu: 3.2, priority: 'Normal', impact: 'Medium' },
  { id: 9, name: 'Cortana_SearchTelemetry.exe', category: 'Bloatware', cpu: 4.2, ram: 280, gpu: 0.0, priority: 'Normal', impact: 'Medium' },
];

export function ProcessManagerView({ telemetry }) {
  const { addLog } = telemetry;
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Game', 'Background', 'Launcher', 'Bloatware'];

  const filtered = processes.filter(p => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleKillProcess = (id, name) => {
    sound.playClick();
    setProcesses(processes.filter(p => p.id !== id));
    addLog('warning', `Terminated task: ${name}. Reclaimed system memory.`);
  };

  const handleSetPriority = (id, name) => {
    sound.playSuccess();
    setProcesses(processes.map(p => p.id === id ? { ...p, priority: 'Realtime' } : p));
    addLog('success', `Assigned Realtime CPU affinity to ${name}.`);
  };

  const handlePurgeAllBloatware = () => {
    sound.playBoost();
    const bloatCount = processes.filter(p => p.category === 'Bloatware' || p.impact === 'Medium' && p.category !== 'Game').length;
    setProcesses(processes.filter(p => p.category === 'Game' || p.category === 'Launcher'));
    addLog('success', `🧹 Purged ${bloatCount} non-essential background processes. Freed ~2.8 GB RAM!`);
  };

  const totalRamUsed = processes.reduce((a, b) => a + b.ram, 0);
  const totalCpuUsed = +(processes.reduce((a, b) => a + b.cpu, 0)).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HEADER & BULK CLEAN ACTION ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wider flex items-center gap-2.5">
            <ListFilter className="w-6 h-6 text-cyan-400" />
            Gaming Process & Resource Manager
          </h1>
          <p className="text-xs font-rajdhani text-slate-400 tracking-wider mt-0.5">
            Identify and terminate background tasks eating CPU cycles and RAM during gaming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePurgeAllBloatware}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_#06b6d444] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            PURGE NON-ESSENTIAL TASKS
          </button>
        </div>
      </div>

      {/* Summary Stat Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase">ACTIVE PROCESSES</span>
            <div className="font-orbitron font-bold text-xl text-white mt-0.5">{processes.length} Tasks</div>
          </div>
          <Layers className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase">TRACKED CPU LOAD</span>
            <div className="font-orbitron font-bold text-xl text-cyan-400 mt-0.5">{totalCpuUsed}%</div>
          </div>
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase">TRACKED MEMORY</span>
            <div className="font-orbitron font-bold text-xl text-purple-400 mt-0.5">{(totalRamUsed / 1024).toFixed(2)} GB</div>
          </div>
          <HardDrive className="w-5 h-5 text-purple-400" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                sound.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-rajdhani font-bold tracking-wider transition-all border ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_#06b6d422]'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter process name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all w-52"
          />
        </div>
      </div>

      {/* Process Table */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-slate-950/80 text-slate-400 text-[10px] font-rajdhani font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PROCESS EXECUTABLE</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3">CPU USAGE</th>
                <th className="py-3 px-3">MEMORY (RAM)</th>
                <th className="py-3 px-3">GPU LOAD</th>
                <th className="py-3 px-3">PRIORITY</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(p => {
                const isHighCpu = p.cpu > 5;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.category === 'Game' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      {p.name}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.category === 'Game' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        p.category === 'Bloatware' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {p.category}
                      </span>
                    </td>

                    <td className={`py-3 px-3 font-bold ${isHighCpu ? 'text-amber-400' : 'text-slate-300'}`}>
                      {p.cpu}%
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      {p.ram} MB
                    </td>

                    <td className="py-3 px-3 text-purple-300">
                      {p.gpu}%
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-bold ${p.priority === 'Realtime' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {p.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      {p.priority !== 'Realtime' && (
                        <button
                          onClick={() => handleSetPriority(p.id, p.name)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold border border-slate-700"
                        >
                          PRIORITY
                        </button>
                      )}
                      <button
                        onClick={() => handleKillProcess(p.id, p.name)}
                        className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[10px] font-bold border border-red-500/30"
                      >
                        END TASK
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
