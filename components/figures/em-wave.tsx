/**
 * An electromagnetic wave, drawn as two perpendicular sines.
 *
 * The electric field E oscillates in the vertical plane; the magnetic field B
 * oscillates in the horizontal plane, drawn going back into the page. Both are
 * at right angles to the propagation axis, and the whole pattern of oscillation
 * travels forward at the speed of light c. That is the sense in which the wave
 * "propagates": the fields oscillate in place, and the pattern they form moves.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const X0 = 92;
const X1 = 640;
const AXIS = 208;
const AMP_E = 74;
const AMP_B = 54;
const CYCLES = 2.2;
const DEPTH_X = 0.92;
const DEPTH_Y = 0.4;
const N = 96;

const E_COLOR = "#e11d48";
const B_COLOR = "#2563eb";

interface Sample {
  baseX: number;
  tipX: number;
  tipY: number;
}

function sample(amp: number, depth: boolean): Sample[] {
  const out: Sample[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const baseX = X0 + t * (X1 - X0);
    const s = Math.sin(2 * Math.PI * CYCLES * t);
    const tipX = depth ? baseX + amp * s * DEPTH_X : baseX;
    const tipY = depth ? AXIS - amp * s * DEPTH_Y : AXIS - amp * s;
    out.push({ baseX, tipX, tipY });
  }
  return out;
}

function curve(pts: Sample[]): string {
  return pts
    .map((p, i) => `${i ? "L" : "M"} ${p.tipX.toFixed(1)} ${p.tipY.toFixed(1)}`)
    .join(" ");
}

/** Screen x of the crest whose phase is `phase` cycles (0.25, 1.25, …). */
function crestX(phase: number): number {
  return X0 + (phase / CYCLES) * (X1 - X0);
}

export function EmWave() {
  const e = sample(AMP_E, false);
  const b = sample(AMP_B, true);
  // One field vector every third sample: enough to read as a rib cage without
  // burying the curves.
  const eRibs = e.filter((_, i) => i % 3 === 0);
  const bRibs = b.filter((_, i) => i % 3 === 0);

  const c1 = crestX(0.25);
  const c2 = crestX(1.25);

  return (
    <Frame
      height={360}
      title="An electromagnetic wave: the electric field E and magnetic field B oscillate at right angles to each other and to the direction of travel, and the pattern propagates at the speed of light c"
    >
      <defs>
        <ArrowHead id="emw-axis" color={C.ink} />
        <ArrowHead id="emw-span" color={C.inkSoft} />
        <ArrowHead id="emw-amp" color={E_COLOR} />
      </defs>

      {/* the field vectors at each sample, faint */}
      {eRibs.map((p, i) => (
        <line
          key={`er-${i}`}
          x1={p.baseX}
          y1={AXIS}
          x2={p.tipX}
          y2={p.tipY}
          stroke={E_COLOR}
          strokeWidth={1}
          opacity={0.16}
        />
      ))}
      {bRibs.map((p, i) => (
        <line
          key={`br-${i}`}
          x1={p.baseX}
          y1={AXIS}
          x2={p.tipX}
          y2={p.tipY}
          stroke={B_COLOR}
          strokeWidth={1}
          opacity={0.16}
        />
      ))}

      {/* the propagation axis */}
      <Line
        x1={X0 - 26}
        y1={AXIS}
        x2={X1 + 22}
        y2={AXIS}
        stroke={C.rule}
        strokeWidth={1.5}
      />

      {/* E and B as curves */}
      <path
        d={curve(e)}
        fill="none"
        stroke={E_COLOR}
        strokeWidth={2.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={curve(b)}
        fill="none"
        stroke={B_COLOR}
        strokeWidth={2.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* field labels */}
      <T x={c1} y={AXIS - AMP_E - 16} size={16} weight={700} fill={E_COLOR}>
        E
      </T>
      <T
        x={c1 + AMP_B * DEPTH_X + 22}
        y={AXIS - AMP_B * DEPTH_Y + 4}
        size={16}
        weight={700}
        fill={B_COLOR}
      >
        B
      </T>

      {/* amplitude, at the first crest */}
      <Line
        x1={c1}
        y1={AXIS}
        x2={c1}
        y2={AXIS - AMP_E}
        stroke={E_COLOR}
        strokeWidth={1.4}
        markerStart="url(#emw-amp)"
        markerEnd="url(#emw-amp)"
      />
      <T
        x={c1 + 10}
        y={(AXIS + AXIS - AMP_E) / 2}
        size={11}
        fill={C.inkSoft}
        anchor="start"
      >
        amplitude
      </T>

      {/* wavelength between two crests */}
      <Line
        x1={c1}
        y1={AXIS - AMP_E - 50}
        x2={c2}
        y2={AXIS - AMP_E - 50}
        stroke={C.inkSoft}
        strokeWidth={1.4}
        markerStart="url(#emw-span)"
        markerEnd="url(#emw-span)"
      />
      <T
        x={(c1 + c2) / 2}
        y={AXIS - AMP_E - 60}
        size={13}
        weight={600}
        fill={C.ink}
      >
        λ
      </T>

      {/* the direction of travel */}
      <Line
        x1={X0}
        y1={306}
        x2={X1}
        y2={306}
        stroke={C.ink}
        strokeWidth={2}
        markerEnd="url(#emw-axis)"
      />
      <T
        x={(X0 + X1) / 2}
        y={330}
        size={13}
        weight={600}
        fill={C.ink}
      >
        propagation at the speed of light c
      </T>
    </Frame>
  );
}
