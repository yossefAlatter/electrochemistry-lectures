/**
 * A de Broglie standing wave around a nucleus.
 *
 * An electron bound in an atom can be pictured as a wave going round the
 * nucleus. It must join up smoothly with itself, so the circumference has to
 * hold a whole number of wavelengths: 2πr = nλ. That condition is what makes
 * the orbits discrete, and with λ = h/p it ties the electron's momentum to its
 * orbit.
 */

import { C, Frame, T } from "./kit";

const CX = 360;
const CY = 158;

function ring(radius: number, amp: number, n: number): string {
  const steps = 260;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * 2 * Math.PI;
    const r = radius + amp * Math.cos(n * th);
    const x = CX + r * Math.cos(th);
    const y = CY + r * Math.sin(th);
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

export function DeBroglieStandingWave() {
  return (
    <Frame
      height={350}
      title="A de Broglie standing wave around a nucleus: the wave must close up into a whole number of wavelengths, so 2πr equals n times the wavelength, with the wavelength equal to Planck's constant divided by momentum"
    >
      <path d={ring(132, 10, 3)} fill="none" stroke="#2563eb" strokeWidth={2.4} opacity={0.9} />
      <path d={ring(82, 9, 1)} fill="none" stroke="#0d9488" strokeWidth={2.4} opacity={0.9} />
      <circle cx={CX} cy={CY} r={8} fill="#e11d48" />

      <T x={CX} y={58} size={12} weight={600} fill="#0d9488">
        n = 1
      </T>
      <T x={512} y={CY} size={12} weight={600} fill="#2563eb" anchor="start">
        n = 3
      </T>
      <T x={CX} y={176} size={10} fill={C.inkSoft}>
        nucleus
      </T>

      <T x={360} y={326} size={13} weight={600} fill={C.ink}>
        wave must close up: 2πr = nλ, with λ = h/p
      </T>
    </Frame>
  );
}
