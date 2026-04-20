import { useState, useEffect, useRef, useCallback } from "react";

// --- Utility: Simulated Hardware Data ---
function useHardwareStats() {
  const [stats, setStats] = useState({
    fps: 60, fpsHistory: Array(60).fill(60),
    cpu: 45, cpuHistory: Array(60).fill(45),
    gpu: 52, gpuHistory: Array(60).fill(52),
    ram: 61, ramHistory: Array(60).fill(61),
    cpuTemp: 68, gpuTemp: 74,
    cpuClock: 3.6, gpuClock: 1850,
    frameTime: 16.7,
    dropped: 0,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setStats(prev => {
        const fps = Math.max(30, Math.min(144,
          prev.fps + (Math.random() - 0.48) * 8));
        const cpu = Math.max(10, Math.min(100,
          prev.cpu + (Math.random() - 0.5) * 6));
        const gpu = Math.max(20, Math.min(100,
          prev.gpu + (Math.random() - 0.5) * 5));
        const ram = Math.max(30, Math.min(95,
          prev.ram + (Math.random() - 0.5) * 2));
        return {
          fps: Math.round(fps),
          fpsHistory: [...prev.fpsHistory.slice(1), Math.round(fps)],
          cpu: Math.round(cpu),
          cpuHistory: [...prev.cpuHistory.slice(1), Math.round(cpu)],
          gpu: Math.round(gpu),
          gpuHistory: [...prev.gpuHistory.slice(1), Math.round(gpu)],
          ram: Math.round(ram),
          ramHistory: [...prev.ramHistory.slice(1), Math.round(ram)],
          cpuTemp: Math.round(65 + cpu * 0.15 + Math.random() * 3),
          gpuTemp: Math.round(60 + gpu * 0.2 + Math.random() * 4),
          cpuClock: +(3.2 + cpu * 0.015).toFixed(1),
          gpuClock: Math.round(1600 + gpu * 4),
          frameTime: +(1000 / fps).toFixed(1),
          dropped: prev.dropped + (fps < 45 ? 1 : 0),
        };
      });
    }, 300);
    return () => clearInterval(id);
  }, []);
  return stats;
}

// --- Mini Sparkline Graph ---
function Sparkline({ data, color, height = 40, filled = true }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200, h = height;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2
  ]);
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const fillD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {filled && <path d={fillD} fill={`url(#grad-${color})`} />}
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]}
          r="2.5" fill={color} />
      )}
    </svg>
  );
}

// --- Radial Arc Gauge ---
function ArcGauge({ value, max = 100, color, label, unit = "%" }) {
  const pct = value / max;
  const r = 36, cx = 48, cy = 52;
  const startAngle = -210, endAngle = 30;
  const totalArc = endAngle - startAngle;
  const angle = startAngle + totalArc * pct;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (start, end) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)), y: cy + r * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y}`;
  };
  return (
    <svg viewBox="0 0 96 72" className="w-full">
      <path d={arcPath(startAngle, endAngle)} stroke="#1e293b"
        strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={arcPath(startAngle, angle)} stroke={color}
        strokeWidth="6" fill="none" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white"
        fontSize="13" fontWeight="700" fontFamily="'Orbitron', monospace">
        {value}
      </text>
      <text x={cx} y={cy + 7} textAnchor="middle" fill={color}
        fontSize="7" fontFamily="'Rajdhani', sans-serif" letterSpacing="1">
        {unit}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#64748b"
        fontSize="6" fontFamily="'Rajdhani', sans-serif" letterSpacing="2">
        {label}
      </text>
    </svg>
  );
}

// --- FPS Badge ---
function FpsBadge({ fps }) {
  const color = fps >= 90 ? "#00ff88" : fps >= 60 ? "#facc15" : "#f87171";
  const label = fps >= 90 ? "SMOOTH" : fps >= 60 ? "GOOD" : "LAG";
  return (
    <div className="flex flex-col items-center">
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 52, fontWeight: 900, lineHeight: 1,
        color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}66`,
        letterSpacing: -1
      }}>{fps}</div>
      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 11, letterSpacing: 4, color, marginTop: 2
      }}>{label}</div>
      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 9, letterSpacing: 3, color: "#475569", marginTop: 1
      }}>FRAMES / SEC</div>
    </div>
  );
}

// --- Optimization Panel ---
const OPTS = [
  { id: "vsync", label: "V-Sync", icon: "⟳", desc: "Sync frames to display", active: false },
  { id: "lowlatency", label: "Low Latency", icon: "⚡", desc: "Reduce input lag", active: true },
  { id: "powersave", label: "Boost Mode", icon: "🔥", desc: "Max CPU/GPU clock", active: false },
  { id: "gfxopt", label: "GFX Optimizer", icon: "🎮", desc: "Auto-tune graphics", active: true },
  { id: "ram", label: "RAM Cleaner", icon: "🧹", desc: "Free background RAM", active: false },
  { id: "network", label: "Net Boost", icon: "📡", desc: "Prioritize game traffic", active: true },
];

function OptimizationPanel() {
  const [opts, setOpts] = useState(OPTS);
  const toggle = id => setOpts(o => o.map(x => x.id === id ? { ...x, active: !x.active } : x));
  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      {opts.map(opt => (
        <button key={opt.id} onClick={() => toggle(opt.id)}
          style={{
            background: opt.active
              ? "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,200,255,0.08))"
              : "rgba(15,23,42,0.7)",
            border: `1px solid ${opt.active ? "#00ff8866" : "#1e293b"}`,
            borderRadius: 8, padding: "10px 10px", textAlign: "left",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: opt.active ? "0 0 12px #00ff8820" : "none"
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>{opt.icon}</span>
            <div style={{
              width: 28, height: 15, borderRadius: 99,
              background: opt.active ? "#00ff88" : "#1e293b",
              border: `1px solid ${opt.active ? "#00ff88" : "#334155"}`,
              position: "relative", transition: "all 0.25s",
              boxShadow: opt.active ? "0 0 8px #00ff8888" : "none"
            }}>
              <div style={{
                position: "absolute", top: 2, width: 9, height: 9,
                borderRadius: "50%", background: opt.active ? "#0f172a" : "#475569",
                left: opt.active ? 16 : 2, transition: "left 0.25s"
              }} />
            </div>
          </div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 11,
            fontWeight: 700, color: opt.active ? "#00ff88" : "#94a3b8",
            marginTop: 4, letterSpacing: 1
          }}>{opt.label}</div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
            color: "#475569", marginTop: 1
          }}>{opt.desc}</div>
        </button>
      ))}
    </div>
  );
}

// --- Stat Row ---
function StatRow({ label, value, unit, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "4px 0", borderBottom: "1px solid #0f172a" }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11,
        letterSpacing: 1, color: "#64748b" }}>{label}</span>
      <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11,
        fontWeight: 700, color }}>
        {value}<span style={{ fontSize: 9, color: "#475569", marginLeft: 2 }}>{unit}</span>
      </span>
    </div>
  );
}

// --- Tab Button ---
function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "7px 4px",
      background: active ? "rgba(0,255,136,0.1)" : "transparent",
      border: "none", borderBottom: active ? "2px solid #00ff88" : "2px solid transparent",
      color: active ? "#00ff88" : "#475569",
      fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
      fontSize: 11, letterSpacing: 2, cursor: "pointer", transition: "all 0.2s"
    }}>{children}</button>
  );
}

// --- Main App ---
export default function GamingPerformanceMonitor() {
  const stats = useHardwareStats();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [animate, setAnimate] = useState(false);
  const [pulse, setPulse] = useState(false);

  // FPS color
  const fpsColor = stats.fps >= 90 ? "#00ff88" : stats.fps >= 60 ? "#facc15" : "#f87171";

  const handleToggle = () => {
    setAnimate(true);
    setOpen(o => !o);
    setTimeout(() => setAnimate(false), 600);
  };

  // Pulse on FPS drop
  useEffect(() => {
    if (stats.fps < 45) { setPulse(true); setTimeout(() => setPulse(false), 500); }
  }, [stats.fps]);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030712; min-height: 100vh; 
          display: flex; align-items: center; justify-content: center; }
        @keyframes glitch {
          0%,100%{transform:translate(0)}
          20%{transform:translate(-2px,1px)}
          40%{transform:translate(2px,-1px)}
          60%{transform:translate(-1px,2px)}
          80%{transform:translate(1px,-2px)}
        }
        @keyframes popIn {
          0%{opacity:0;transform:scale(0.85) translateY(10px)}
          60%{transform:scale(1.03) translateY(-2px)}
          100%{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes popOut {
          0%{opacity:1;transform:scale(1)}
          100%{opacity:0;transform:scale(0.85) translateY(10px)}
        }
        @keyframes scanline {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes borderGlow {
          0%,100%{box-shadow:0 0 10px #00ff8840,inset 0 0 10px #00ff8808}
          50%{box-shadow:0 0 20px #00ff8870,inset 0 0 20px #00ff8815}
        }
        @keyframes fpsGlitch {
          0%,100%{clip-path:inset(0)}
          10%{clip-path:inset(20% 0 50% 0)}
          30%{clip-path:inset(60% 0 10% 0)}
          50%{clip-path:inset(0)}
        }
        @keyframes ripple {
          0%{transform:scale(0.8);opacity:1}
          100%{transform:scale(2.5);opacity:0}
        }
        .popup-enter{animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .popup-exit{animation:popOut 0.25s ease-in forwards}
        .border-glow{animation:borderGlow 3s ease-in-out infinite}
        .glitch-btn:hover .btn-text{animation:glitch 0.3s steps(1) infinite}
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)"
      }} />

      {/* --- Background --- */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 20% 50%, #0a1628 0%, #030712 60%)",
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 1, height: "100vh",
            background: `rgba(0,255,136,${0.03 + i * 0.005})`,
            left: `${15 + i * 14}%`,
            transform: "skewX(-20deg)"
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, padding: 20 }}>

        {/* ===== FLOATING FPS OVERLAY WIDGET ===== */}
        <div style={{
          background: "rgba(3,7,18,0.92)",
          border: `1px solid ${fpsColor}44`,
          borderRadius: 14, padding: "14px 18px",
          backdropFilter: "blur(20px)",
          boxShadow: `0 0 30px ${fpsColor}20, 0 8px 32px rgba(0,0,0,0.6)`,
          marginBottom: 16,
          animation: pulse ? "fpsGlitch 0.15s steps(1) 3" : undefined
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* FPS Display */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 3, height: 44, borderRadius: 99,
                background: `linear-gradient(to bottom, ${fpsColor}, transparent)`,
                boxShadow: `0 0 8px ${fpsColor}`
              }} />
              <FpsBadge fps={stats.fps} />
            </div>

            {/* Mini Stats */}
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { label: "CPU", value: stats.cpu, color: "#38bdf8" },
                { label: "GPU", value: stats.gpu, color: "#a78bfa" },
                { label: "RAM", value: stats.ram, color: "#fb923c" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Orbitron', monospace", fontSize: 16,
                    fontWeight: 700, color: s.color,
                    textShadow: `0 0 10px ${s.color}88`
                  }}>{s.value}</div>
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif", fontSize: 8,
                    letterSpacing: 2, color: "#475569", marginTop: 1
                  }}>{s.label}%</div>
                </div>
              ))}
            </div>

            {/* Toggle Button */}
            <button onClick={handleToggle} className="glitch-btn" style={{
              width: 42, height: 42, borderRadius: 10,
              background: open
                ? "linear-gradient(135deg, #00ff8820, #00c8ff20)"
                : "rgba(15,23,42,0.8)",
              border: `1px solid ${open ? "#00ff8866" : "#1e293b"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, transition: "all 0.3s",
              boxShadow: open ? "0 0 16px #00ff8840" : "none",
              position: "relative", overflow: "hidden"
            }}>
              {open && <div style={{
                position: "absolute", inset: 0, borderRadius: 10,
                animation: "ripple 0.6s ease-out"
              }} />}
              <span className="btn-text" style={{ fontSize: 18 }}>
                {open ? "✕" : "📊"}
              </span>
            </button>
          </div>

          {/* Frame Time Bar */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
              color: "#334155", letterSpacing: 2, flexShrink: 0 }}>FRTIME</span>
            <div style={{ flex: 1, height: 3, background: "#0f172a", borderRadius: 99 }}>
              <div style={{
                height: 3, borderRadius: 99,
                width: `${Math.min(100, (stats.frameTime / 33.3) * 100)}%`,
                background: `linear-gradient(90deg, ${fpsColor}, ${fpsColor}88)`,
                transition: "width 0.3s", boxShadow: `0 0 6px ${fpsColor}`
              }} />
            </div>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9,
              color: fpsColor, flexShrink: 0 }}>{stats.frameTime}ms</span>
          </div>
        </div>

        {/* ===== POPUP PANEL ===== */}
        {open && (
          <div className={animate ? "popup-enter" : ""} style={{
            background: "rgba(3,7,18,0.97)",
            border: "1px solid #0f172a",
            borderRadius: 16, overflow: "hidden",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 60px rgba(0,255,136,0.08), 0 24px 48px rgba(0,0,0,0.8)"
          }}>

            {/* Panel Header */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid #0f172a",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "linear-gradient(90deg, rgba(0,255,136,0.05), transparent)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#00ff88", boxShadow: "0 0 8px #00ff88",
                  animation: "borderGlow 1.5s ease-in-out infinite"
                }} />
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10,
                  fontWeight: 700, color: "#00ff88", letterSpacing: 3 }}>
                  PERF MONITOR
                </span>
              </div>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
                color: "#334155", letterSpacing: 2 }}>
                DROPPED: <span style={{ color: stats.dropped > 10 ? "#f87171" : "#475569" }}>
                  {stats.dropped}
                </span>
              </span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #0f172a" }}>
              {["OVERVIEW", "GRAPHS", "OPTIMIZE"].map(t => (
                <TabBtn key={t} active={tab === t.toLowerCase()}
                  onClick={() => setTab(t.toLowerCase())}>{t}</TabBtn>
              ))}
            </div>

            {/* Panel Content */}
            <div style={{ padding: 14, minHeight: 320 }}>

              {/* ---- OVERVIEW TAB ---- */}
              {tab === "overview" && (
                <div>
                  {/* Gauges */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 14 }}>
                    <ArcGauge value={stats.fps} max={144} color="#00ff88" label="FPS" unit="fps" />
                    <ArcGauge value={stats.cpu} color="#38bdf8" label="CPU" />
                    <ArcGauge value={stats.gpu} color="#a78bfa" label="GPU" />
                    <ArcGauge value={stats.ram} color="#fb923c" label="RAM" />
                  </div>

                  {/* Stats Table */}
                  <div style={{ background: "#060d1a", borderRadius: 8, padding: "8px 12px" }}>
                    <StatRow label="CPU CLOCK" value={stats.cpuClock} unit="GHz" color="#38bdf8" />
                    <StatRow label="GPU CLOCK" value={stats.gpuClock} unit="MHz" color="#a78bfa" />
                    <StatRow label="CPU TEMP" value={stats.cpuTemp} unit="°C"
                      color={stats.cpuTemp > 85 ? "#f87171" : "#38bdf8"} />
                    <StatRow label="GPU TEMP" value={stats.gpuTemp} unit="°C"
                      color={stats.gpuTemp > 90 ? "#f87171" : "#a78bfa"} />
                    <StatRow label="FRAME TIME" value={stats.frameTime} unit="ms" color={fpsColor} />
                    <StatRow label="AVG FPS" value={
                      Math.round(stats.fpsHistory.reduce((a, b) => a + b, 0) / stats.fpsHistory.length)
                    } unit="fps" color="#00ff88" />
                  </div>
                </div>
              )}

              {/* ---- GRAPHS TAB ---- */}
              {tab === "graphs" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "FPS", history: stats.fpsHistory, color: "#00ff88", max: 144, cur: stats.fps },
                    { label: "CPU LOAD", history: stats.cpuHistory, color: "#38bdf8", max: 100, cur: stats.cpu },
                    { label: "GPU LOAD", history: stats.gpuHistory, color: "#a78bfa", max: 100, cur: stats.gpu },
                    { label: "RAM USAGE", history: stats.ramHistory, color: "#fb923c", max: 100, cur: stats.ram },
                  ].map(g => (
                    <div key={g.label} style={{
                      background: "#060d1a", borderRadius: 8, padding: "8px 10px",
                      border: `1px solid ${g.color}18`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
                          letterSpacing: 2, color: g.color }}>{g.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ height: 3, width: 60, background: "#0f172a", borderRadius: 99 }}>
                            <div style={{
                              height: 3, borderRadius: 99,
                              width: `${(g.cur / g.max) * 100}%`,
                              background: g.color, transition: "width 0.3s"
                            }} />
                          </div>
                          <span style={{ fontFamily: "'Orbitron', monospace",
                            fontSize: 10, fontWeight: 700, color: g.color }}>
                            {g.cur}
                          </span>
                        </div>
                      </div>
                      <Sparkline data={g.history} color={g.color} height={38} />
                    </div>
                  ))}
                </div>
              )}

              {/* ---- OPTIMIZE TAB ---- */}
              {tab === "optimize" && (
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
                    letterSpacing: 2, color: "#334155", marginBottom: 10 }}>
                    PERFORMANCE TOGGLES
                  </div>
                  <OptimizationPanel />
                  <div style={{
                    marginTop: 12, padding: "10px 12px",
                    background: "#060d1a", borderRadius: 8,
                    border: "1px solid #0f172a"
                  }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
                      color: "#00ff88", letterSpacing: 2, marginBottom: 6 }}>
                      PERF SCORE
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: "#0f172a", borderRadius: 99 }}>
                        <div style={{
                          height: 6, borderRadius: 99, width: "72%",
                          background: "linear-gradient(90deg, #00ff88, #00c8ff)",
                          boxShadow: "0 0 8px #00ff8860", transition: "width 0.5s"
                        }} />
                      </div>
                      <span style={{ fontFamily: "'Orbitron', monospace",
                        fontSize: 14, fontWeight: 900, color: "#00ff88" }}>72</span>
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9,
                      color: "#334155", marginTop: 4 }}>
                      Enable all boosts to reach 100
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
