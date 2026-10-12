/**
 * Absorption and emission as electron transitions.
 *
 * An atom has discrete energy levels. In absorption, a photon with exactly the
 * right energy lifts an electron to a higher level. In emission, the electron
 * falls back down and a photon of the same energy is given out. Because the
 * level gaps are fixed, only certain photon energies are exchanged: hence the
 * sharp lines of a spectrum, not a continuous band.
 */

import { ArrowHead, C, Frame, Line, T, wavePath } from "./kit";

const PH = "#f59e0b";
const EL = "#2563eb";
const UP = "#2563eb";
const DOWN = "#e11d48";

const E1 = 272;
const E2 = 176;
const E3 = 88;

export function LightAbsorptionEmission() {
  return (
    <Frame
      height={340}
      title="Absorption and emission: a photon lifts an electron to a higher energy level, and when the electron falls back the atom emits a photon of the same energy, giving sharp spectral lines"
    >
      <defs>
        <ArrowHead id="lae-ph" color={PH} />
        <ArrowHead id="lae-up" color={UP} />
        <ArrowHead id="lae-down" color={DOWN} />
      </defs>

      {/* level labels */}
      <T x={58} y={E3} size={13} weight={600} fill={C.ink} anchor="end">
        E₃
      </T>
      <T x={58} y={E2} size={13} weight={600} fill={C.ink} anchor="end">
        E₂
      </T>
      <T x={58} y={E1} size={13} weight={600} fill={C.ink} anchor="end">
        E₁
      </T>

      {/* ---------- absorption ---------- */}
      {[E1, E2, E3].map((y) => (
        <Line key={`a${y}`} x1={64} y1={y} x2={316} y2={y} stroke={C.rule} strokeWidth={2} />
      ))}
      <path d={wavePath(96, E1, 172, E1, 7, 3)} fill="none" stroke={PH} strokeWidth={2.4} markerEnd="url(#lae-ph)" />
      <Line x1={200} y1={E1} x2={200} y2={E2 + 4} stroke={UP} strokeWidth={2.6} markerEnd="url(#lae-up)" />
      <circle cx={200} cy={E2} r={6} fill={EL} />
      <T x={190} y={44} size={13} weight={700} fill={C.ink}>
        absorption
      </T>
      <T x={96} y={E1 - 20} size={12} fill={PH} anchor="start">
        photon in: hf = ΔE
      </T>
      <T x={216} y={E2 - 16} size={11} fill={C.inkSoft} anchor="start">
        electron jumps up
      </T>

      {/* ---------- emission ---------- */}
      {[E1, E2, E3].map((y) => (
        <Line key={`e${y}`} x1={404} y1={y} x2={656} y2={y} stroke={C.rule} strokeWidth={2} />
      ))}
      <circle cx={530} cy={E3} r={6} fill={EL} />
      <Line x1={530} y1={E3 + 4} x2={530} y2={E2 - 4} stroke={DOWN} strokeWidth={2.6} markerEnd="url(#lae-down)" />
      <circle cx={530} cy={E2} r={6} fill={EL} />
      <path d={wavePath(560, 128, 636, 166, 7, 3)} fill="none" stroke={PH} strokeWidth={2.4} markerEnd="url(#lae-ph)" />
      <T x={530} y={44} size={13} weight={700} fill={C.ink}>
        emission
      </T>
      <T x={556} y={114} size={12} fill={PH} anchor="start">
        photon out: hf = ΔE
      </T>
      <T x={546} y={E2 + 20} size={11} fill={C.inkSoft} anchor="start">
        electron falls down
      </T>

      <T x={360} y={322} size={15} weight={700} fill={C.ink}>
        ΔE = hf
      </T>
    </Frame>
  );
}
