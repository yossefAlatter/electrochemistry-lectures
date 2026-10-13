/**
 * A timeline of how the electromagnetic wave was discovered.
 *
 * Seven milestones run left to right along a single axis: the wave nature from
 * interference, the proof from polarisation that the wave is transverse, the
 * linking of electricity and magnetism, Maxwell's prediction of a wave at the
 * speed of light, and Hertz's confirmation. The milestones alternate above and
 * below the axis so their labels never collide, and are coloured by theme.
 */

import { C, Frame, Line, T, lines } from "./kit";

type Event = {
  year: string;
  who: string;
  what: string;
  colour: string;
};

const EVENTS: Event[] = [
  { year: "1801", who: "Young", what: "interference fringes", colour: "#2563eb" },
  { year: "1808", who: "Malus", what: "light is polarised", colour: "#2563eb" },
  { year: "1820", who: "Ørsted", what: "current turns a needle", colour: "#7c3aed" },
  { year: "1831", who: "Faraday", what: "changing field makes a field", colour: "#7c3aed" },
  { year: "1865", who: "Maxwell", what: "equations predict the speed of light", colour: "#e11d48" },
  { year: "1887", who: "Hertz", what: "radio waves measured", colour: "#e11d48" },
  { year: "1905", who: "Einstein", what: "no medium needed", colour: "#e11d48" },
];

const AXIS_Y = 168;
const X0 = 92;
const X1 = 648;

export function EmDiscoveryTimeline() {
  const step = (X1 - X0) / (EVENTS.length - 1);

  return (
    <Frame
      height={320}
      title="A timeline of the discovery of the electromagnetic wave, from Young's interference fringes in 1801 to Einstein's conclusion in 1905 that light needs no medium"
    >
      <T x={360} y={26} size={14} weight={700} fill={C.ink}>
        Two centuries of evidence for the wave picture
      </T>

      <Line x1={X0 - 24} y1={AXIS_Y} x2={X1 + 24} y2={AXIS_Y} stroke={C.rule} strokeWidth={2} />

      {EVENTS.map((e, i) => {
        const x = X0 + step * i;
        const above = i % 2 === 0;
        const phrase = lines(e.what, 14);

        return (
          <g key={e.year}>
            <Line
              x1={x}
              y1={AXIS_Y}
              x2={x}
              y2={above ? AXIS_Y - 12 : AXIS_Y + 12}
              stroke={e.colour}
              strokeWidth={1.5}
            />
            <circle cx={x} cy={AXIS_Y} r={4.5} fill={e.colour} />

            {above ? (
              <>
                <T x={x} y={AXIS_Y - 24} size={13} weight={700} fill={e.colour}>
                  {e.year}
                </T>
                <T x={x} y={AXIS_Y - 42} size={12} weight={600} fill={C.ink}>
                  {e.who}
                </T>
                {phrase.map((line, li) => (
                  <T key={line} x={x} y={AXIS_Y - 60 - li * 15} size={11} fill={C.inkSoft}>
                    {line}
                  </T>
                ))}
              </>
            ) : (
              <>
                <T x={x} y={AXIS_Y + 24} size={13} weight={700} fill={e.colour}>
                  {e.year}
                </T>
                <T x={x} y={AXIS_Y + 42} size={12} weight={600} fill={C.ink}>
                  {e.who}
                </T>
                {phrase.map((line, li) => (
                  <T key={line} x={x} y={AXIS_Y + 60 + li * 15} size={11} fill={C.inkSoft}>
                    {line}
                  </T>
                ))}
              </>
            )}
          </g>
        );
      })}

      <T x={24} y={250} size={11} weight={700} fill={C.inkSoft} anchor="start">
        colours
      </T>
      <T x={24} y={266} size={11} weight={600} fill="#2563eb" anchor="start">
        wave nature
      </T>
      <T x={24} y={281} size={11} weight={600} fill="#7c3aed" anchor="start">
        fields joined
      </T>
      <T x={24} y={296} size={11} weight={600} fill="#e11d48" anchor="start">
        electromagnetic wave
      </T>
    </Frame>
  );
}
