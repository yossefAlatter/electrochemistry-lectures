/**
 * Electrons one at a time through a double slit.
 *
 * Fire electrons through two slits one at a time and each one arrives at the
 * screen as a single, localised dot: a particle. But as the dots build up, they
 * fall into bright and dark fringes: an interference pattern, which only waves
 * produce. Matter is both, and the pattern is a map of where each particle is
 * likely to land.
 */

import { C, Frame, Line, T } from "./kit";

export function DualityDoubleSlit() {
  const fringes = [
    { y: 150, o: 1 },
    { y: 115, o: 0.6 },
    { y: 185, o: 0.6 },
    { y: 80, o: 0.3 },
    { y: 220, o: 0.3 },
  ];
  const dots = [150, 148, 152, 118, 182, 84, 216];

  return (
    <Frame
      height={320}
      title="Electrons fired one at a time through a double slit: each electron lands as a single dot, but many dots build up an interference pattern of bright and dark fringes"
    >
      {/* electron source */}
      <rect x={40} y={135} width={62} height={30} rx={6} fill={C.tone} opacity={0.15} stroke={C.rule} strokeWidth={1.5} />
      <T x={71} y={182} size={11} weight={600} fill={C.ink}>
        electron source
      </T>

      {/* paths to each slit */}
      <Line x1={102} y1={150} x2={300} y2={137} stroke={C.inkSoft} strokeWidth={1.3} dash="4 4" />
      <Line x1={102} y1={150} x2={300} y2={163} stroke={C.inkSoft} strokeWidth={1.3} dash="4 4" />
      <Line x1={300} y1={137} x2={648} y2={137} stroke={C.inkSoft} strokeWidth={1.3} dash="4 4" />
      <Line x1={300} y1={163} x2={648} y2={163} stroke={C.inkSoft} strokeWidth={1.3} dash="4 4" />

      {/* the barrier with two slits */}
      <rect x={296} y={60} width={8} height={72} fill={C.ink} opacity={0.75} />
      <rect x={296} y={142} width={8} height={16} fill={C.ink} opacity={0.75} />
      <rect x={296} y={168} width={8} height={72} fill={C.ink} opacity={0.75} />

      {/* the screen with the built-up pattern */}
      <rect x={648} y={44} width={10} height={212} rx={3} fill={C.surface} stroke={C.rule} strokeWidth={1.5} />
      {fringes.map((f) => (
        <rect key={f.y} x={648} y={f.y - 3.5} width={10} height={7} fill="#f59e0b" opacity={f.o} />
      ))}
      {dots.map((y, i) => (
        <circle key={i} cx={644} cy={y} r={2.6} fill={C.ink} />
      ))}

      <T x={330} y={34} size={12} weight={700} fill={C.ink}>
        electrons fired one at a time
      </T>
      <T x={470} y={276} size={11} fill={C.inkSoft}>
        one electron arrives as one dot (particle)
      </T>
      <T x={470} y={298} size={11} weight={600} fill={C.ink}>
        many dots build an interference pattern (wave)
      </T>
    </Frame>
  );
}
