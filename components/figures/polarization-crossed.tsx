/**
 * Crossed polarisers.
 *
 * The first filter turns unpolarised light into light oscillating in one plane.
 * A second filter whose axis is at right angles to the first transmits nothing:
 * the vibration it would pass has already been removed. This is the plainest
 * demonstration that polarisation restricts a transverse wave to a single
 * plane, and it is why glare-reducing sunglasses are built the way they are.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const AXIS = 170;

const UNPOL = [
  { x: 95, a: 90, c: "#e11d48" },
  { x: 128, a: 28, c: "#2563eb" },
  { x: 161, a: 142, c: "#7c3aed" },
  { x: 194, a: -42, c: "#0d9488" },
];

export function PolarizationCrossed() {
  return (
    <Frame
      height={320}
      title="Crossed polarisers: unpolarised light becomes vertically polarised after the first filter, and a second filter at right angles blocks it completely"
    >
      <defs>
        <ArrowHead id="pc-travel" color={C.ink} />
      </defs>

      <T x={360} y={32} size={13} weight={600} fill={C.ink}>
        crossed polarisers
      </T>

      {/* the beam axis */}
      <Line x1={60} y1={AXIS} x2={660} y2={AXIS} stroke={C.faint} strokeWidth={1.2} dash="6 6" />

      {/* unpolarised light: arrows at many orientations */}
      {UNPOL.map((u) => {
        const rad = (u.a * Math.PI) / 180;
        const dx = 30 * Math.cos(rad);
        const dy = 30 * Math.sin(rad);
        return (
          <line
            key={u.x}
            x1={u.x - dx}
            y1={AXIS - dy}
            x2={u.x + dx}
            y2={AXIS + dy}
            stroke={u.c}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
      <T x={130} y={64} size={12} weight={600} fill={C.ink}>
        unpolarised
      </T>
      <T x={130} y={82} size={11} fill={C.inkSoft}>
        all orientations
      </T>

      {/* first polariser: vertical transmission axis */}
      <rect x={217} y={105} width={16} height={130} rx={3} fill={C.surface} stroke={C.rule} strokeWidth={1.5} />
      {[220, 224, 228, 232].map((x) => (
        <line key={x} x1={x} y1={108} x2={x} y2={232} stroke={C.rule} strokeWidth={1.4} />
      ))}
      <T x={225} y={258} size={11} weight={600} fill={C.ink}>
        polariser 1
      </T>
      <T x={225} y={274} size={10} fill={C.inkSoft}>
        axis vertical
      </T>

      {/* polarised light: a single vertical plane */}
      {[285, 330, 375].map((x) => (
        <line key={x} x1={x} y1={140} x2={x} y2={200} stroke="#2563eb" strokeWidth={2.4} strokeLinecap="round" />
      ))}
      <T x={330} y={64} size={12} weight={600} fill={C.ink}>
        polarised
      </T>
      <T x={330} y={82} size={11} fill={C.inkSoft}>
        one plane only
      </T>

      {/* second polariser: horizontal transmission axis, crossed with the first */}
      <rect x={462} y={105} width={16} height={130} rx={3} fill={C.surface} stroke={C.rule} strokeWidth={1.5} />
      {[125, 145, 165, 185, 205, 225].map((y) => (
        <line key={y} x1={465} y1={y} x2={475} y2={y} stroke={C.rule} strokeWidth={1.4} />
      ))}
      <T x={470} y={258} size={11} weight={600} fill={C.ink}>
        polariser 2
      </T>
      <T x={470} y={274} size={10} fill={C.inkSoft}>
        axis horizontal
      </T>

      {/* nothing gets through */}
      <line x1={500} y1={160} x2={516} y2={180} stroke="#e11d48" strokeWidth={2.6} strokeLinecap="round" />
      <line x1={516} y1={160} x2={500} y2={180} stroke="#e11d48" strokeWidth={2.6} strokeLinecap="round" />
      <T x={575} y={64} size={12} weight={600} fill={C.ink}>
        blocked
      </T>
      <T x={575} y={82} size={11} fill={C.inkSoft}>
        no light
      </T>
      <T x={575} y={230} size={11} fill={C.inkSoft}>
        the vertical vibration is removed
      </T>

      <Line x1={60} y1={300} x2={660} y2={300} stroke={C.faint} strokeWidth={1.4} dash="6 6" markerEnd="pc-travel" />
      <T x={360} y={314} size={11} fill={C.inkSoft}>
        direction of travel
      </T>
    </Frame>
  );
}
