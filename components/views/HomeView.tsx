import Link from "next/link";
import { courseHref, getSubjects, lessonHref } from "@/content/registry";
import { fill, t } from "@/lib/i18n";

/**
 * The home page.
 *
 * It lists the courses, one card each, and nothing deeper: a course card is the
 * entry point, and the lessons inside it live on the course page. The tree and
 * every string come from the registry and the dictionary, so this page has one
 * implementation and nothing below is hard-coded.
 */
export default function HomeView() {
  const subjects = getSubjects();
  const d = t();

  const allLessons = subjects.flatMap((s) =>
    s.courses.flatMap((c) => c.lessons),
  );
  const totalQuestions = allLessons.reduce((n, l) => n + l.mcq.length, 0);
  const totalSections = allLessons.reduce((n, l) => n + l.sections.length, 0);
  const start = allLessons[0];

  return (
    <div className="pb-10">
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden rounded-2xl border border-rule bg-surface px-5 py-9 sm:px-9 sm:py-11">
        {/* a whisper of the accent washes behind the headline, far quieter
            than the old navy gradient and matched to the section tones */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -end-24 h-80 w-80 rounded-full bg-[color:var(--tone-azure-soft)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -start-20 h-80 w-80 rounded-full bg-[color:var(--tone-violet-soft)] blur-3xl"
        />

        <div className="relative">
          <p className="eyebrow">{d.siteAuthorLine}</p>
          <h1 className="mt-3 max-w-[16ch] font-serif text-[2.15rem] leading-[1.08] font-semibold tracking-tight text-ink sm:text-[2.9rem]">
            {d.homeLedeLead}{" "}
            <span className="text-[color:var(--tone)]">{d.homeLedeRest}</span>
          </h1>
          <p className="mt-4 max-w-[54ch] text-[1.04rem] leading-relaxed text-ink-soft">
            {d.homeSub}
          </p>

          <dl className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-rule rounded-xl border border-rule bg-surface-2/70">
            {[
              [String(allLessons.length), d.statLessons],
              [String(totalSections), d.statSections],
              [String(totalQuestions), d.statQuestions],
            ].map(([n, l]) => (
              <div key={l} className="px-3 py-4 text-center">
                <dt className="numeral text-[1.5rem] leading-none font-semibold text-ink">
                  {n}
                </dt>
                <dd className="mt-1.5 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-faint">
                  {l}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {start && (
              <Link
                href={lessonHref(start)}
                className="inline-flex min-h-12 items-center rounded-lg bg-[color:var(--tone)] px-5 text-[0.95rem] font-semibold text-on-accent shadow-sm transition-all hover:opacity-90 hover:shadow-md"
              >
                {d.startFromZero}
                <span aria-hidden="true" className="ms-1.5 flow-arrow">
                  →
                </span>
              </Link>
            )}
            <Link
              href="#how-to-use"
              className="inline-flex min-h-12 items-center rounded-lg border border-rule bg-surface px-5 text-[0.95rem] font-semibold text-ink-soft transition-colors hover:border-[color:var(--tone)] hover:text-[color:var(--tone)]"
            >
              {d.howToUseTitle}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- courses ---------------- */}
      {subjects.map((subject) => (
        <section key={subject.slug} className="mt-9">
          <h2 className="font-serif text-[1.45rem] font-semibold text-ink">
            {subject.title}
          </h2>
          <p className="eyebrow mt-1">{subject.tagline}</p>
          <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-soft">
            {subject.description}
          </p>

          <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-faint">
            {d.coursesHeading}
          </p>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {subject.courses.map((course) => {
              const lessons = course.lessons;
              const sections = lessons.reduce(
                (n, l) => n + l.sections.length,
                0,
              );
              const questions = lessons.reduce((n, l) => n + l.mcq.length, 0);
              const minutes = lessons.reduce(
                (n, l) =>
                  n + l.sections.reduce((m, s) => m + (s.minutes ?? 0), 0),
                0,
              );
              const tones = [
                ...new Set(
                  lessons.flatMap((l) => l.sections.map((s) => s.tone)),
                ),
              ].slice(0, 12);

              return (
                <li key={course.id} className="h-full">
                  <Link
                    href={courseHref(course)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                  >
                    <div aria-hidden="true" className="mb-3 flex flex-wrap gap-1">
                      {tones.map((tone) => (
                        <span
                          key={tone}
                          data-tone={tone}
                          className="h-1.5 w-7 rounded-full bg-[color:var(--tone)]"
                        />
                      ))}
                    </div>

                    <h3 className="font-serif text-[1.35rem] leading-snug font-semibold text-ink">
                      {course.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.93rem] leading-relaxed text-ink-soft">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-faint tabular-nums">
                      <span>{fill(d.courseLessons, { n: lessons.length })}</span>
                      <span>{fill(d.lessonSectionsCount, { n: sections })}</span>
                      <span>{fill(d.lessonQuestions, { n: questions })}</span>
                      {minutes > 0 && (
                        <span>{fill(d.lessonMinTotal, { n: minutes })}</span>
                      )}
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-accent">
                      {d.openCourse}
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {/* ---------------- how to use ---------------- */}
      <section id="how-to-use" className="card-tone mt-9 rounded-xl border p-5 sm:p-6">
        <h2 className="font-serif text-[1.2rem] font-semibold text-ink">
          {d.howToUseTitle}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-soft">
          {d.browseCarefully}
        </p>
        <ol className="mt-3 space-y-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
          {[d.howStep1, d.howStep2, d.howStep3, d.howStep4].map((step, i) => (
            <li key={i}>
              <span className="font-semibold text-ink">{i + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
