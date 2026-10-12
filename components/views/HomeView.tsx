import Link from "next/link";
import { RichText } from "@/components/kit";
import { getSubjects, lessonHref } from "@/content/registry";
import { fill, t } from "@/lib/i18n";

/**
 * The home page.
 *
 * The subject tree comes from the content registry and every string from the
 * dictionary in lib/i18n, so there is exactly one implementation of this page
 * and nothing below is hard-coded.
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

      {/* ---------------- subjects, courses, lessons ---------------- */}
      {subjects.map((subject) => (
        <section key={subject.slug} className="mt-9">
          <h2 className="font-serif text-[1.45rem] font-semibold text-ink">
            {subject.title}
          </h2>
          <p className="eyebrow mt-1">{subject.tagline}</p>
          <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-soft">
            {subject.description}
          </p>

          {subject.courses.map((course) => (
            <div key={course.id} className="mt-6">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-faint">
                {course.title}
              </h3>
              <div aria-hidden="true" className="mt-2 flex gap-1">
                {course.lessons.flatMap((l) =>
                  l.sections.map((s) => (
                    <span
                      key={`${l.slug}-${s.id}`}
                      data-tone={s.tone}
                      className="h-1.5 w-6 rounded-full bg-[color:var(--tone)]"
                    />
                  )),
                )}
              </div>
              <p className="mt-1 max-w-[60ch] text-[0.9rem] leading-relaxed text-ink-soft">
                {course.description}
              </p>

              <ul className="mt-4 space-y-3">
                {course.lessons.map((lesson) => {
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

                        <h4 className="mt-1 font-serif text-[1.2rem] leading-snug font-semibold text-ink">
                          {lesson.title}
                        </h4>
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
                              <span className="min-w-0 text-ink-soft">
                                {s.title}
                              </span>
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
            </div>
          ))}
        </section>
      ))}

      {/* ---------------- how to use ---------------- */}
      <section id="how-to-use" className="card-tone mt-9 rounded-xl border p-5 sm:p-6">
        <h2 className="font-serif text-[1.2rem] font-semibold text-ink">
          {d.howToUseTitle}
        </h2>
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
