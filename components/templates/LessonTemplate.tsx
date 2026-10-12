// The fixed lesson template.
//
// The lesson overview always reads the same way: a header with the lesson's
// promise, the intro prose, a grid of section cards, the constants it relies
// on, the quiz invitation and the previous/next lesson pager. Like the section
// template, it takes data only.

import Link from "next/link";
import type { Lesson } from "@/content/types";
import { BlockList } from "@/components/kit/blocks";
import { Chip, Eyebrow, Icon, RichText } from "@/components/kit/primitives";
import { Pager, SectionCard } from "@/components/kit/chrome";
import { fill, t } from "@/lib/i18n";
import { lessonHref, quizHref, sectionHref } from "@/lib/links";

export interface LessonTemplateProps {
  lesson: Lesson;
  prev?: Lesson;
  next?: Lesson;
  quickTotal: number;
  totalMinutes: number;
  questionCountBySection: Record<string, number>;
}

export function LessonTemplate({
  lesson,
  prev,
  next,
  quickTotal,
  totalMinutes,
  questionCountBySection,
}: LessonTemplateProps) {
  const d = t();
  const first = lesson.sections[0];

  return (
    <div className="pb-12">
      <header className="relative overflow-hidden rounded-2xl border border-rule bg-surface p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-20 -top-24 h-64 w-64 rounded-full bg-accent-light blur-3xl"
        />
        <div className="relative">
          <Eyebrow>{lesson.label}</Eyebrow>
          <h1 className="mt-1.5 font-serif text-[1.8rem] leading-tight font-semibold tracking-tight text-ink sm:text-[2.3rem]">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft">
            <RichText text={lesson.summary} />
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip strong>
              {fill(d.lessonSectionsCount, { n: lesson.sections.length })}
            </Chip>
            <Chip>
              <Icon name="clock" className="h-3.5 w-3.5" />
              {fill(d.lessonMinTotal, { n: totalMinutes || lesson.minutes })}
            </Chip>
            <Chip>{fill(d.lessonQuestions, { n: lesson.mcq.length })}</Chip>
          </div>

          {lesson.intro && lesson.intro.length > 0 && (
            <div className="prose-lesson mt-6 max-w-[62ch]">
              <BlockList blocks={lesson.intro} />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={first ? sectionHref(lesson, first) : "#"}
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2.5 text-[0.92rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark"
            >
              {lesson.slug === "lesson-0" ? d.startReading : d.continueReading}
              <span aria-hidden="true" className="ms-1.5 flow-arrow">
                →
              </span>
            </Link>
            <Link
              href={quizHref(lesson)}
              className="inline-flex min-h-11 items-center rounded-lg border border-rule bg-surface px-4 py-2.5 text-[0.92rem] font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent-dark"
            >
              {fill(d.allQuestionsLink, { n: lesson.mcq.length })}
            </Link>
          </div>
        </div>
      </header>

      {lesson.source && (
        <p className="mt-4 max-w-[62ch] text-[0.82rem] leading-relaxed text-faint">
          <span className="font-semibold text-ink-soft">Follows </span>
          {lesson.source}
        </p>
      )}

      {/* ---------------- section index ---------------- */}
      <section className="mt-8">
        <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-faint">
          {d.sectionsHeading}
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {lesson.sections.map((s, i) => {
            const n = questionCountBySection[s.id] ?? 0;
            return (
              <li key={s.id}>
                <SectionCard
                  href={sectionHref(lesson, s)}
                  index={i + 1}
                  tone={s.tone}
                  title={s.title}
                  summary={s.summary}
                  minutes={s.minutes}
                  quick={Math.min(3, n)}
                  inQuiz={n}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {lesson.constants && lesson.constants.length > 0 && (
        <details className="mt-8 overflow-hidden rounded-2xl border border-rule bg-surface">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-[0.92rem] font-semibold text-ink">
            {d.constantsHeading}
            <span aria-hidden="true" className="text-faint">
              ▾
            </span>
          </summary>
          <dl className="grid gap-px border-t border-rule bg-rule sm:grid-cols-2">
            {lesson.constants.map((c) => (
              <div key={c.symbol} className="bg-surface px-4 py-2.5">
                <dt className="font-mono text-[0.9rem] font-semibold text-accent-dark">
                  {c.symbol}
                </dt>
                <dd className="text-[0.85rem] leading-snug text-ink-soft">
                  {c.name}:{" "}
                  <span className="font-semibold text-ink">{c.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      {lesson.mcq.length > 0 && (
        <div className="mt-8 rounded-2xl border border-accent/25 bg-accent-light/45 p-5 sm:p-6">
          <h2 className="font-serif text-[1.15rem] font-semibold text-ink">
            {fill(d.quickTotalTitle, { a: quickTotal, b: lesson.mcq.length })}
          </h2>
          <p className="mt-1.5 max-w-[58ch] text-[0.92rem] leading-relaxed text-ink-soft">
            {d.quickTotalBody}
          </p>
          <Link
            href={quizHref(lesson)}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2.5 text-[0.92rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark"
          >
            {d.takeFullQuiz}
            <span aria-hidden="true" className="ms-1.5 flow-arrow">
              →
            </span>
          </Link>
        </div>
      )}

      <Pager
        ariaLabel={d.sectionNavAria}
        prev={
          prev
            ? {
                href: lessonHref(prev),
                kicker: d.prev,
                title: `${prev.label}: ${prev.title}`,
              }
            : undefined
        }
        next={
          next
            ? {
                href: lessonHref(next),
                kicker: d.next,
                title: `${next.label}: ${next.title}`,
              }
            : undefined
        }
      />
    </div>
  );
}
