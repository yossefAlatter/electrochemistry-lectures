/**
 * The electromagnetic spectrum as one continuous bar.
 *
 * The named regions are labels on a continuous range, not separated kinds of
 * radiation. Read from the left (short wavelength, high energy) to the right
 * (long wavelength, low energy): gamma rays, X-rays, ultraviolet, visible,
 * infrared, microwaves and radio waves.
 */

import { C, Frame, T } from "./kit";

const X0 = 60;
const X1 = 660;
const Y = 132;
const H = 66;

const BANDS: { label: string; fill: string }[] = [
  { label: "Gamma", fill: "#6d28d9" },
  { label: "X-ray", fill: "#4f46e5" },
  { label: "UV", fill: "#7c3aed" },
  { label: "Visible", fill: "url(#emsp-vis)" },
  { label: "Infrared", fill: "#b91c1c" },
  { label: "Microwave", fill: "#78716c" },
  { label: "Radio", fill: "#a8a29e" },
];

export function EmSpectrum() {
  const w = (X1 - X0) / BANDS.length;

  return (
    <Frame
      height={268}
      title="The electromagnetic spectrum: gamma rays, X-rays, ultraviolet, visible, infrared, microwaves and radio waves, forming one continuous range from short wavelength and high energy to long wavelength and low energy"
    >
      <defs>
        <linearGradient id="emsp-vis" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="0.25" stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#22c55e" />
          <stop offset="0.75" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
        <clipPath id="emsp-clip">
          <rect x={X0} y={Y} width={X1 - X0} height={H} rx={8} />
        </clipPath>
      </defs>

      <g clipPath="url(#emsp-clip)">
        {BANDS.map((band, i) => (
          <rect
            key={band.label}
            x={X0 + i * w}
            y={Y}
            width={w}
            height={H}
            fill={band.fill}
          />
        ))}
      </g>

      {BANDS.map((band, i) => (
        <T
          key={band.label}
          x={X0 + i * w + w / 2}
          y={Y - 16}
          size={12}
          weight={600}
          fill={C.ink}
        >
          {band.label}
        </T>
      ))}

      <rect
        x={X0}
        y={Y}
        width={X1 - X0}
        height={H}
        rx={8}
        fill="none"
        stroke={C.rule}
        strokeWidth={1.5}
      />

      <T x={X0} y={Y + H + 38} size={12} fill={C.inkSoft} anchor="start">
        shorter wavelength · higher energy
      </T>
      <T x={X1} y={Y + H + 38} size={12} fill={C.inkSoft} anchor="end">
        longer wavelength · lower energy
      </T>
    </Frame>
  );
}
