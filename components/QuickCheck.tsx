"use client";

// The "Quick check" that closes every section page: a few questions answered
// in place, with the explanation shown the moment you commit. It is
// deliberately smaller than the full quiz - two or three questions, one at a
// time, no timer - so that finishing a section feels like finishing a
// section. The interaction for each question (of any kind) is shared with the
// quiz through `QuestionCard`.

import { useState } from "react";
import type { Question } from "@/content/types";
import { fill, t } from "@/lib/i18n";
import { QuestionCard } from "@/components/QuestionCard";

export default function QuickCheck({
  questions,
  sectionTitle,
}: {
  questions: Question[];
  sectionTitle: string;
}) {
  const d = t();
  const [at, setAt] = useState(0);
  const [got, setGot] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  if (questions.length === 0) return null;

  const q = questions[at];
  const right = got.filter(Boolean).length;

  function next() {
    if (at + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setAt((n) => n + 1);
  }

  function restart() {
    setAt(0);
    setGot([]);
    setDone(false);
  }

  const pct = Math.round((100 * right) / questions.length);

  return (
    <section
      aria-labelledby="quickcheck"
      className="card-tone no-print mt-10 rounded-xl border p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2
          id="quickcheck"
          className="font-serif text-[1.15rem] font-semibold text-ink"
        >
          {d.qcTitle}
        </h2>
        <span className="sr-only">{fill(d.qcOn, { title: sectionTitle })}</span>
        <span className="text-[0.78rem] text-faint">
          {done
            ? fill(d.qcScore, { right, n: questions.length })
            : fill(d.qcQuestionOf, { i: at + 1, n: questions.length })}
        </span>
      </div>

      {done ? (
        <div className="mt-4">
          <p className="numeral text-[1.9rem] leading-none font-semibold text-[color:var(--tone)]">
            {right}/{questions.length}
          </p>
          <div
            className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rule"
            role="img"
            aria-label={fill(d.qcPercentAria, { p: pct })}
          >
            <div
              className="h-full rounded-full bg-[color:var(--tone)] transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
            {right === questions.length
              ? d.qcAllCorrect
              : fill(d.qcReread, { title: sectionTitle })}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-rule bg-surface px-4 text-[0.9rem] font-semibold text-ink-soft transition-colors hover:border-[color:var(--tone)] hover:text-[color:var(--tone)]"
          >
            {d.tryAgain}
          </button>
        </div>
      ) : (
        <div className="mt-3.5">
          <QuestionCard
            key={q.id}
            question={q}
            onResult={(ok) => setGot((g) => [...g, ok])}
            nextLabel={at + 1 >= questions.length ? d.seeResult : d.nextQuestion}
            onNext={next}
          />
        </div>
      )}
    </section>
  );
}
