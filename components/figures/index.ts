/**
 * The figure registry.
 *
 * Content refers to a figure by the file name it used to have, e.g.
 * `fund_two_worlds.png`. If a name is registered here the page draws the SVG
 * component instead of loading the PNG; if it is not, the PNG is used. That
 * means figures can be converted one at a time, and nothing breaks in the
 * meantime, which is the only sane way to replace twenty-six diagrams.
 *
 * The PNGs stay in public/figures until their entry is removed from here, at
 * which point they are dead weight in the precache and can be deleted.
 */

import type { ComponentType } from "react";
import { PnJunction } from "./pn-junction";
import { EmWave } from "./em-wave";
import { EmSpectrum } from "./em-spectrum";
import { PhotonEnergy } from "./photon-energy";
import { WaveReflectionRefraction } from "./wave-reflection-refraction";
import { WaveDiffraction } from "./wave-diffraction";
import { WavePolarization } from "./wave-polarization";
import { WaveLongitudinal } from "./wave-longitudinal";
import { WaveTransverse } from "./wave-transverse";
import { PolarizationCrossed } from "./polarization-crossed";
import { PhotoEnergy } from "./photo-energy";
import { PhotoStopping } from "./photo-stopping";
import { LightAbsorptionEmission } from "./light-absorption-emission";
import { LightScattering } from "./light-scattering";
import { DeBroglieStandingWave } from "./de-broglie-standing-wave";
import { BohrLevels } from "./bohr-levels";
import { DualityDoubleSlit } from "./duality-double-slit";
import { EmDiscoveryTimeline } from "./em-discovery-timeline";

/** Every registered figure draws itself; none takes props. */
export type FigureComponent = ComponentType;

export const FIGURES: Record<string, FigureComponent> = {
  "pn_junction.png": PnJunction,
  "em_wave.png": EmWave,
  "em_spectrum.png": EmSpectrum,
  "photon_energy.png": PhotonEnergy,
  "wave_reflection_refraction.png": WaveReflectionRefraction,
  "wave_diffraction.png": WaveDiffraction,
  "wave_polarization.png": WavePolarization,
  "wave_longitudinal.png": WaveLongitudinal,
  "wave_transverse.png": WaveTransverse,
  "polarization_crossed.png": PolarizationCrossed,
  "photo_energy.png": PhotoEnergy,
  "photo_stopping.png": PhotoStopping,
  "light_absorption_emission.png": LightAbsorptionEmission,
  "light_scattering.png": LightScattering,
  "de_broglie_wave.png": DeBroglieStandingWave,
  "bohr_levels.png": BohrLevels,
  "duality_double_slit.png": DualityDoubleSlit,
  "em_discovery_timeline.png": EmDiscoveryTimeline,
};

/** The SVG component for a figure file name, or null to fall back to the PNG. */
export function figureFor(src: string): FigureComponent | null {
  return FIGURES[src] ?? null;
}
