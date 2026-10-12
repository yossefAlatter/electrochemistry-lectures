// Kit primitives: the small, reusable pieces every template is built from.
//
// Nothing here knows about lessons or JSON. These are the atoms - inline
// markup, headings, chips, icons - so the block and chrome components can stay
// about layout and the templates can stay about order.

import type { ReactNode } from "react";

/**
 * The inline markup reduced to plain text, for places that cannot hold markup.
 *
 * An aria-label is a string, not a document: a screen reader reads it out
 * character by character, so a caption of "The Tafel **slope** is unchanged"
 * used as a label announces "Tafel asterisk asterisk slope". The visible
 * caption goes through RichText; the accessible name has to be flattened.
 * Also used for <meta name="description">, which is plain text and must not
 * carry the reader-facing markup either.
 */
export function plainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\(\(.*?\)\)/g, " ($1)")
    .trim();
}

/**
 * Renders the inline markup used in the content.
 *
 * Supported: **bold**, *italic*, `code`, and ((gloss)).
 *
 * The gloss marks a term the reader may not know yet, so double parentheses
 * were chosen over single ones - single parentheses are ordinary prose
 * punctuation - and over a bracketed tag because they stay readable in the
 * source and cannot collide with the *italic* or **bold** delimiters. The
 * gloss is rendered LTR and isolated, so a term is never reordered by the
 * bidirectional algorithm.
 */
export function RichText({ text }: { text: string }) {
  const parts = text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\(\([^)]+\)\))/g)
    .filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-tint px-1 py-0.5 font-mono text-[0.88em] text-ink"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("((") && part.endsWith("))")) {
          return (
            <span key={i} className="gloss">
              {" ("}
              {part.slice(2, -2)}
              {")"}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** The small uppercase label above a title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/**
 * A tone-tinted pill. Used for the section meta row on cards and headers, so
 * those little facts read as one set rather than three different spans.
 */
export function Chip({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.76rem] leading-none",
        strong
          ? "border-[color:var(--tone-line)] bg-[color:var(--tone-soft)] font-semibold text-[color:var(--tone)]"
          : "border-rule bg-surface text-ink-soft",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/**
 * A serif heading with a quiet anchor.
 *
 * The `#` only appears on hover or focus, so a reader who is just reading sees
 * a heading and a reader who wants to link to it can. Rendering the anchor in
 * CSS (`.toc-link`) keeps it out of the accessible name.
 */
export function AnchorHeading({
  id,
  level = 2,
  children,
}: {
  id?: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const Tag = level === 3 ? "h3" : "h2";
  const size =
    level === 3
      ? "text-[1.02rem] sm:text-[1.12rem]"
      : "text-[1.2rem] sm:text-[1.35rem]";
  return (
    <Tag
      id={id}
      className={`toc-anchor group mt-9 mb-3 font-serif leading-snug font-semibold text-ink ${size}`}
    >
      <a href={id ? `#${id}` : undefined} className="toc-link">
        {children}
      </a>
    </Tag>
  );
}

/* -------------------------------------------------------------------- icon --*/

export type IconName =
  | "idea"
  | "warn"
  | "term"
  | "note"
  | "example"
  | "bookmark"
  | "check"
  | "arrowRight"
  | "arrowLeft"
  | "clock"
  | "list";

const ICON_PATHS: Record<IconName, ReactNode> = {
  idea: (
    <path d="M8 1.5a4.5 4.5 0 0 0-2.7 8.1c.4.3.7.8.7 1.3v.6h4v-.6c0-.5.3-1 .7-1.3A4.5 4.5 0 0 0 8 1.5ZM6.3 13h3.4M7 15h2" />
  ),
  warn: (
    <path d="M8 1.8 15 14H1L8 1.8ZM8 6v3.6M8 11.6v.1" />
  ),
  term: (
    <path d="M4 2h6a2 2 0 0 1 2 2v10H5.5A1.5 1.5 0 0 1 4 12.5V2ZM4 12.5A1.5 1.5 0 0 1 5.5 11H12M6 5h4" />
  ),
  note: (
    <path d="M3 2.5h10v11H3zM5.5 5.5h5M5.5 8h5M5.5 10.5h3" />
  ),
  example: (
    <path d="M6 1.5h4v2l3 2.2v8.3H3V5.7l3-2.2v-2ZM3 6h10M6 9h4M6 11h2.5" />
  ),
  bookmark: <path d="M4 1.8h8v12.4L8 11.4l-4 2.8V1.8Z" />,
  check: <path d="M3 8.5 6.5 12 13 4.5" />,
  arrowRight: <path d="M3 8h10M9 4l4 4-4 4" />,
  arrowLeft: <path d="M13 8H3M7 4 3 8l4 4" />,
  clock: <path d="M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8ZM8 4.5V8l2.4 1.6" />,
  list: <path d="M6 4h8M6 8h8M6 12h8M2.5 4h.1M2.5 8h.1M2.5 12h.1" />,
};

/** A tiny stroked icon. Inherits `currentColor`, so the caller sets the hue. */
export function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
