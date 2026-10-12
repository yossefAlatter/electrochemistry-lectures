import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip, Eyebrow, Icon, RichText } from "@/components/kit";
import { getCourse, homeHref, lessonHref } from "@/content/registry";
import { fill, t } from "@/lib/i18n";

/**
 * A course page: what the course is, then its lessons as cards. The lesson
 * cards are the only place a lesson is entered, so the course is the unit the
 * reader chooses between, and the sidebar keeps to whichever course they chose.
 */
export default function CourseView({ courseId }: { courseId: string }) {
  const course = getCourse(courseId);
  if (!course) notFound();

  const d = t();
  const lessons = course.lessons;
  const sections = lessons.reduce((n, l) => n + l.sections.length, 0);
  const questions = lessons.reduce((n, l) => n + l.mcq.length, 0);
  const minutes = lessons.reduce(
    (n, l) => n + l.sections.reduce((m, s) => m + (s.minutes ?? 0), 0),
    0,
  );
  const first = lessons[0];

  return (
    <div className="pb-12">
      <header className="relative overflow-hidden rounded-2xl border border-rule bg-surface p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-20 -top-24 h-64 w-64 rounded-full bg-accent-light blur-3xl"
        />
        <div className="relative">
          <Eyebrow>{d.courseEyebrow}</Eyebrow>
          <h1 className="mt-1.5 font-serif text-[1.8rem] leading-tight font-semibold tracking-tight text-ink sm:text-[2.3rem]">
            {course.title}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft">
            {course.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip strong>
              {fill(d.courseLessons, { n: lessons.length })}
            </Chip>
            <Chip>{fill(d.lessonSectionsCount, { n: sections })}</Chip>
            <Chip>{fill(d.lessonQuestions, { n: questions })}</Chip>
            {minutes > 0 && (
              <Chip>
                <Icon name="clock" className="h-3.5 w-3.5" />
                {fill(d.lessonMinTotal, { n: minutes })}
              </Chip>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {first && (
              <Link
                href={lessonHref(first)}
                className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2.5 text-[0.92rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark"
              >
                {d.startCourse}
                <span aria-hidden="true" className="ms-1.5 flow-arrow">
                  →
                </span>
              </Link>
            )}
            <Link
              href={homeHref()}
              className="inline-flex min-h-11 items-center rounded-lg border border-rule bg-surface px-4 py-2.5 text-[0.92rem] font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent-dark"
            >
              {d.allCourses}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- lessons ---------------- */}
      <section className="mt-8">
        <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-faint">
          {d.courseLessonsHeading}
        </h2>

        <ul className="mt-3 space-y-3">
          {lessons.map((lesson) => {
            const mins = lesson.sections.reduce(
              (n, s) => n + (s.minutes ?? 0),
              0,
            );
            return (
              <li key={lesson.slug}>
                <Link
                  href={lessonHref(lesson)}
                  className="block rounded-xl border border-rule bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.13em] text-accent">
                      {lesson.label}
                    </span>
                    <span className="shrink-0 text-[0.72rem] text-faint tabular-nums">
                      {fill(d.cardMeta, {
                        n: lesson.sections.length,
                        m: mins || lesson.minutes,
                        k: lesson.mcq.length,
                      })}
                    </span>
                  </div>

                  <h3 className="mt-1 font-serif text-[1.2rem] leading-snug font-semibold text-ink">
                    {lesson.title}
                  </h3>
                  <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-soft">
                    <RichText text={lesson.summary} />
                  </p>

                  <ul className="mt-3.5 divide-y divide-rule border-t border-rule">
                    {lesson.sections.map((s, i) => (
                      <li
                        key={s.id}
                        data-tone={s.tone}
                        className="flex items-baseline gap-2.5 py-1.5 text-[0.86rem]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--tone)]"
                        />
                        <span className="shrink-0 text-[0.74rem] font-semibold text-faint tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 text-ink-soft">{s.title}</span>
                        {s.minutes && (
                          <span className="ms-auto shrink-0 text-[0.74rem] text-faint">
                            {fill(d.minutes, { n: s.minutes })}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
