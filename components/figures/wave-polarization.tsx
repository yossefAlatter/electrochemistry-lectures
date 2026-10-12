/**
 * Polarisation by a filter.
 *
 * Unpolarised light oscillates in every direction across the beam. A polarising
 * filter passes only the component of the electric field along its transmission
 * axis, so after the filter the light oscillates in a single plane. A second
 * filter at right angles to the first would block it completely.
 */

import { C, Frame, Line, T } from "./kit";

const AXIS = 170;

const ANGLES = [90, 22, 138, -40, 68];

function sampledPath(): string {
  let d = "";
  const x0 = 322;
  const x1 = 648;
  const n = 80;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + t * (x1 - x0);
    const y = AXIS - 42 * Math.sin((2 * Math.PI * (x - x0)) / 110);
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

export function WavePolarization() {
  return (
    <Frame
      height={320}
      title="Polarisation: unpolarised light oscillating in all directions passes through a filter that transmits only the vertical component, leaving light that oscillates in one plane"
    >
      {/* the beam axis */}
      <Line x1={60} y1={AXIS} x2={660} y2={AXIS} stroke={C.faint} strokeWidth={1.2} dash="6 6" />

      {/* unpolarised light: arrows at many orientations */}
      {ANGLES.map((a, i) => {
        const x = 90 + i * 40;
        const rad = (a * Math.PI) / 180;
        const dx = 34 * Math.cos(rad);
        const dy = 34 * Math.sin(rad);
        const color = ["#e11d48", "#2563eb", "#7c3aed", "#0d9488", "#f59e0b"][i % 5];
        return (
          <line
            key={i}
            x1={x - dx}
            y1={AXIS - dy}
            x2={x + dx}
            y2={AXIS + dy}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
      <T x={170} y={58} size={12} weight={600} fill={C.ink}>
        unpolarised light
      </T>
      <T x={170} y={78} size={11} fill={C.inkSoft}>
        all orientations
      </T>

      {/* the polarising filter */}
      <rect x={282} y={92} width={16} height={156} rx={3} fill={C.surface} stroke={C.rule} strokeWidth={1.5} />
      {[285, 288.5, 292, 295.5, 299, 302.5].map((x) => (
        <line key={x} x1={x} y1={94} x2={x} y2={246} stroke={C.rule} strokeWidth={1.4} />
      ))}
      <T x={290} y={272} size={12} weight={600} fill={C.ink}>
        polariser
      </T>
      <T x={290} y={288} size={10} fill={C.inkSoft}>
        vertical axis
      </T>

      {/* polarised light: a single vertical plane */}
      <path d={sampledPath()} fill="none" stroke="#2563eb" strokeWidth={2.6} strokeLinejoin="round" />
      <T x={490} y={58} size={12} weight={600} fill={C.ink}>
        polarised light
      </T>
      <T x={490} y={78} size={11} fill={C.inkSoft}>
        one plane only
      </T>
      <T x={490} y={300} size={11} fill={C.inkSoft}>
        only the vertical part gets through
      </T>
    </Frame>
  );
}
