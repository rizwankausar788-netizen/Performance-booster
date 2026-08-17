import React from 'react';

export function MiniSparkline({
  data = [],
  color = '#00ff88',
  height = 36,
  filled = true,
  showMinMax = false,
  unit = '',
}) {
  if (!data || data.length < 2) {
    return <div style={{ height }} className="w-full bg-slate-900/40 rounded animate-pulse" />;
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 220;
  const h = height;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 6) - 3,
  ]);

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const fillD = `${pathD} L${w},${h} L0,${h} Z`;
  const gradId = `spark-${color.replace('#', '')}-${Math.floor(Math.random() * 10000)}`;

  const currentVal = data[data.length - 1];

  return (
    <div className="relative w-full">
      {showMinMax && (
        <div className="flex justify-between items-center text-[9px] font-mono-code text-slate-500 mb-1 px-1">
          <span>MIN: {min}{unit}</span>
          <span style={{ color }} className="font-bold">NOW: {currentVal}{unit}</span>
          <span>MAX: {max}{unit}</span>
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" style={{ height }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {filled && <path d={fillD} fill={`url(#${gradId})`} />}

        {/* Shadow glow line */}
        <path
          d={pathD}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}99)` }}
        />

        {/* Latest Value Circle */}
        {pts.length > 0 && (
          <circle
            cx={pts[pts.length - 1][0]}
            cy={pts[pts.length - 1][1]}
            r="3.5"
            fill="#ffffff"
            stroke={color}
            strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>
    </div>
  );
}
