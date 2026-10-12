/**
 * Stopping potential against frequency.
 *
 * For each frequency of light, the stopping potential V₀ is the reverse voltage
 * just large enough to stop the fastest electrons. A plot of V₀ against the
 * frequency f is a straight line. Its slope is h/e, and it crosses the axis at
 * the threshold frequency f₀, where hf₀ is the work function φ. Below f₀ no
 * electrons are emitted at all.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const OX = 120;
const OY = 250;

export function PhotoStopping() {
  const slope = 0.432;
  const x0 = 250;
  const lineY = (x: number) => OY - slope * (x - x0);

  return (
    <Frame
      height={320}
      title="Stopping potential against frequency: a straight line of slope h over e that crosses the axis at the threshold frequency f-zero, below which no electrons are emitted"
    >
      <defs>
        <ArrowHead id="phs-axis" color={C.ink} />
      </defs>

      {/* axes */}
      <Line
        x1={OX}
        y1={OY}
        x2={OX}
        y2={64}
        stroke={C.rule}
        strokeWidth={1.5}
        markerEnd="url(#phs-axis)"
      />
      <Line
        x1={OX}
        y1={OY}
        x2={666}
        y2={OY}
        stroke={C.rule}
        strokeWidth={1.5}
        markerEnd="url(#phs-axis)"
      />

      {/* the line */}
      <Line x1={x0} y1={OY} x2={620} y2={lineY(620)} stroke="#e11d48" strokeWidth={3} />

      {/* threshold marker */}
      <circle cx={x0} cy={OY} r={4.5} fill="#e11d48" />
      <T x={x0} y={OY + 22} size={12} weight={600} fill="#e11d48">
        f₀
      </T>

      {/* slope annotation */}
      <T x={486} y={138} size={12} fill={C.inkSoft} anchor="start">
        slope = h/e
      </T>

      {/* axis labels */}
      <T x={410} y={OY + 42} size={13} weight={600} fill={C.ink}>
        frequency f
      </T>
      <T x={112} y={86} size={14} weight={600} fill={C.ink} anchor="end">
        V₀
      </T>
      <T x={132} y={56} size={12} fill={C.inkSoft} anchor="start">
        stopping potential
      </T>

      {/* the balance */}
      <T x={620} y={218} size={17} weight={700} fill={C.ink} anchor="end">
        eV₀ = hf − φ
      </T>
    </Frame>
  );
}
