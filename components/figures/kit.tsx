/**
 * Shared building blocks for the SVG figures.
 *
 * Why SVG rather than a <canvas> element or an exported PNG:
 *
 *   - it stays sharp at any zoom and prints sharply, which a raster cannot;
 *   - the labels are text, so they are real text: selectable and searchable;
 *   - it inherits the theme, because every colour here is a CSS custom
 *     property, so the figure follows light and dark without a second file;
 *   - it costs a few kilobytes instead of a few hundred, which matters for the
 *     offline precache;
 *   - and it needs no build step and no canvas polyfill.
 *
 * Geometry is in a 0 0 720 H viewBox with `preserveAspectRatio`, so a figure
 * scales to its container while its text keeps a predictable size relative to
 * the drawing.
 */

/** Common bits, so each figure is mostly its own content. */
export const C = {
  ink: "var(--c-ink)",
  inkSoft: "var(--c-ink-soft)",
  faint: "var(--c-ink-faint)",
  rule: "var(--rule, var(--c-ink-faint))",
  surface: "var(--c-surface, var(--c-page))",
  tone: "var(--tone)",
} as const;

export function Frame({
  children,
  height,
  title,
}: {
  children: React.ReactNode;
  height: number;
  title: string;
}) {
  return (
    <svg
      viewBox={`0 0 720 ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className="h-auto w-full rounded-lg border border-rule bg-surface shadow-sm"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** A text label. `anchor` and `baseline` map to SVG's text-anchor / dominant-baseline. */
export function T({
  x,
  y,
  children,
  size = 13,
  weight = 500,
  fill = C.ink,
  anchor = "middle",
  baseline = "middle",
  opacity = 1,
  italic,
}: {
  x: number;
  y: number;
  children?: React.ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  baseline?: "auto" | "middle" | "hanging";
  opacity?: number;
  italic?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      dominantBaseline={baseline}
      opacity={opacity}
      fontStyle={italic ? "italic" : undefined}
    >
      {children}
    </text>
  );
}

/**
 * Split a label into lines that fit the frame.
 *
 * A figure's width is fixed and a label is not, so rather than hand-tuning
 * coordinates for every string, long labels are wrapped to a character budget.
 *
 * `perLine` is characters per line, not pixels: see tools/check_figure_fit.ts,
 * which measures the real rendered width in a browser and fails if anything
 * overflows.
 */
export function lines(text: string, perLine: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if (cur.length + 1 + w.length <= perLine) {
      cur += " " + w;
    } else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** A rounded box, used for electrodes, panels and badges. */
export function Box({
  x,
  y,
  w,
  h,
  rx = 8,
  fill = "none",
  stroke = C.rule,
  strokeWidth = 1.5,
  opacity,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
}

/** A straight connector. */
export function Line({
  x1,
  y1,
  x2,
  y2,
  stroke = C.rule,
  strokeWidth = 1.5,
  dash,
  markerStart,
  markerEnd,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  dash?: string;
  markerStart?: string;
  markerEnd?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dash}
      markerStart={markerStart}
      markerEnd={markerEnd}
    />
  );
}

/**
 * A wavy connector, used to draw a photon travelling from one point to another.
 *
 * The path runs along the straight line from (x1,y1) to (x2,y2) while
 * oscillating sideways by ±amp, completing `waves` cycles. The amplitude is
 * tapered to zero at both ends so the wave meets the line cleanly.
 */
export function wavePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp: number,
  waves: number,
  samples = 72,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const s = Math.sin(2 * Math.PI * waves * t) * amp * Math.sin(Math.PI * t);
    const x = x1 + dx * t + px * s;
    const y = y1 + dy * t + py * s;
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

/** A filled arrowhead, for the electron-flow direction. */
export function ArrowHead({ id, color = C.ink, flip }: { id: string; color?: string; flip?: boolean }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX={flip ? 0 : 8}
      refY={5}
      markerWidth={5}
      markerHeight={5}
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  );
}
