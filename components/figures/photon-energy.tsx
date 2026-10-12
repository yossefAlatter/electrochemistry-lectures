/**
 * Photon energy against frequency.
 *
 * A photon's energy is E = hf, so the graph of energy against frequency is a
 * straight line through the origin whose slope is the Planck constant h. Two
 * examples are marked to show the simple rule: double the frequency, double the
 * energy. The line is steep only because h is small on everyday scales.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const OX = 120;
const OY = 250;

export function PhotonEnergy() {
  const slope = 0.314;
  const xf = 340;
  const yf = OY - slope * (xf - OX);
  const x2f = 560;
  const y2f = OY - slope * (x2f - OX);

  return (
    <Frame
      height={300}
      title="A graph of photon energy against frequency: a straight line through the origin with slope equal to the Planck constant, so energy is proportional to frequency"
    >
      <defs>
        <ArrowHead id="pe-axis" color={C.ink} />
      </defs>

      {/* axes */}
      <Line x1={OX} y1={OY} x2={96} y2={OY} stroke={C.rule} strokeWidth={1.5} />
      <Line
        x1={OX}
        y1={OY}
        x2={OX}
        y2={68}
        stroke={C.rule}
        strokeWidth={1.5}
        markerEnd="url(#pe-axis)"
      />
      <Line
        x1={OX}
        y1={OY}
        x2={666}
        y2={OY}
        stroke={C.rule}
        strokeWidth={1.5}
        markerEnd="url(#pe-axis)"
      />

      {/* the line E = hf */}
      <Line x1={OX} y1={OY} x2={620} y2={OY - slope * (620 - OX)} stroke="#e11d48" strokeWidth={3} />

      {/* guide lines for f and 2f */}
      <Line x1={xf} y1={yf} x2={xf} y2={OY} stroke={C.faint} strokeWidth={1} dash="4 4" />
      <Line x1={OX} y1={yf} x2={xf} y2={yf} stroke={C.faint} strokeWidth={1} dash="4 4" />
      <Line x1={x2f} y1={y2f} x2={x2f} y2={OY} stroke={C.faint} strokeWidth={1} dash="4 4" />
      <Line x1={OX} y1={y2f} x2={x2f} y2={y2f} stroke={C.faint} strokeWidth={1} dash="4 4" />

      <circle cx={xf} cy={yf} r={4} fill="#e11d48" />
      <circle cx={x2f} cy={y2f} r={4} fill="#e11d48" />

      {/* axis ticks */}
      <T x={xf} y={OY + 20} size={12} fill={C.inkSoft}>
        f
      </T>
      <T x={x2f} y={OY + 20} size={12} fill={C.inkSoft}>
        2f
      </T>
      <T x={108} y={yf} size={12} fill={C.inkSoft} anchor="end">
        E
      </T>
      <T x={108} y={y2f} size={12} fill={C.inkSoft} anchor="end">
        2E
      </T>

      {/* axis names */}
      <T x={430} y={OY + 42} size={13} weight={600} fill={C.ink}>
        frequency f
      </T>
      <T x={OX - 8} y={60} size={13} weight={600} fill={C.ink} anchor="end">
        photon energy E
      </T>

      {/* slope annotation */}
      <T x={470} y={132} size={12} fill={C.inkSoft} anchor="start">
        slope = h
      </T>
      <T x={620} y={210} size={17} weight={700} fill={C.ink} anchor="end">
        E = hf
      </T>
    </Frame>
  );
}
