import React, { useMemo, useState } from 'react';
import { warehouses } from '@/services/mock/catalog';
import './NetworkMap.less';

/** Equirectangular approx. lon/lat → viewBox 1000×500 */
function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  };
}

const HUBS = [
  { code: 'SEA-01', short: 'SEA', city: 'Seattle', lon: -122.3, lat: 47.6, region: 'US-West' },
  { code: 'LON-02', short: 'LON', city: 'London', lon: -0.1, lat: 51.5, region: 'EU' },
  { code: 'SHA-03', short: 'SHA', city: 'Shanghai', lon: 121.5, lat: 31.2, region: 'APAC' },
  { code: 'SAO-04', short: 'SAO', city: 'São Paulo', lon: -46.6, lat: -23.5, region: 'LATAM' },
  { code: 'DXB-05', short: 'DXB', city: 'Dubai', lon: 55.3, lat: 25.2, region: 'META' },
] as const;

const ROUTES: [string, string][] = [
  ['SEA-01', 'LON-02'],
  ['LON-02', 'DXB-05'],
  ['DXB-05', 'SHA-03'],
  ['SEA-01', 'SHA-03'],
  ['SEA-01', 'SAO-04'],
  ['LON-02', 'SAO-04'],
];

function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = Math.min(70, dist * 0.22);
  const cx = mx - (dy / dist) * lift;
  const cy = my + (dx / dist) * lift;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

type Props = {
  /** hero | section */
  variant?: 'hero' | 'section';
  onSelect?: (code: string) => void;
};

const NetworkMap: React.FC<Props> = ({ variant = 'hero', onSelect }) => {
  const [active, setActive] = useState<string | null>('LON-02');

  const points = useMemo(
    () =>
      HUBS.map((h) => {
        const p = project(h.lon, h.lat);
        const meta = warehouses.find((w) => w.code === h.code);
        return { ...h, ...p, name: meta?.name || h.city, supervisor: meta?.supervisor };
      }),
    [],
  );

  const byCode = useMemo(() => {
    const m = new Map(points.map((p) => [p.code, p]));
    return m;
  }, [points]);

  const selected = points.find((p) => p.code === active) || points[0];

  return (
    <div className={`netmap netmap--${variant}`}>
      <svg
        className="netmap__svg"
        viewBox="0 0 1000 500"
        role="img"
        aria-label="ZavaShop global fulfillment network map"
      >
        <defs>
          <linearGradient id="netmapOcean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b3a5c" />
            <stop offset="55%" stopColor="#0f4c75" />
            <stop offset="100%" stopColor="#16537e" />
          </linearGradient>
          <linearGradient id="netmapLand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3c0" />
            <stop offset="100%" stopColor="#3d9b8f" />
          </linearGradient>
          <filter id="netmapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="netmapArrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.55)" />
          </marker>
        </defs>

        <rect width="1000" height="500" fill="url(#netmapOcean)" rx="18" />

        {/* latitude guides */}
        {[125, 250, 375].map((y) => (
          <line
            key={y}
            x1="40"
            x2="960"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 8"
          />
        ))}

        {/* Simplified continents (stylized, not cartographic-precise) */}
        <g fill="url(#netmapLand)" opacity="0.92" stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          {/* North America */}
          <path d="M118 95 C150 70 210 68 250 95 C280 120 290 155 270 190 C250 230 210 245 170 235 C130 220 105 185 100 150 C95 120 100 105 118 95 Z" />
          {/* South America */}
          <path d="M250 270 C280 255 310 270 320 310 C330 360 310 410 280 430 C250 445 230 420 225 380 C220 335 225 290 250 270 Z" />
          {/* Europe */}
          <path d="M470 95 C500 85 530 90 545 115 C555 140 540 165 510 168 C480 170 460 145 465 120 C467 108 470 100 470 95 Z" />
          {/* Africa */}
          <path d="M490 185 C530 175 565 195 575 240 C585 290 560 340 520 355 C480 365 455 330 450 280 C445 230 460 195 490 185 Z" />
          {/* Asia */}
          <path d="M560 90 C620 70 720 75 790 110 C840 140 870 180 860 220 C845 260 790 275 730 260 C680 250 640 230 600 200 C570 175 550 140 560 90 Z" />
          {/* SE Asia / China coast bump */}
          <path d="M780 230 C810 225 835 245 830 270 C820 290 790 292 770 275 C755 255 765 235 780 230 Z" />
          {/* Australia */}
          <path d="M820 350 C860 340 900 355 910 385 C915 410 880 425 845 418 C815 410 800 380 820 350 Z" />
        </g>

        {/* Routes */}
        <g fill="none" stroke="rgba(255,220,150,0.45)" strokeWidth="1.6" strokeDasharray="5 6">
          {ROUTES.map(([a, b]) => {
            const p1 = byCode.get(a);
            const p2 = byCode.get(b);
            if (!p1 || !p2) return null;
            const hot = active === a || active === b;
            return (
              <path
                key={`${a}-${b}`}
                d={arcPath(p1.x, p1.y, p2.x, p2.y)}
                className={hot ? 'netmap__route is-hot' : 'netmap__route'}
                markerEnd="url(#netmapArrow)"
              />
            );
          })}
        </g>

        {/* Hubs */}
        {points.map((p) => {
          const hot = active === p.code;
          return (
            <g
              key={p.code}
              className={`netmap__hub ${hot ? 'is-active' : ''}`}
              transform={`translate(${p.x}, ${p.y})`}
              onMouseEnter={() => setActive(p.code)}
              onClick={() => {
                setActive(p.code);
                onSelect?.(p.code);
              }}
              style={{ cursor: 'pointer' }}
            >
              {hot ? (
                <circle r="22" className="netmap__pulse" fill="rgba(255,200,80,0.28)" />
              ) : null}
              <circle r="9" fill="#ffd666" stroke="#fff" strokeWidth="2.5" filter="url(#netmapGlow)" />
              <rect
                x={p.x > 880 ? -76 : 14}
                y="-16"
                rx="7"
                ry="7"
                width="70"
                height="26"
                fill={hot ? '#1677ff' : 'rgba(8,28,48,0.88)'}
              />
              <text
                x={p.x > 880 ? -41 : 49}
                y="2"
                textAnchor="middle"
                className="netmap__label"
              >
                {p.short}
              </text>
            </g>
          );
        })}

        <text x="28" y="36" className="netmap__title">
          ZavaShop Fulfillment Network
        </text>
        <text x="28" y="56" className="netmap__subtitle">
          5 hubs · SEA · LON · SHA · SAO · DXB
        </text>
      </svg>

      {variant === 'section' && selected ? (
        <div className="netmap__panel">
          <div className="netmap__panel-code">{selected.code}</div>
          <div className="netmap__panel-name">{selected.name}</div>
          <div className="netmap__panel-meta">
            {selected.region} · {selected.city}
            {selected.supervisor ? ` · Supervisor ${selected.supervisor}` : ''}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NetworkMap;
