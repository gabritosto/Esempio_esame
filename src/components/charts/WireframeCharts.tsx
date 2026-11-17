import React from 'react';
import { HourlyBar } from '../../types';

interface HourlyBarChartProps {
  data: HourlyBar[];
}

export const HourlyBarChart: React.FC<HourlyBarChartProps> = ({ data }) => {
  const maxVal = 5;

  return (
    <div className="border border-neutral-300 rounded-md p-3 bg-white">
      <div className="flex items-end justify-between gap-2 h-32 pt-2 border-b border-neutral-300">
        {data.map((bar) => {
          const pct = Math.max(8, Math.round((bar.value / maxVal) * 100));
          const shade =
            bar.value >= 4
              ? 'bg-neutral-900'
              : bar.value >= 3
              ? 'bg-neutral-600'
              : 'bg-neutral-400';

          return (
            <div
              key={bar.hour}
              className="flex-1 h-full flex flex-col items-center justify-end gap-1"
            >
              <span className="text-[10px] text-neutral-600 tabular-nums">
                {bar.value.toFixed(1)}
              </span>
              <div
                className={`w-full max-w-[28px] border border-neutral-900 ${shade}`}
                style={{ height: `${pct}%` }}
                title={`${bar.hour}:00 — Umore ${bar.value.toFixed(1)} (${bar.count} check-in)`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 pt-1.5">
        {data.map((bar) => (
          <span
            key={bar.hour}
            className="flex-1 text-center text-[11px] text-neutral-600 tabular-nums"
          >
            {bar.hour}:00
          </span>
        ))}
      </div>
    </div>
  );
};

interface LineChartPoint {
  label: string;
  value: number | null;
}

interface TrendLineChartProps {
  points: LineChartPoint[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ points }) => {
  const width = 320;
  const height = 140;
  const padLeft = 24;
  const padRight = 12;
  const padTop = 14;
  const padBottom = 22;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const coords = points.map((pt, idx) => {
    const x =
      points.length <= 1
        ? padLeft + plotW / 2
        : padLeft + (idx / (points.length - 1)) * plotW;
    const y =
      pt.value !== null
        ? padTop + ((5 - pt.value) / 4) * plotH
        : null;
    return { x, y, ...pt };
  });

  const validCoords = coords.filter((c): c is typeof c & { y: number } => c.y !== null);
  const polyPoints = validCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  return (
    <div className="border border-neutral-300 rounded-md p-3 bg-white">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Grafico andamento umore"
      >
        {/* Horizontal gridlines 1..5 */}
        {[1, 2, 3, 4, 5].map((tick) => {
          const y = padTop + ((5 - tick) / 4) * plotH;
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#E5E5E5"
                strokeWidth="1"
              />
              <text
                x={6}
                y={y + 3}
                fontSize="9"
                fill="#737373"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Polyline */}
        {validCoords.length > 1 && (
          <polyline
            fill="none"
            stroke="#111111"
            strokeWidth="1.75"
            points={polyPoints}
          />
        )}

        {/* Dots */}
        {validCoords.map((c, idx) => (
          <circle
            key={idx}
            cx={c.x}
            cy={c.y}
            r={points.length > 10 ? 2.5 : 3.5}
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="1.5"
          />
        ))}

        {/* X Axis labels */}
        {coords.map((c, idx) => {
          const showLabel =
            points.length <= 7 || idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1;
          if (!showLabel) return null;
          return (
            <text
              key={idx}
              x={c.x}
              y={height - 4}
              fontSize="9"
              textAnchor="middle"
              fill="#525252"
            >
              {c.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
