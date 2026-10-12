// Kit blocks: one reusable component per content block kind, plus the
// renderer that maps a JSON block to a component.
//
// These are the reading surface. They are deliberately content-agnostic - a
// callout does not know it is in Lesson 8 - so the same components render
// every lesson, present and future. The only styling input is `data-tone` on
// an ancestor, which resolves `--tone` for the whole subtree.

import { createElement } from "react";
import katex from "katex";
import type {
  Block,
  CalloutVariant,
  Formula as FormulaBlock,
} from "@/content/types";
import { t } from "@/lib/i18n";
import { figureFor } from "@/components/figures";
import { AnchorHeading, Icon, type IconName, RichText, plainText } from "./primitives";

/* ----------------------------------------------------------------- formula --*/

/** Renders LaTeX on the server, so no maths library ships to the browser. */
export function Formula({
  tex,
  caption,
}: Pick<FormulaBlock, "tex" | "caption">) {
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: true,
      throwOnError: false,
      strict: false,
      output: "html",
    });
  } catch {
    // A malformed formula should never blank the page; show the source.
    html = `<code>${escapeHtml(tex)}</code>`;
  }

  return (
    <figure className="card-tone rule-tone my-6 overflow-hidden rounded-2xl border shadow-sm">
      <div
        className="overflow-x-auto px-4 py-4 text-center sm:px-6 sm:py-5"
        role="math"
        dir="ltr"
        aria-label={plainText(caption ?? tex)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && (
        <figcaption className="border-t border-[color:var(--tone-line)] bg-surface/50 px-4 py-2.5 text-[0.82rem] leading-snug text-faint sm:px-6">
          <RichText text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ------------------------------------------------------------------ figure --*/

export function Figure({
  src,
  caption,
  alt,
}: {
  src: string;
  caption: string;
  alt: string;
}) {
  // A registered name is drawn as inline SVG, which keeps its labels as real
  // text. Anything not registered yet falls back to the exported PNG, so
  // figures convert one at a time.
  //
  // A registered figure supplies its own aria-label and <title> from the same
  // strings as its labels, so the block's `alt` is only used by the PNG
  // fallback.
  const Svg = figureFor(src);

  return (
    <figure className="my-7">
      <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-sm">
        {Svg ? (
          // createElement rather than <Svg />: the registry lookup makes the
          // component reference dynamic, which the React compiler lint rule
          // rejects as "creating components during render".
          createElement(Svg)
        ) : (
          /* plain <img> rather than next/image: these are fixed-width exported
             diagrams, and this keeps the page statically rendered with no
             image optimiser in the request path */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/figures/${src}`}
            alt={alt}
            loading="lazy"
            decoding="async"
            width={1400}
            height={800}
            className="w-full"
          />
        )}
      </div>
      <figcaption className="mt-2.5 flex gap-2 text-[0.84rem] leading-relaxed text-faint">
        <span className="font-semibold text-[color:var(--tone)]" aria-hidden="true">
          Fig.
        </span>
        <span className="min-w-0">
          <RichText text={caption} />
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------- table --*/

export function DataTable({
  head,
  rows,
  widths,
}: {
  head: string[];
  rows: string[][];
  widths?: number[];
}) {
  const total = widths?.reduce((a, b) => a + b, 0) ?? 0;
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-rule bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-[0.88rem]">
          <thead>
            <tr className="bg-[color:var(--tone-soft)]">
              {head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  style={
                    widths
                      ? { width: `${((widths[i] ?? 0) / total) * 100}%` }
                      : undefined
                  }
                  className="border-b border-[color:var(--tone-line)] px-3.5 py-2.5 text-start align-bottom text-[0.78rem] font-bold uppercase tracking-wide text-[color:var(--tone)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className={r % 2 === 1 ? "bg-surface-2" : "bg-surface"}
              >
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className="border-b border-rule-soft px-3.5 py-2.5 align-top leading-snug text-ink-soft last:border-e-0"
                  >
                    <RichText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- callout --*/

interface CalloutStyle {
  icon: IconName;
  /** Tailwind classes for the outer box. */
  box: string;
  /** Tailwind classes for the inner accent rule. */
  bar: string;
  /** Tailwind classes for the icon and the label. */
  ink: string;
}

// Each variant keeps its own hue. The label and icon carry the variant colour
// as text on the variant's own soft surface, which the palette guarantees is
// legible in both themes; a solid icon tile would instead need a per-variant
// foreground colour that has no token.
const CALLOUT_STYLES: Record<CalloutVariant, CalloutStyle> = {
  key: {
    icon: "idea",
    box: "border-[color:var(--tone-line)] bg-[color:var(--tone-soft)]",
    bar: "bg-[color:var(--tone)]",
    ink: "text-[color:var(--tone)]",
  },
  warn: {
    icon: "warn",
    box: "border-red/30 bg-red-light",
    bar: "bg-red",
    ink: "text-red",
  },
  term: {
    icon: "term",
    box: "border-violet/30 bg-violet-soft/60",
    bar: "bg-violet",
    ink: "text-violet",
  },
  note: {
    icon: "note",
    box: "border-rule bg-surface-2",
    bar: "bg-slate",
    ink: "text-slate",
  },
  example: {
    icon: "example",
    box: "border-good/25 bg-good-light",
    bar: "bg-good",
    ink: "text-good",
  },
};

export function Callout({
  variant,
  title,
  body,
  id,
}: {
  variant: CalloutVariant;
  title: string;
  body: string;
  id?: string;
}) {
  const s = CALLOUT_STYLES[variant];
  const d = t();
  const label =
    variant === "key"
      ? d.keyIdea
      : variant === "warn"
        ? d.commonPitfall
        : variant === "term"
          ? d.terminology
          : variant === "example"
            ? d.calloutExample
            : d.calloutNote;
  const heading = title || label;

  return (
    <aside
      id={id}
      className={`toc-anchor my-6 flex gap-3.5 rounded-2xl border p-4 sm:p-4.5 ${s.box}`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 w-1 shrink-0 rounded-full ${s.bar}`}
      />
      <div className="min-w-0">
        <div className={`flex items-center gap-1.5 ${s.ink}`}>
          <Icon name={s.icon} className="h-4 w-4 shrink-0" />
          <h2 className="text-[0.72rem] font-bold uppercase tracking-wider">
            <a href={id ? `#${id}` : undefined} className="toc-link text-inherit">
              {heading}
            </a>
          </h2>
        </div>
        <div className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">
          <RichText text={body} />
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------- list --*/

export function BulletList({
  items,
  ordered = false,
}: {
  items: string[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="my-5 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
          {ordered ? (
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--tone-soft)] text-[0.72rem] font-bold text-[color:var(--tone)] tabular-nums">
              {i + 1}
            </span>
          ) : (
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--tone)]" />
          )}
          <span className="min-w-0">
            <RichText text={item} />
          </span>
        </li>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ worked --*/

export function WorkedExample({
  title,
  given,
  steps,
  result,
  id,
}: {
  title: string;
  given: string;
  steps: string[];
  result: string;
  id?: string;
}) {
  // If every step is LaTeX the block is a derivation and each step is set as a
  // display equation; otherwise the steps are prose and get numbered.
  const maths = steps.every((s) => /[\\^_{}]/.test(s));
  return (
    <section
      id={id}
      className="card-tone toc-anchor my-7 overflow-hidden rounded-2xl border shadow-sm"
    >
      <div className="border-b border-[color:var(--tone-line)] bg-surface/50 px-4 py-3 sm:px-5">
        <p className="eyebrow">{t().workedExample}</p>
        <h2 className="mt-0.5 font-serif text-[1.08rem] leading-snug font-semibold text-ink">
          <a href={id ? `#${id}` : undefined} className="toc-link">
            {title}
          </a>
        </h2>
      </div>
      <div className="px-4 py-4 sm:px-5">
        <p className="rounded-lg border border-[color:var(--tone-line)] bg-surface/60 px-3 py-2 text-[0.88rem] leading-relaxed text-ink-soft">
          <span className="font-semibold text-[color:var(--tone)]">
            {t().given}.{" "}
          </span>
          <RichText text={given} />
        </p>
        {maths ? (
          <ol className="mt-3 space-y-1">
            {steps.map((s, i) => (
              <li key={i}>
                <Formula tex={s} />
              </li>
            ))}
          </ol>
        ) : (
          <ol className="mt-3.5 space-y-2.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-ink-soft">
                <span className="font-semibold text-[color:var(--tone)] tabular-nums">
                  {i + 1}.
                </span>
                <span className="min-w-0">
                  <RichText text={s} />
                </span>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-good-light px-3.5 py-2.5 text-[0.93rem] font-semibold text-good">
          <Icon name="check" className="h-4 w-4 shrink-0" />
          <span className="min-w-0">
            <RichText text={result} />
          </span>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- renderer --*/

/** Renders one block. `id` is the TOC anchor, assigned by `lib/toc`. */
export function RenderBlock({ block, id }: { block: Block; id?: string }) {
  switch (block.kind) {
    case "para":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "heading":
      return (
        <AnchorHeading id={id} level={block.level ?? 2}>
          <RichText text={block.text} />
        </AnchorHeading>
      );
    case "formula":
      return <Formula tex={block.tex} caption={block.caption} />;
    case "figure":
      return <Figure src={block.src} caption={block.caption} alt={block.alt} />;
    case "table":
      return (
        <DataTable head={block.head} rows={block.rows} widths={block.widths} />
      );
    case "callout":
      return (
        <Callout
          variant={block.variant}
          title={block.title}
          body={block.body}
          id={id}
        />
      );
    case "list":
      return <BulletList items={block.items} ordered={block.ordered} />;
    case "worked":
      return (
        <WorkedExample
          id={id}
          title={block.title}
          given={block.given}
          steps={block.steps}
          result={block.result}
        />
      );
  }
}

/** Render a run of blocks. */
export function BlockList({
  blocks,
  idFor,
}: {
  blocks: readonly Block[];
  idFor?: (index: number) => string | undefined;
}) {
  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock key={i} block={block} id={idFor?.(i)} />
      ))}
    </>
  );
}
