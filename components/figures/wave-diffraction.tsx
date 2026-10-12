/**
 * Diffraction and interference.
 *
 * Left: a plane wave passes through a single narrow slit and spreads out into
 * circular wavefronts. Right: with two slits the two sets of circular waves
 * overlap. Where crests meet crests the waves add (bright), and where a crest
 * meets a trough they cancel (dark), giving the bright and dark fringes seen on
 * a screen.
 */

import { C, Frame, Line, T } from "./kit";

function half(cx: number, cy: number, r: number): string {
  const x = 0.1736 * r;
  const y = 0.9848 * r;
  return `M ${(cx + x).toFixed(1)} ${(cy - y).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}`;
}

export function WaveDiffraction() {
  return (
    <Frame
      height={340}
      title="Diffraction and interference: a plane wave spreading out after a single slit, and two overlapping sets of circular waves from a double slit forming bright and dark fringes on a screen"
    >
      {/* panel divider */}
      <Line x1={360} y1={34} x2={360} y2={306} stroke={C.faint} strokeWidth={1} dash="5 6" />

      {/* ---------- single slit ---------- */}
      {[46, 76, 106, 136].map((x) => (
        <line key={x} x1={x} y1={64} x2={x} y2={276} stroke="#7c3aed" strokeWidth={2} opacity={0.5} />
      ))}
      <rect x={176} y={58} width={8} height={90} fill={C.ink} opacity={0.75} />
      <rect x={176} y={192} width={8} height={90} fill={C.ink} opacity={0.75} />
      {[34, 60, 86, 112].map((r) => (
        <path key={r} d={half(180, 170, r)} fill="none" stroke="#7c3aed" strokeWidth={1.6} opacity={0.75} />
      ))}
      <T x={108} y={40} size={12} weight={600} fill={C.ink}>
        single slit
      </T>
      <T x={300} y={110} size={11} fill={C.inkSoft}>
        spreads out
      </T>

      {/* ---------- double slit ---------- */}
      {[398, 428, 458, 488].map((x) => (
        <line key={x} x1={x} y1={64} x2={x} y2={276} stroke="#7c3aed" strokeWidth={2} opacity={0.5} />
      ))}
      <rect x={520} y={58} width={8} height={84} fill={C.ink} opacity={0.75} />
      <rect x={520} y={160} width={8} height={22} fill={C.ink} opacity={0.75} />
      <rect x={520} y={200} width={8} height={82} fill={C.ink} opacity={0.75} />
      {[28, 56, 84].map((r) => (
        <path key={`a${r}`} d={half(524, 151, r)} fill="none" stroke="#2563eb" strokeWidth={1.6} opacity={0.7} />
      ))}
      {[28, 56, 84].map((r) => (
        <path key={`b${r}`} d={half(524, 191, r)} fill="none" stroke="#0d9488" strokeWidth={1.6} opacity={0.7} />
      ))}
      <T x={452} y={40} size={12} weight={600} fill={C.ink}>
        double slit
      </T>

      {/* the screen with fringes */}
      <rect x={676} y={54} width={12} height={232} rx={3} fill={C.surface} stroke={C.rule} strokeWidth={1.5} />
      {[
        { y: 91, o: 0.3 },
        { y: 131, o: 0.6 },
        { y: 171, o: 1 },
        { y: 211, o: 0.6 },
        { y: 251, o: 0.3 },
      ].map((f) => (
        <rect key={f.y} x={676} y={f.y - 4} width={12} height={8} fill="#f59e0b" opacity={f.o} />
      ))}
      <T x={640} y={304} size={11} fill={C.inkSoft} anchor="middle">
        bright and dark fringes
      </T>
    </Frame>
  );
}
