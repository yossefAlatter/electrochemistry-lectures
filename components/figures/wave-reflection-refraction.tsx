/**
 * Reflection and refraction at a boundary.
 *
 * A ray meets the boundary between two media at the point O. The dashed line is
 * the normal. The reflected ray leaves at the same angle as the incident ray
 * (θ₁ = θ₁′). The refracted ray bends towards the normal when it enters the
 * denser medium, and the angles obey n₁ sin θ₁ = n₂ sin θ₂.
 */

import { ArrowHead, C, Frame, Line, T } from "./kit";

const OX = 330;
const OY = 190;

const TH1 = 55;
const TH2 = 37.5;

function pt(r: number, aDeg: number): [number, number] {
  const a = (aDeg * Math.PI) / 180;
  return [OX + r * Math.sin(a), OY - r * Math.cos(a)];
}

function arcPath(r: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function rayEnd(L: number, aDeg: number): [number, number] {
  return pt(L, aDeg);
}

export function WaveReflectionRefraction() {
  const incColor = "#f59e0b";
  const refColor = "#22c55e";
  const refrColor = "#2563eb";

  const [ix, iy] = rayEnd(195, -TH1);
  const [rx, ry] = rayEnd(195, TH1);
  const [fx, fy] = rayEnd(165, 180 - TH2);

  const [l1x, l1y] = pt(78, -TH1 / 2);
  const [l2x, l2y] = pt(78, TH1 / 2);
  const [l3x, l3y] = pt(78, 180 - TH2 / 2);

  return (
    <Frame
      height={330}
      title="A ray hitting a boundary between two media: the angle of reflection equals the angle of incidence, and the refracted ray bends towards the normal in the denser medium"
    >
      <defs>
        <ArrowHead id="wrr-inc" color={incColor} />
        <ArrowHead id="wrr-ref" color={refColor} />
        <ArrowHead id="wrr-refr" color={refrColor} />
      </defs>

      {/* the two media */}
      <rect x={40} y={OY} width={640} height={140} fill={C.tone} opacity={0.07} />
      <Line x1={40} y1={OY} x2={680} y2={OY} stroke={C.rule} strokeWidth={1.5} />

      {/* the normal */}
      <Line x1={OX} y1={52} x2={OX} y2={322} stroke={C.faint} strokeWidth={1.2} dash="5 5" />
      <T x={OX} y={44} size={12} fill={C.inkSoft}>
        normal
      </T>

      {/* the rays */}
      <Line x1={ix} y1={iy} x2={OX} y2={OY} stroke={incColor} strokeWidth={2.4} markerEnd="url(#wrr-inc)" />
      <Line x1={OX} y1={OY} x2={rx} y2={ry} stroke={refColor} strokeWidth={2.4} markerEnd="url(#wrr-ref)" />
      <Line x1={OX} y1={OY} x2={fx} y2={fy} stroke={refrColor} strokeWidth={2.4} markerEnd="url(#wrr-refr)" />
      <circle cx={OX} cy={OY} r={4} fill={C.ink} />

      {/* the angle arcs */}
      <path d={arcPath(58, 0, -TH1)} fill="none" stroke={incColor} strokeWidth={1.6} />
      <path d={arcPath(58, 0, TH1)} fill="none" stroke={refColor} strokeWidth={1.6} />
      <path d={arcPath(58, 180, 180 - TH2)} fill="none" stroke={refrColor} strokeWidth={1.6} />

      <T x={l1x} y={l1y} size={12} weight={600} fill={incColor}>
        θ₁
      </T>
      <T x={l2x} y={l2y} size={12} weight={600} fill={refColor}>
        θ₁′
      </T>
      <T x={l3x} y={l3y} size={12} weight={600} fill={refrColor}>
        θ₂
      </T>

      {/* labels */}
      <T x={200} y={116} size={12} fill={incColor}>
        incident
      </T>
      <T x={458} y={116} size={12} fill={refColor}>
        reflected
      </T>
      <T x={452} y={300} size={12} fill={refrColor} anchor="start">
        refracted
      </T>

      <T x={78} y={164} size={12} fill={C.inkSoft} anchor="start">
        medium 1  (n₁)
      </T>
      <T x={78} y={216} size={12} fill={C.inkSoft} anchor="start">
        medium 2  (n₂ &gt; n₁)
      </T>

      <T x={150} y={320} size={14} weight={600} fill={C.ink} anchor="start">
        n₁ sin θ₁ = n₂ sin θ₂
      </T>
    </Frame>
  );
}
