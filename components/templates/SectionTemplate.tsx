// The fixed section template.
//
// A section page always has the same shape: breadcrumb, header, body blocks,
// recap, quick check, closing call-to-action, pager. This template owns that
// shape and takes only data, so a content author never lays out a page - they
// fill a JSON object and this decides where each piece goes.

import Link from "next/link";
import type { Question, Section } from "@/content/types";
import QuickCheck from "@/components/QuickCheck";
import { SectionChrome } from "@/components/SectionChrome";
import { BlockList } from "@/components/kit/blocks";
import {
  Breadcrumbs,
  KeyPoints,
  Pager,
  SectionHeader,
  type PagerItem,
} from "@/components/kit/chrome";
import { fill, t } from "@/lib/i18n";
import { homeHref, quizHref, sectionHref } from "@/lib/links";
import type { TocItem } from "@/lib/toc";

export interface SectionTemplateProps {
  lesson: { slug: string; label: string };
  section: Section;
  index: number;
  total: number;
  prev?: Section;
  next?: Section;
  quick: Question[];
  quizCount: number;
  toc: TocItem[];
  lessonNav: { id: string; label: string; tone: string; href: string }[];
}

export function SectionTemplate({
  lesson,
  section,
  index,
  total,
  prev,
  next,
  quick,
  quizCount,
  toc,
  lessonNav,
}: SectionTemplateProps) {
  const d = t();

  const pagerFor = (s: Section, marker: number, kicker: string): PagerItem => ({
    href: sectionHref(lesson, s),
    kicker,
    title: `${String(marker).padStart(2, "0")} ${s.title}`,
    summary: s.summary,
  });

  return (
    <div data-tone={section.tone} className="pb-12">
      <SectionChrome toc={toc} sections={lessonNav} currentId={section.id}>
        <Breadcrumbs
          items={[
            { label: d.navHome, href: homeHref() },
            { label: lesson.label, href: `/lessons/${lesson.slug}` },
            {
              label: `${String(index).padStart(2, "0")} ${section.title}`,
            },
          ]}
        />

        <SectionHeader
          lessonLabel={lesson.label}
          index={index}
          total={total}
          title={section.title}
          summary={section.summary}
          minutes={section.minutes}
          quickCount={quick.length}
        />

        {/* ---------------- body ---------------- */}
        <div className="prose-lesson mt-8 max-w-[64ch]">
          <BlockList blocks={section.blocks} />
        </div>

        {/* key points last: a short recap once the reader has worked through
            the body, so the section opens with the subject itself rather than
            a list of answers. */}
        {section.keyPoints && section.keyPoints.length > 0 && (
          <KeyPoints points={section.keyPoints} />
        )}

        {quizCount > 0 && (
          <p className="mt-6 max-w-[64ch] text-[0.88rem] text-faint">
            {fill(d.bankCovers, { n: quizCount })}{" "}
            <Link
              href={`${quizHref(lesson)}?topic=${section.id}`}
              className="font-semibold text-[color:var(--tone)] underline underline-offset-2"
            >
              {fill(d.openAll, { n: quizCount })}
            </Link>
          </p>
        )}

        {/* ---------------- quick check ---------------- */}
        <div className="mt-8 max-w-[64ch]">
          <QuickCheck questions={quick} sectionTitle={section.title} />
        </div>

        {/* ---------------- closing call to action ---------------- */}
        {section.cta && (
          <div className="card-tone no-print mt-8 max-w-[64ch] overflow-hidden rounded-2xl border p-5">
            <h2 className="font-serif text-[1.25rem] leading-snug font-semibold text-ink">
              {section.cta.title}
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
              {section.cta.body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href={section.cta.href}
                className="inline-flex min-h-11 items-center rounded-lg bg-[color:var(--tone)] px-4 py-2.5 text-[0.92rem] font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                {section.cta.linkLabel}
                <span aria-hidden="true" className="ms-1.5 flow-arrow">
                  →
                </span>
              </Link>
              {section.cta.secondaryHref && section.cta.secondaryLabel && (
                <Link
                  href={section.cta.secondaryHref}
                  className="inline-flex min-h-11 items-center rounded-lg border border-rule bg-surface px-4 py-2.5 text-[0.92rem] font-semibold text-ink-soft transition-colors hover:border-[color:var(--tone)] hover:text-[color:var(--tone)]"
                >
                  {section.cta.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ---------------- previous / next section ---------------- */}
        <Pager
          ariaLabel={d.sectionNavAria}
          prev={
            prev
              ? pagerFor(prev, index - 1, d.prev)
              : {
                  href: `/lessons/${lesson.slug}`,
                  kicker: d.contents,
                  title: fill(d.allSectionsOf, { n: total, label: lesson.label }),
                }
          }
          next={
            next
              ? pagerFor(next, index + 1, d.next)
              : {
                  href: `/lessons/${lesson.slug}`,
                  kicker: d.finish,
                  title: fill(d.backToContents, { label: lesson.label }),
                }
          }
        />
      </SectionChrome>
    </div>
  );
}
