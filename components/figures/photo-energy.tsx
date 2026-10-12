/**
 * The photoelectric effect and the work function.
 *
 * Left: a photon whose energy hf is smaller than the work function φ cannot free
 * an electron, however intense the light or however long it shines. Right: a
 * photon with hf greater than φ frees an electron, which leaves with the
 * leftover energy as kinetic energy, KE_max = hf − φ.
 */

import { ArrowHead, C, Frame, Line, T, wavePath } from "./kit";

const PH = "#f59e0b";
const EL = "#2563eb";

function metal(x: number) {
  return (
    <>
      <rect x={x} y={196} width={270} height={76} fill={C.tone} opacity={0.12} />
      <Line x1={x} y1={196} x2={x + 270} y2={196} stroke={C.rule} strokeWidth={1.5} />
    </>
  );
}

export function PhotoEnergy() {
  return (
    <Frame
      height={350}
      title="The photoelectric effect: a photon below the work function cannot free an electron, while a photon above it frees an electron with kinetic energy equal to the photon energy minus the work function"
    >
      <defs>
        <ArrowHead id="pho-ph" color={PH} />
        <ArrowHead id="pho-el" color={EL} />
      </defs>

      {/* ---------- below threshold ---------- */}
      {metal(50)}
      <path d={wavePath(96, 96, 168, 186, 7, 3)} fill="none" stroke={PH} strokeWidth={2.4} markerEnd="url(#pho-ph)" />
      <circle cx={185} cy={226} r={9} fill={EL} />
      <T x={185} y={226} size={11} weight={700} fill="#fff">
        e⁻
      </T>
      <T x={92} y={82} size={12} weight={600} fill={PH} anchor="start">
        hf &lt; φ
      </T>
      <T x={185} y={44} size={13} weight={700} fill={C.ink}>
        below threshold
      </T>
      <T x={185} y={298} size={12} fill={C.inkSoft}>
        no emission
      </T>

      {/* ---------- above threshold ---------- */}
      {metal(400)}
      <path d={wavePath(446, 96, 506, 186, 7, 3)} fill="none" stroke={PH} strokeWidth={2.4} markerEnd="url(#pho-ph)" />
      <Line x1={540} y1={188} x2={540} y2={160} stroke={EL} strokeWidth={2.4} markerEnd="url(#pho-el)" />
      <circle cx={540} cy={148} r={9} fill={EL} />
      <T x={540} y={148} size={11} weight={700} fill="#fff">
        e⁻
      </T>
      <T x={442} y={82} size={12} weight={600} fill={PH} anchor="start">
        hf &gt; φ
      </T>
      <T x={556} y={150} size={12} weight={600} fill={C.ink} anchor="start">
        KE = hf − φ
      </T>
      <T x={535} y={44} size={13} weight={700} fill={C.ink}>
        above threshold
      </T>
      <T x={535} y={298} size={12} fill={C.inkSoft}>
        electron escapes
      </T>

      {/* the balance */}
      <T x={360} y={330} size={15} weight={700} fill={C.ink}>
        hf = φ + KE
      </T>
    </Frame>
  );
}
