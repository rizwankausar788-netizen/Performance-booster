import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Settings2,
  Sparkles,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Search,
  Filter,
  Zap,
  Square
} from 'lucide-react';
import { sound } from '../utils/audio';

const INITIAL_GAMES = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'Open-World / RPG',
    bannerColor: 'from-amber-600 to-yellow-500',
    stockFps: 68,
    boostedFps: 114,
    preset: 'Ray-Tracing Cinematic',
    targetFps: 120,
    reflex: true,
    dlss: 'DLSS 3.5 Frame Gen',
    playtime: '142h',
    status: 'Ready',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    genre: 'FPS / Esports',
    bannerColor: 'from-rose-600 to-red-500',
    stockFps: 280,
    boostedFps: 420,
    preset: 'Esports Maximum FPS',
    targetFps: 360,
    reflex: true,
    dlss: 'Native Low-Latency',
    playtime: '380h',
    status: 'Ready',
  },
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    genre: 'FPS / Esports',
    bannerColor: 'from-orange-600 to-amber-500',
    stockFps: 190,
    boostedFps: 295,
    preset: 'Esports Maximum FPS',
    targetFps: 240,
    reflex: true,
    dlss: 'FSR 3 Native AA',
    playtime: '520h',
    status: 'Ready',
  },
  {
    id: 'warzone',
    title: 'Call of Duty: Warzone',
    genre: 'Battle Royale',
    bannerColor: 'from-emerald-600 to-teal-500',
    stockFps: 105,
    boostedFps: 158,
    preset: 'Competitive Balanced',
    targetFps: 144,
    reflex: true,
    dlss: 'DLSS Quality',
    playtime: '95h',
    status: 'Ready',
  },
  {
    id: 'wukong',
    title: 'Black Myth: Wukong',
    genre: 'Open-World / RPG',
    bannerColor: 'from-yellow-700 to-amber-600',
    stockFps: 72,
    boostedFps: 118,
    preset: 'Unreal Engine 5 Tuned',
    targetFps: 120,
    reflex: true,
    dlss: 'TSR / DLSS Balanced',
    playtime: '48h',
    status: 'Ready',
  },
  {
    id: 'apex',
    title: 'Apex Legends',
    genre: 'Battle Royale',
    bannerColor: 'from-red-600 to-pink-600',
    stockFps: 140,
    boostedFps: 210,
    preset: 'Esports Maximum FPS',
    targetFps: 240,
    reflex: true,
    dlss: 'Adaptive Resolution',
    playtime: '210h',
    status: 'Ready',
  },
  {
    id: 'eldenring',
    title: 'Elden Ring: Shadow of the Erdtree',
    genre: 'Open-World / RPG',
    bannerColor: 'from-amber-700 to-orange-800',
    stockFps: 60,
    boostedFps: 120,
    preset: 'Framerate Unlocked 120Hz',
    targetFps: 120,
    reflex: false,
    dlss: 'Flawless Widescreen Fix',
    playtime: '185h',
    status: 'Ready',
  },
  {
    id: 'forza',
    title: 'Forza Horizon 5',
    genre: 'Racing / Simulation',
    bannerColor: 'from-pink-600 to-purple-600',
    stockFps: 110,
    boostedFps: 165,
    preset: 'Ultra Ray-Tracing',
    targetFps: 165,
    reflex: true,
    dlss: 'DLSS Quality + Reflex',
    playtime: '76h',
    status: 'Ready',
  },
];

export function GameLibraryView({ telemetry }) {
  const { executeSuperBoost, addLog } = telemetry;
  const [games, setGames] = useState(INITIAL_GAMES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [runningGame, setRunningGame] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameGenre, setNewGameGenre] = useState('FPS / Esports');

  const categories = ['All', 'FPS / Esports', 'Open-World / RPG', 'Battle Royale', 'Racing / Simulation'];

  const filteredGames = games.filter(g => {
    const matchCat = activeCategory === 'All' || g.genre === activeCategory;
    const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleLaunchGame = (game) => {
    setIsLaunching(true);
    sound.playBoost();
    addLog('warning', `Preparing Turbo Booster engine for ${game.title}...`);

    setTimeout(() => {
      setIsLaunching(false);
      setRunningGame(game);
      setSessionTime(0);
      sound.playSuccess();
      executeSuperBoost();
      addLog('success', `🚀 Launched ${game.title} with high-priority thread allocation!`);
    }, 1500);
  };

  const handleStopGame = () => {
    if (!runningGame) return;
    sound.playClick();
    addLog('info', `Stopped session for ${runningGame.title}. Logged 100% framerate stability.`);
    setRunningGame(null);
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    const newG = {
      id: `game-${Date.now()}`,
      title: newGameName.trim(),
      genre: newGameGenre,
      bannerColor: 'from-blue-600 to-indigo-600',
      stockFps: 80,
      boostedFps: 125,
      preset: 'Apex Turbo Auto-Tuned',
      targetFps: 144,
      reflex: true,
      dlss: 'Super Resolution Active',
      playtime: '0h',
      status: 'Ready',
    };

    setGames([newG, ...games]);
    setNewGameName('');
    setShowAddModal(false);
    sound.playSuccess();
    addLog('success', `Added custom game title: ${newG.title}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= ACTIVE RUNNING GAME SESSION BANNER ================= */}
      {runningGame && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90 border-2 border-emerald-500/60 shadow-[0_0_30px_#00ff8833] flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-orbitron font-bold text-sm text-white">{runningGame.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SESSION ACTIVE
                </span>
              </div>
              <p className="text-xs font-mono-code text-slate-400 mt-1">
                Render FPS: <strong className="text-emerald-400">{runningGame.boostedFps} FPS</strong> (+{Math.round(((runningGame.boostedFps - runningGame.stockFps) / runningGame.stockFps) * 100)}% Boost) • Reflex Ultra: <strong className="text-cyan-400">2.4ms</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStopGame}
              className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-orbitron font-bold text-xs tracking-wider transition-all border border-red-500 shadow-md flex items-center gap-2"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              END GAME SESSION
            </button>
          </div>
        </div>
      )}

      {/* ================= SEARCH & CATEGORIES HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wider flex items-center gap-2.5">
            <Gamepad2 className="w-6 h-6 text-emerald-400" />
            Game Library & Optimization Profiles
          </h1>
          <p className="text-xs font-rajdhani text-slate-400 tracking-wider mt-0.5">
            Tuned profiles automatically assign CPU Core affinities, lock GPU boost floors, and clear RAM before launch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all w-44 md:w-56"
            />
          </div>

          {/* Add Game Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-rajdhani font-bold text-xs tracking-wider transition-all border border-slate-700 shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            ADD GAME
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              sound.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-rajdhani font-bold text-xs tracking-wider transition-all border ${
              activeCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_#00ff8822]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= GAME CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => {
          const boostDelta = Math.round(((game.boostedFps - game.stockFps) / game.stockFps) * 100);
          const isCurrentlyRunning = runningGame && runningGame.id === game.id;

          return (
            <div
              key={game.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all group shadow-lg"
            >
              {/* Game Banner Header */}
              <div className={`h-24 bg-gradient-to-r ${game.bannerColor} p-3 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                    {game.genre}
                  </span>
                  <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/80 text-black font-bold">
                    +{boostDelta}% FPS
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-orbitron font-bold text-sm text-white drop-shadow-md truncate">
                    {game.title}
                  </h3>
                </div>
              </div>

              {/* Game Specs & Stats */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs font-mono-code">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Active Profile</span>
                    <span className="text-cyan-400 font-bold text-[11px] truncate max-w-[120px]">{game.preset}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Stock vs Boosted</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 line-through">{game.stockFps}</span>
                      <span className="text-emerald-400 font-bold text-sm">{game.boostedFps} FPS</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Upscaler / Reflex</span>
                    <span className="text-purple-400 text-[10px]">{game.dlss}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Playtime Logged</span>
                    <span className="text-slate-300 font-mono-code">{game.playtime}</span>
                  </div>
                </div>

                {/* Launch Action */}
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchGame(game)}
                    disabled={isLaunching || isCurrentlyRunning}
                    className={`w-full py-2.5 px-3 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                      isCurrentlyRunning
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_15px_#00ff8833]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isCurrentlyRunning ? 'GAME RUNNING' : 'LAUNCH BOOSTED'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ADD GAME MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-orbitron font-bold text-base text-white">Add Custom Game</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGame} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-rajdhani font-bold">Game Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Helldivers 2, Rust, DOOM Eternal"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-rajdhani font-bold">Genre Category</label>
                <select
                  value={newGameGenre}
                  onChange={(e) => setNewGameGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="FPS / Esports">FPS / Esports</option>
                  <option value="Open-World / RPG">Open-World / RPG</option>
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="Racing / Simulation">Racing / Simulation</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-rajdhani font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold shadow-lg"
                >
                  ADD GAME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
