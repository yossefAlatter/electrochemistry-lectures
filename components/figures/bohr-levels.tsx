/**
 * Quantised energy levels and the emission spectrum.
 *
 * An atom's electrons can sit only at certain energy levels. When an electron
 * drops from a higher level to a lower one, the atom emits a single photon
 * whose energy equals the gap. Because the gaps are fixed, the emitted light
 * comes out at a few sharp wavelengths: an emission spectrum of lines, not a
 * continuous band.
 */

import { ArrowHead, C, Frame, Line, T, wavePath } from "./kit";

const E = { n1: 280, n2: 210, n3: 155, n4: 110 };

export function BohrLevels() {
  const lines = [
    { y: 120, color: "#a855f7" },
    { y: 150, color: "#3b82f6" },
    { y: 185, color: "#22c55e" },
    { y: 215, color: "#f59e0b" },
    { y: 245, color: "#ef4444" },
  ];

  return (
    <Frame
      height={360}
      title="Quantised energy levels: an electron falling from one level to a lower one emits a photon of energy equal to the gap, producing a spectrum of sharp lines rather than a continuous band"
    >
      <defs>
        <ArrowHead id="bohr-down" color="#e11d48" />
        <ArrowHead id="bohr-ph" color="#f59e0b" />
        <ArrowHead id="bohr-link" color={C.inkSoft} />
      </defs>

      <T x={225} y={84} size={13} weight={700} fill={C.ink}>
        quantised energy levels
      </T>

      {/* the levels */}
      {([
        ["n₁", E.n1],
        ["n₂", E.n2],
        ["n₃", E.n3],
        ["n₄", E.n4],
      ] as const).map(([label, y]) => (
        <g key={label}>
          <Line x1={70} y1={y} x2={380} y2={y} stroke={C.rule} strokeWidth={2} />
          <T x={60} y={y} size={12} weight={600} fill={C.ink} anchor="end">
            {label}
          </T>
        </g>
      ))}

      {/* one transition */}
      <Line x1={230} y1={E.n3 + 4} x2={230} y2={E.n2 - 4} stroke="#e11d48" strokeWidth={2.6} markerEnd="url(#bohr-down)" />
      <path d={wavePath(258, 182, 356, 182, 7, 3)} fill="none" stroke="#f59e0b" strokeWidth={2.4} markerEnd="url(#bohr-ph)" />
      <T x={250} y={166} size={11} fill="#f59e0b" anchor="start">
        photon hf = ΔE
      </T>

      {/* the emission spectrum */}
      <rect x={430} y={96} width={230} height={180} rx={6} fill="#111827" stroke={C.rule} strokeWidth={1.5} />
      {lines.map((l) => (
        <rect key={l.y} x={436} y={l.y} width={218} height={4} rx={2} fill={l.color} />
      ))}
      <Line x1={360} y1={182} x2={428} y2={182} stroke={C.inkSoft} strokeWidth={1.6} dash="4 4" markerEnd="url(#bohr-link)" />
      <T x={545} y={74} size={12} weight={700} fill={C.ink}>
        emission spectrum
      </T>
      <T x={545} y={294} size={11} fill={C.inkSoft}>
        sharp lines, not a continuous band
      </T>
      <T x={225} y={322} size={11} fill={C.inkSoft}>
        each transition gives one line
      </T>
      <T x={225} y={344} size={13} weight={600} fill={C.ink}>
        Eₙ = −13.6 / n² eV
      </T>
    </Frame>
  );
}
