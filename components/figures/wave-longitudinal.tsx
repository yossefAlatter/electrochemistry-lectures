/**
 * A longitudinal wave.
 *
 * The particles of the medium vibrate back and forth along the direction the
 * wave travels. Where they crowd together the medium is compressed; where they
 * spread apart it is rarefied. Sound in air is the everyday example. Because
 * the vibration is parallel to the travel, there is no sideways plane to
 * select, so a longitudinal wave cannot be polarised.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const AXIS = 130; // vertical centre of the row of particles
const X0 = 70;
const X1 = 650;
const N = 46;
const AMP = 30; // displacement from an evenly spaced row
const CYCLES = 2;
const MID = Math.round((N - 1) / 2);

/** Uniform spacing with a sinusoidal compression/rarefaction pattern on top. */
function particleX(i: number): number {
  const u = i / (N - 1);
  return X0 + (X1 - X0) * u - AMP * Math.sin(2 * Math.PI * CYCLES * u);
}

export function WaveLongitudinal() {
  const xm = particleX(MID);

  return (
    <Frame
      height={305}
      title="A longitudinal wave: the particles of the medium vibrate back and forth along the direction of travel, bunching into compressions and spreading into rarefactions"
    >
      <defs>
        <ArrowHead id="wl-travel" color={C.ink} />
        <ArrowHead id="wl-vib" color="#e11d48" />
      </defs>

      {/* the row of particles, denser at the compressions */}
      {Array.from({ length: N }, (_, i) => {
        const x = particleX(i);
        return (
          <Line key={i} x1={x} y1={AXIS - 34} x2={x} y2={AXIS + 34} stroke="#2563eb" strokeWidth={2} />
        );
      })}

      {/* one particle, highlighted, with its back-and-forth vibration */}
      <Line x1={xm} y1={AXIS - 34} x2={xm} y2={AXIS + 34} stroke="#e11d48" strokeWidth={3} />
      <Line x1={xm - 22} y1={AXIS} x2={xm + 22} y2={AXIS} stroke="#e11d48" strokeWidth={2} markerStart="wl-vib" markerEnd="wl-vib" />
      <T x={xm} y={AXIS + 58} size={11} fill={C.inkSoft}>
        vibration is parallel to travel
      </T>

      {/* the two features of a longitudinal wave */}
      <T x={360} y={58} size={12} weight={600} fill={C.ink}>
        compression
      </T>
      <Line x1={360} y1={66} x2={360} y2={92} stroke={C.inkSoft} strokeWidth={1} dash="3 3" />
      <T x={215} y={58} size={12} weight={600} fill={C.ink}>
        rarefaction
      </T>
      <Line x1={215} y1={66} x2={215} y2={92} stroke={C.inkSoft} strokeWidth={1} dash="3 3" />

      {/* the direction of travel */}
      <Line x1={X0} y1={250} x2={X1} y2={250} stroke={C.faint} strokeWidth={1.4} dash="6 6" markerEnd="wl-travel" />
      <T x={360} y={278} size={12} weight={600} fill={C.ink}>
        direction of travel
      </T>

      <T x={360} y={296} size={11} fill={C.inkSoft}>
        no sideways plane, so it cannot be polarised
      </T>
    </Frame>
  );
}
