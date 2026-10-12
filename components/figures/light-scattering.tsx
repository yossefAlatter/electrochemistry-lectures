/**
 * Scattering: elastic (Rayleigh) and inelastic (Raman).
 *
 * In Rayleigh scattering the molecule absorbs and re-emits a photon of the same
 * energy, so the light keeps its colour. In Raman scattering a little energy is
 * exchanged with the molecule, so the scattered photon has a slightly different
 * energy: the light shifts colour by an amount set by a molecular vibration.
 */

import { ArrowHead, C, Frame, T, wavePath } from "./kit";

function molecule(cx: number, cy: number) {
  return (
    <>
      <circle cx={cx} cy={cy} r={17} fill="#7c3aed" opacity={0.25} />
      <circle cx={cx} cy={cy} r={17} fill="none" stroke="#7c3aed" strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={5} fill="#7c3aed" />
    </>
  );
}

export function LightScattering() {
  return (
    <Frame
      height={300}
      title="Scattering: Rayleigh scattering re-emits light of the same energy and colour, while Raman scattering shifts the photon energy by an amount set by a molecular vibration"
    >
      <defs>
        <ArrowHead id="lsc-photon" color="#0ea5e9" />
        <ArrowHead id="lsc-shift" color="#e11d48" />
      </defs>

      {/* Rayleigh */}
      {molecule(190, 175)}
      <path d={wavePath(54, 175, 156, 175, 7, 3)} fill="none" stroke="#0ea5e9" strokeWidth={2.4} markerEnd="url(#lsc-photon)" />
      <path d={wavePath(214, 175, 300, 108, 6, 3)} fill="none" stroke="#0ea5e9" strokeWidth={2.2} />
      <path d={wavePath(214, 175, 312, 175, 7, 3)} fill="none" stroke="#0ea5e9" strokeWidth={2.2} />
      <path d={wavePath(214, 175, 300, 242, 6, 3)} fill="none" stroke="#0ea5e9" strokeWidth={2.2} />
      <T x={190} y={44} size={13} weight={700} fill={C.ink}>
        Rayleigh: elastic
      </T>
      <T x={190} y={66} size={11} fill={C.inkSoft}>
        same energy, same colour
      </T>

      {/* Raman */}
      {molecule(530, 175)}
      <path d={wavePath(394, 175, 496, 175, 7, 3)} fill="none" stroke="#0ea5e9" strokeWidth={2.4} markerEnd="url(#lsc-photon)" />
      <path d={wavePath(554, 175, 648, 130, 7, 3)} fill="none" stroke="#e11d48" strokeWidth={2.4} markerEnd="url(#lsc-shift)" />
      <T x={530} y={44} size={13} weight={700} fill={C.ink}>
        Raman: inelastic
      </T>
      <T x={530} y={66} size={11} fill={C.inkSoft}>
        energy shifted by a vibration
      </T>
      <T x={600} y={112} size={11} fill="#e11d48" anchor="start">
        shifted
      </T>
    </Frame>
  );
}
