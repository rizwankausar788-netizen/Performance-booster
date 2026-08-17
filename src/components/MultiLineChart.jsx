import React, { useRef, useEffect, useState } from 'react';
import { Activity, Zap, Cpu, Flame, Layers } from 'lucide-react';

export function MultiLineChart({
  history,
  activeMetrics = ['fps', 'cpu', 'gpu'],
}) {
  const canvasRef = useRef(null);
  const [selectedMetrics, setSelectedMetrics] = useState(activeMetrics);
  const [timeRange, setTimeRange] = useState('30s'); // '15s', '30s', '60s'
  const [hoverData, setHoverData] = useState(null);

  const metricConfigs = {
    fps: { label: 'FPS Rate', color: '#00ff88', unit: 'fps', max: 240, min: 0 },
    frameTime: { label: 'Frame Time', color: '#f59e0b', unit: 'ms', max: 30, min: 0 },
    cpu: { label: 'CPU Usage', color: '#38bdf8', unit: '%', max: 100, min: 0 },
    gpu: { label: 'GPU Usage', color: '#c084fc', unit: '%', max: 100, min: 0 },
    ram: { label: 'RAM Usage', color: '#fb923c', unit: '%', max: 100, min: 0 },
    cpuTemp: { label: 'CPU Temp', color: '#f43f5e', unit: '°C', max: 100, min: 20 },
    gpuTemp: { label: 'GPU Temp', color: '#e11d48', unit: '°C', max: 100, min: 20 },
  };

  const toggleMetric = (key) => {
    if (selectedMetrics.includes(key)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== key));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, key]);
    }
  };

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 30, bottom: 25, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (4 lines)
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label
      const valLabel = Math.round(100 - (i * 25));
      ctx.fillStyle = '#475569';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${valLabel}%`, padding.left - 8, y + 3);
    }

    // Vertical time grid lines
    const timeSteps = 6;
    for (let i = 0; i <= timeSteps; i++) {
      const x = padding.left + (chartW / timeSteps) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      const secAgo = Math.round((timeSteps - i) * (timeRange === '60s' ? 10 : timeRange === '30s' ? 5 : 2.5));
      ctx.fillStyle = '#475569';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`-${secAgo}s`, x, height - 8);
    }

    // Filter data slice based on time range
    const sliceCount = timeRange === '15s' ? 20 : timeRange === '30s' ? 40 : 60;

    // Draw each selected metric
    selectedMetrics.forEach(metricKey => {
      const conf = metricConfigs[metricKey];
      if (!conf) return;

      const rawData = history[metricKey] || [];
      const dataSlice = rawData.slice(-sliceCount);
      if (dataSlice.length < 2) return;

      const pts = dataSlice.map((val, idx) => {
        const x = padding.left + (idx / (dataSlice.length - 1)) * chartW;
        // Normalize value between min and max
        const norm = Math.max(0, Math.min(1, (val - conf.min) / (conf.max - conf.min)));
        const y = padding.top + chartH - (norm * chartH);
        return { x, y, val };
      });

      // Draw Gradient Area under curve
      const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      grad.addColorStop(0, `${conf.color}33`);
      grad.addColorStop(1, `${conf.color}00`);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        // Smooth bezier curve
        const prev = pts[i - 1];
        const cur = pts[i];
        const cx = (prev.x + cur.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, cur.y, cur.x, cur.y);
      }
      ctx.lineTo(pts[pts.length - 1].x, height - padding.bottom);
      ctx.lineTo(pts[0].x, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw Line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        const cx = (prev.x + cur.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, cur.y, cur.x, cur.y);
      }
      ctx.strokeStyle = conf.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = conf.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Draw glowing end dot
      const lastPt = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(lastPt.x, lastPt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = conf.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [history, selectedMetrics, timeRange]);

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden flex flex-col gap-3">
      {/* Header with Series Selector & Time Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-orbitron text-xs font-bold tracking-wider text-slate-200 uppercase">
            Live Telemetry Matrix
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE 60Hz
          </span>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[11px] font-mono-code">
          {['15s', '30s', '60s'].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-2 py-0.5 rounded transition-all ${
                timeRange === t
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Series Toggles Bar */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/60">
        {Object.entries(metricConfigs).map(([key, conf]) => {
          const isSelected = selectedMetrics.includes(key);
          const currentVal = history[key] ? history[key][history[key].length - 1] : '-';
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-rajdhani font-bold tracking-wide transition-all border ${
                isSelected
                  ? 'bg-slate-800/90 text-white shadow-sm'
                  : 'bg-slate-950/40 text-slate-500 border-slate-800/50 hover:text-slate-300'
              }`}
              style={{
                borderColor: isSelected ? `${conf.color}77` : undefined,
                boxShadow: isSelected ? `0 0 10px ${conf.color}22` : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: conf.color,
                  boxShadow: isSelected ? `0 0 6px ${conf.color}` : 'none',
                }}
              />
              <span>{conf.label}:</span>
              <span className="font-mono-code text-[11px]" style={{ color: isSelected ? conf.color : undefined }}>
                {currentVal}{conf.unit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Canvas Container */}
      <div className="relative w-full h-56 bg-slate-950/60 rounded-xl border border-slate-800/60 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />
      </div>
    </div>
  );
}
