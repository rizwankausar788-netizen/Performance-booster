import React from 'react';

export function ArcGauge({
  value,
  max = 100,
  min = 0,
  color = '#00ff88',
  label = 'METRIC',
  unit = '%',
  subtitle = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = (clamped - min) / (max - min);

  const startAngle = -215;
  const endAngle = 35;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + totalAngle * pct;

  const toRad = deg => (deg * Math.PI) / 180;

  // Arc path generator
  const r = 38;
  const cx = 50;
  const cy = 52;

  const getPoint = (angle) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const startPt = getPoint(startAngle);
  const endPt = getPoint(endAngle);
  const curPt = getPoint(currentAngle);

  const bgPath = `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 1 1 ${endPt.x} ${endPt.y}`;
  const largeArcFlag = currentAngle - startAngle > 180 ? 1 : 0;
  const valuePath = `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${curPt.x} ${curPt.y}`;

  const sizeClasses = {
    sm: 'w-24 h-20',
    md: 'w-32 h-28',
    lg: 'w-44 h-36',
  }[size] || 'w-32 h-28';

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all group">
      <div className={`relative ${sizeClasses}`}>
        <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
          {/* Outer glow track */}
          <path
            d={bgPath}
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Active Colored Arc */}
          <path
            d={valuePath}
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`,
              transition: 'all 0.35s ease-out',
            }}
          />

          {/* Glowing Indicator Pip at tip */}
          {pct > 0.02 && (
            <circle
              cx={curPt.x}
              cy={curPt.y}
              r="4.5"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2"
              style={{
                filter: `drop-shadow(0 0 8px ${color})`,
                transition: 'all 0.35s ease-out',
              }}
            />
          )}

          {/* Main Numeric Display */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#ffffff"
            className="font-orbitron font-extrabold text-[15px]"
          >
            {value}
          </text>

          {/* Unit Label */}
          <text
            x={cx}
            y={cy + 9}
            textAnchor="middle"
            fill={color}
            className="font-rajdhani font-bold text-[8px] uppercase tracking-widest"
          >
            {unit}
          </text>

          {/* Metric Name */}
          <text
            x={cx}
            y={cy + 21}
            textAnchor="middle"
            fill="#94a3b8"
            className="font-rajdhani font-semibold text-[7px] uppercase tracking-[2px]"
          >
            {label}
          </text>
        </svg>
      </div>
      {subtitle && (
        <span className="text-[10px] font-mono-code text-slate-400 mt-1">
          {subtitle}
        </span>
      )}
    </div>
  );
}
