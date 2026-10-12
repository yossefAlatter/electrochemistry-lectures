// Kit chrome: the reading furniture around the blocks - breadcrumbs, the
// section header, the recap panel, the section cards and the pager.
//
// All of it is presentational and takes plain values, so a template composes
// it without reaching into the content model.

import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";
import { fill, t } from "@/lib/i18n";
import { Chip, Eyebrow, Icon, RichText } from "./primitives";

/* ------------------------------------------------------------- breadcrumb --*/

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const d = t();
  return (
    <nav aria-label={d.breadcrumbAria} className="no-print text-[0.8rem]">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-faint">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent-dark">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-[color:var(--tone)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* --------------------------------------------------------- section header --*/

export function SectionHeader({
  lessonLabel,
  index,
  total,
  title,
  summary,
  minutes,
  quickCount,
}: {
  lessonLabel: string;
  index: number;
  total: number;
  title: string;
  summary?: string;
  minutes?: number;
  quickCount: number;
}) {
  const d = t();
  const pct = (100 * index) / total;
  return (
    <header className="relative mt-3 overflow-hidden rounded-2xl border border-rule bg-surface p-5 sm:p-6">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[color:var(--tone)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[color:var(--tone-soft)] blur-2xl"
      />
      <div className="relative">
        <Eyebrow>{lessonLabel}</Eyebrow>
        <div className="mt-3 flex items-start gap-3.5">
          <span className="numeral grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--tone-soft)] text-[1.1rem] font-semibold text-[color:var(--tone)] ring-1 ring-[color:var(--tone-line)] tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <h1 className="mt-0.5 font-serif text-[1.55rem] leading-tight font-semibold text-ink sm:text-[2rem]">
            {title}
          </h1>
        </div>
        {summary && (
          <p className="mt-3.5 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft italic">
            <RichText text={summary} />
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip strong>{fill(d.sectionOf, { i: index, n: total })}</Chip>
          {minutes ? (
            <Chip>
              <Icon name="clock" className="h-3.5 w-3.5" />
              {fill(d.minutes, { n: minutes })}
            </Chip>
          ) : null}
          {quickCount > 0 && (
            <Chip>
              {fill(quickCount === 1 ? d.quickCheckOne : d.quickChecks, {
                n: quickCount,
              })}
            </Chip>
          )}
        </div>

        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-rule"
          role="img"
          aria-label={fill(d.sectionOf, { i: index, n: total })}
        >
          <div
            className="h-full rounded-full bg-[color:var(--tone)] transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- key points --*/

export function KeyPoints({ points }: { points: string[] }) {
  const d = t();
  return (
    <section className="card-tone mt-10 max-w-[64ch] rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[color:var(--tone)]">
        <Icon name="bookmark" className="h-4 w-4" />
        <p className="eyebrow">{d.worthMemorising}</p>
      </div>
      <ul className="mt-3.5 space-y-3">
        {points.map((k, i) => (
          <li key={i} className="flex gap-3 text-[0.94rem] leading-relaxed text-ink-soft">
            <Icon
              name="check"
              className="mt-1 h-3.5 w-3.5 shrink-0 text-[color:var(--tone)]"
            />
            <span className="min-w-0">
              <RichText text={k} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------- section card --*/

export function SectionCard({
  href,
  index,
  tone,
  title,
  summary,
  minutes,
  quick,
  inQuiz,
}: {
  href: string;
  index: number;
  tone: Tone;
  title: string;
  summary: string;
  minutes?: number;
  quick: number;
  inQuiz: number;
}) {
  const d = t();
  return (
    <Link
      href={href}
      data-tone={tone}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--tone)] hover:shadow-md"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-1 bg-[color:var(--tone)] opacity-70 transition-opacity group-hover:opacity-100"
      />
      <span className="flex items-baseline gap-2.5">
        <span className="numeral text-[1rem] leading-none font-semibold text-[color:var(--tone)] tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-serif text-[1.08rem] leading-snug font-semibold text-ink">
          {title}
        </span>
      </span>
      <span className="mt-1.5 flex-1 text-[0.9rem] leading-relaxed text-ink-soft">
        <RichText text={summary} />
      </span>
      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-faint">
        {minutes ? <span>{fill(d.minutes, { n: minutes })}</span> : null}
        {quick > 0 && (
          <span>
            {fill(quick === 1 ? d.quickCheckOne : d.quickChecks, { n: quick })}
          </span>
        )}
        {inQuiz > 0 && <span>{fill(d.inQuiz, { n: inQuiz })}</span>}
        <span className="ms-auto font-semibold text-[color:var(--tone)] opacity-0 transition-opacity group-hover:opacity-100">
          {d.readLink}
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ pager --*/

export interface PagerItem {
  href: string;
  kicker: string;
  title: string;
  summary?: string;
}

export function Pager({
  prev,
  next,
  ariaLabel,
}: {
  prev?: PagerItem;
  next?: PagerItem;
  ariaLabel: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="no-print mt-10 grid max-w-[64ch] gap-2.5 border-t border-rule pt-6 sm:grid-cols-2"
    >
      {prev ? <PagerLink item={prev} dir="prev" /> : <span className="hidden sm:block" />}
      {next ? <PagerLink item={next} dir="next" /> : <span className="hidden sm:block" />}
    </nav>
  );
}

function PagerLink({ item, dir }: { item: PagerItem; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      href={item.href}
      className={[
        "group rounded-xl border px-4 py-3 transition-colors hover:shadow-sm",
        next
          ? "border-[color:var(--tone-line)] bg-[color:var(--tone-soft)] text-end"
          : "border-rule bg-surface",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider",
          next ? "justify-end text-[color:var(--tone)]" : "text-faint",
        ].join(" ")}
      >
        {!next && <Icon name="arrowLeft" className="h-3.5 w-3.5" />}
        {item.kicker}
        {next && <Icon name="arrowRight" className="h-3.5 w-3.5" />}
      </span>
      <span className="mt-1 block text-[0.94rem] leading-snug font-semibold text-ink">
        {item.title}
      </span>
      {item.summary && (
        <span className="mt-0.5 block text-[0.82rem] leading-snug text-faint">
          <RichText text={item.summary} />
        </span>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------- misc --*/

/** A labelled panel, e.g. the "this lesson follows" source note. */
export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card-tone rounded-2xl border p-5">
      <p className="eyebrow">{title}</p>
      <div className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}
