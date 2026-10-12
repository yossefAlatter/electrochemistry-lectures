"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Lesson, Question } from "@/content/types";
import { lessonHref } from "@/lib/links";
import { fill, t } from "@/lib/i18n";
import { RichText } from "@/components/kit";
import { QuestionCard } from "@/components/QuestionCard";
import { answerText } from "@/lib/questions";

type Phase = "intro" | "quiz" | "results";

/** Fisher-Yates. Called from event handlers only, never during render. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * One question at a time. That is the right shape for a phone: it fits
 * without scrolling, the tap targets stay large, and each answer gets its
 * own full-width row. Progress is kept in component state so the page stays
 * a server component.
 */
export function Quiz({ lesson }: { lesson: Lesson }) {
  const d = t();
  const params = useSearchParams();
  const topicParam = params.get("topic");

  const sections = lesson.sections;
  // the pool is derived from the URL, so it is safe to compute during render
  const pool = useMemo<Question[]>(
    () =>
      topicParam
        ? lesson.mcq.filter((q) => q.topicId === topicParam)
        : lesson.mcq,
    [lesson.mcq, topicParam],
  );

  // the order is shuffled when the quiz starts, not during render: render
  // must stay pure, and Math.random must not be called there
  const [live, setLive] = useState<Question[]>(pool);
  const [phase, setPhase] = useState<Phase>("intro");
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const current = live[at];
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;

  function start() {
    setLive(shuffle(pool));
    setAnswers({});
    setAt(0);
    setPhase("quiz");
  }

  function reset(to = 0) {
    setAt(to);
  }

  function next() {
    if (at + 1 < live.length) {
      reset(at + 1);
    } else {
      setPhase("results");
      window.scrollTo({ top: 0 });
    }
  }

  // ------------------------- intro -------------------------
  if (phase === "intro") {
    const counts = sections
      .map((s) => ({
        id: s.id,
        title: s.title,
        n: lesson.mcq.filter((q) => q.topicId === s.id).length,
      }))
      .filter((s) => s.n > 0);

    return (
      <div className="pb-10">
        <header className="border-b border-rule pb-5">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-accent">
            {lesson.label}
          </p>
          <h1 className="mt-1.5 font-serif text-[1.7rem] leading-tight font-semibold text-ink sm:text-[2.1rem]">
            {fill(d.quizTitle, { title: lesson.title })}
          </h1>
          <p className="mt-2 max-w-[58ch] text-[1rem] leading-relaxed text-ink-soft">
            {fill(d.quizLede, { n: pool.length })}
          </p>
        </header>

        <div className="mt-6">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-faint">
            {d.testSingleTopic}
          </p>
          <ul className="mt-2 space-y-1.5">
            {counts.map((s) => (
              <li key={s.id}>
                <Link
                  href={`?topic=${s.id}`}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-rule bg-surface px-3.5 py-2.5 transition-colors hover:border-accent hover:bg-accent-light/40"
                >
                  <span className="text-[0.93rem] text-ink-soft">{s.title}</span>
                  <span className="shrink-0 text-[0.8rem] font-semibold text-faint tabular-nums">
                    {s.n}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={start}
          className="mt-7 min-h-12 w-full rounded-lg bg-accent px-5 text-[1rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark sm:w-auto"
        >
          {fill(d.startWithAll, { n: pool.length })}
        </button>
      </div>
    );
  }

  // ------------------------- results -------------------------
  if (phase === "results") {
    const pct = answered ? Math.round((100 * correct) / answered) : 0;
    // full class names, not interpolated: Tailwind only sees literal strings
    const toneClass =
      pct >= 80
        ? "text-green"
        : pct >= 50
          ? "text-gold"
          : "text-red";
    const message =
      pct >= 80 ? d.scoreHigh : pct >= 50 ? d.scoreMid : d.scoreLow;

    const missed = live.filter((q) => answers[q.id] === false);
    const unseen = live.filter((q) => !(q.id in answers));

    return (
      <div className="pb-10">
        <header className="border-b border-rule pb-5">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-accent">
            {fill(d.finishedLabel, { label: lesson.label })}
          </p>
          <h1 className="mt-1.5 font-serif text-[1.7rem] leading-tight font-semibold text-ink sm:text-[2.1rem]">
            {d.yourScore}
          </h1>
        </header>

        <div className="mt-5 rounded-xl border border-rule bg-surface p-5 text-center">
          <p className={`font-serif text-[3.2rem] leading-none font-semibold ${toneClass}`}>
            {correct}
            <span className="text-[1.6rem] text-faint">/{answered}</span>
          </p>
          <p className="mt-1.5 text-[1.05rem] font-semibold text-ink">{pct}%</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-ink-soft">
            {message}
          </p>

          <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-tint">
            <div
              className="bg-green"
              style={{ width: `${answered ? (100 * correct) / answered : 0}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[0.78rem] text-faint">
            <span>{correct} correct</span>
            <span>{answered - correct} to review</span>
          </div>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={start}
            className="min-h-12 rounded-lg bg-accent px-5 text-[0.98rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark"
          >
            Try again
          </button>
          <Link
            href={lessonHref(lesson)}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-rule bg-surface px-5 text-[0.98rem] font-semibold text-ink-soft transition-colors hover:border-accent"
          >
            Back to the notes
          </Link>
        </div>

        {unseen.length > 0 && (
          <p className="mt-5 text-[0.88rem] text-faint">
            {unseen.length} question{unseen.length === 1 ? "" : "s"} not
            reached.
          </p>
        )}

        {missed.length > 0 && (
          <section className="mt-7">
            <h2 className="font-serif text-[1.25rem] font-semibold text-ink">
              Review these {missed.length}
            </h2>
            <ul className="mt-3 space-y-3">
              {missed.map((q) => {
                const section = sections.find((s) => s.id === q.topicId);
                return (
                  <li
                    key={q.id}
                    className="rounded-lg border border-bad/25 bg-bad-light/50 p-4"
                  >
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-bad">
                      {section?.title ?? q.topicId}
                    </p>
                    <p className="mt-1.5 text-[0.97rem] font-medium text-ink">
                      <RichText text={q.question} />
                    </p>
                    <p className="mt-2 text-[0.93rem] text-ink-soft">
                      <span className="font-semibold text-green">
                        Correct: {answerText(q)}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
                      {q.explanation}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {missed.length === 0 && answered > 0 && (
          <p className="mt-7 rounded-lg bg-good-light px-4 py-3 text-[0.95rem] text-good">
            Full marks. Nothing to review, but skim the explanations anyway.
          </p>
        )}
      </div>
    );
  }

  // ------------------------- question -------------------------
  if (!current) return null;

  const section = sections.find((s) => s.id === current.topicId);
  const pct = ((at + 1) / live.length) * 100;

  return (
    <div className="pb-10">
      {/* progress */}
      <div className="sticky top-[3.4rem] z-30 -mx-4 mb-5 border-b border-rule bg-tint/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <div className="flex items-center justify-between gap-3 text-[0.8rem]">
          <span className="font-semibold text-ink tabular-nums">
            Question {at + 1}{" "}
            <span className="font-normal text-faint">of {live.length}</span>
          </span>
          <span className="text-faint tabular-nums">
            {correct}/{answered} correct
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-rule/60">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-[0.7rem] font-bold uppercase tracking-[0.13em] text-accent">
        {section?.title ?? current.topicId}
      </p>

      <QuestionCard
        key={current.id}
        question={current}
        onResult={(ok) => setAnswers((a) => ({ ...a, [current.id]: ok }))}
        nextLabel={at + 1 < live.length ? d.nextQuestion : d.seeScore}
        onNext={next}
      />

      <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-[0.86rem]">
        <button
          type="button"
          onClick={() => reset(Math.max(0, at - 1))}
          disabled={at === 0}
          className="min-h-11 px-1 font-medium text-accent-dark disabled:opacity-35"
        >
          {d.prev}
        </button>
        <Link
          href={`/lessons/${lesson.slug}`}
          className="min-h-11 py-2.5 text-faint hover:text-ink-soft"
        >
          {d.notes}
        </Link>
      </div>
    </div>
  );
}