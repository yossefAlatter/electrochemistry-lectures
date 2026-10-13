/**
 * A transverse wave.
 *
 * The particles vibrate at right angles to the direction the wave travels, so
 * the medium rises into crests and falls into troughs. A wave on a rope and
 * light are the examples. Because the vibration lies in a plane across the
 * beam, a transverse wave can be polarised.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const X0 = 70;
const X1 = 650;
const CY = 150;
const AMP = 55;
const LAM = 193;

function waveY(x: number): number {
  return CY - AMP * Math.sin((2 * Math.PI * (x - X0)) / LAM);
}

function curvePath(): string {
  let d = "";
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const x = X0 + ((X1 - X0) * i) / n;
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${waveY(x).toFixed(1)} `;
  }
  return d.trim();
}

export function WaveTransverse() {
  const xCrest = X0 + LAM / 4;
  const xTrough = X0 + (3 * LAM) / 4;

  return (
    <Frame
      height={300}
      title="A transverse wave: the particles vibrate at right angles to the direction of travel, forming crests above the axis and troughs below it"
    >
      <defs>
        <ArrowHead id="wt-travel" color={C.ink} />
        <ArrowHead id="wt-vib" color="#e11d48" />
      </defs>

      <T x={360} y={38} size={13} weight={600} fill={C.ink}>
        transverse wave
      </T>

      {/* the equilibrium line and the direction of travel */}
      <Line x1={X0} y1={CY} x2={X1} y2={CY} stroke={C.faint} strokeWidth={1.4} dash="6 6" markerEnd="wt-travel" />

      {/* the wave itself */}
      <path d={curvePath()} fill="none" stroke="#2563eb" strokeWidth={2.6} strokeLinejoin="round" />

      {/* one particle and its perpendicular vibration */}
      <Line x1={xCrest} y1={CY} x2={xCrest} y2={CY - AMP} stroke="#e11d48" strokeWidth={2} markerEnd="wt-vib" />
      <circle cx={xCrest} cy={CY} r={3.5} fill="#e11d48" />
      <T x={xCrest} y={190} size={11} fill={C.inkSoft}>
        vibration ⟂ travel
      </T>

      {/* the two features of a transverse wave */}
      <T x={xCrest} y={64} size={12} weight={600} fill={C.ink}>
        crest
      </T>
      <Line x1={xCrest} y1={72} x2={xCrest} y2={CY - AMP - 4} stroke={C.inkSoft} strokeWidth={1} dash="3 3" />
      <T x={xTrough} y={252} size={12} weight={600} fill={C.ink}>
        trough
      </T>
      <Line x1={xTrough} y1={244} x2={xTrough} y2={CY + AMP + 4} stroke={C.inkSoft} strokeWidth={1} dash="3 3" />

      <T x={360} y={280} size={12} weight={600} fill={C.ink}>
        direction of travel
      </T>
    </Frame>
  );
}
