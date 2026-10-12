"use client";

// One question, of any kind, played in place.
//
// Both the full quiz and the inline quick check need to ask a question, grade
// it, show the explanation and offer the next step. Keeping that in one
// component is what lets the quiz and the quick check stay thin and lets a
// new question kind (multiple-answer, true/false, numeric) be supported in a
// single place. The parent owns the sequence; this component owns one
// question's interaction and reports the result once.

import { useState } from "react";
import type {
  McqQuestion,
  MultiQuestion,
  NumericQuestion,
  Question,
  TrueFalseQuestion,
} from "@/content/types";
import { RichText } from "@/components/kit";
import { fill, optionLetters, t } from "@/lib/i18n";
import {
  answerText,
  isMultiCorrect,
  isNumericCorrect,
  questionKind,
} from "@/lib/questions";

export function QuestionCard({
  question,
  onResult,
  nextLabel,
  onNext,
}: {
  question: Question;
  /** Called once, when the learner commits an answer. */
  onResult: (correct: boolean) => void;
  nextLabel: string;
  onNext: () => void;
}) {
  const d = t();
  const kind = questionKind(question);

  const [choice, setChoice] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [tf, setTf] = useState<boolean | null>(null);
  const [numInput, setNumInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  function commit(ok: boolean) {
    if (submitted) return;
    setSubmitted(true);
    setCorrect(ok);
    onResult(ok);
  }

  function submitMcq(i: number) {
    if (submitted) return;
    setChoice(i);
    commit((question as McqQuestion).answer === i);
  }

  function submitTf(v: boolean) {
    if (submitted) return;
    setTf(v);
    commit((question as TrueFalseQuestion).answer === v);
  }

  function toggleMulti(i: number) {
    if (submitted) return;
    setMulti((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
  }

  function submitMulti() {
    if (submitted || multi.length === 0) return;
    commit(
      isMultiCorrect(question as MultiQuestion, multi),
    );
  }

  function submitNumeric() {
    if (submitted) return;
    const value = Number(numInput.replace(",", "."));
    commit(isNumericCorrect(question as NumericQuestion, value));
  }

  const marker = (i: number) => optionLetters[i] ?? String(i + 1);

  return (
    <div>
      <h2 className="mt-2 font-serif text-[1.25rem] leading-snug font-semibold text-ink sm:text-[1.4rem]">
        <RichText text={question.question} />
      </h2>

      {/* ---------------- interaction ---------------- */}
      {kind === "mcq" && (
        <ul className="mt-4 space-y-2">
          {(question as McqQuestion).options.map((opt, i) => {
            const isAnswer = i === (question as McqQuestion).answer;
            const isPicked = i === choice;
            let cls =
              "border-rule bg-surface text-ink hover:border-accent hover:bg-accent-light/40";
            if (submitted) {
              if (isAnswer) cls = "border-good bg-good-light text-ink";
              else if (isPicked) cls = "border-bad bg-bad-light text-ink";
              else cls = "border-rule bg-surface text-faint opacity-60";
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => submitMcq(i)}
                  disabled={submitted}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${cls}`}
                >
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current text-[0.8rem] font-bold">
                    {submitted && isAnswer ? (
                      <span aria-hidden="true">✓</span>
                    ) : submitted && isPicked ? (
                      <span aria-hidden="true">✕</span>
                    ) : (
                      marker(i)
                    )}
                  </span>
                  <span className="min-w-0 text-[0.97rem] leading-snug">
                    <RichText text={opt} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {kind === "multi" && (
        <>
          <p className="mt-3 text-[0.85rem] font-medium text-accent-dark">
            {d.selectAllThatApply}
          </p>
          <ul className="mt-2 space-y-2">
            {(question as MultiQuestion).options.map(
              (opt, i) => {
                const isAnswer =
                  (question as MultiQuestion).answers.includes(i);
                const isPicked = multi.includes(i);
                let cls =
                  "border-rule bg-surface text-ink hover:border-accent hover:bg-accent-light/40";
                if (submitted) {
                  if (isAnswer) cls = "border-good bg-good-light text-ink";
                  else if (isPicked) cls = "border-bad bg-bad-light text-ink";
                  else cls = "border-rule bg-surface text-faint opacity-60";
                }
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggleMulti(i)}
                      disabled={submitted}
                      aria-pressed={isPicked}
                      className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${cls}`}
                    >
                      <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current text-[0.8rem] font-bold">
                        {submitted ? (
                          isAnswer ? (
                            <span aria-hidden="true">✓</span>
                          ) : isPicked ? (
                            <span aria-hidden="true">✕</span>
                          ) : (
                            marker(i)
                          )
                        ) : isPicked ? (
                          <span aria-hidden="true">✓</span>
                        ) : (
                          marker(i)
                        )}
                      </span>
                      <span className="min-w-0 text-[0.97rem] leading-snug">
                        <RichText text={opt} />
                      </span>
                    </button>
                  </li>
                );
              },
            )}
          </ul>
          {!submitted && (
            <button
              type="button"
              onClick={submitMulti}
              disabled={multi.length === 0}
              className="mt-4 min-h-12 w-full rounded-lg bg-accent px-5 text-[1rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark disabled:opacity-40 sm:w-auto sm:px-8"
            >
              {d.submitAnswer}
            </button>
          )}
        </>
      )}

      {kind === "truefalse" && (
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {[true, false].map((v) => {
            const isAnswer = (question as TrueFalseQuestion).answer === v;
            const isPicked = tf === v;
            let cls =
              "border-rule bg-surface text-ink hover:border-accent hover:bg-accent-light/40";
            if (submitted) {
              if (isAnswer) cls = "border-good bg-good-light text-ink";
              else if (isPicked) cls = "border-bad bg-bad-light text-ink";
              else cls = "border-rule bg-surface text-faint opacity-60";
            }
            return (
              <button
                key={String(v)}
                type="button"
                onClick={() => submitTf(v)}
                disabled={submitted}
                className={`min-h-14 rounded-lg border px-4 text-[1.05rem] font-semibold transition-colors ${cls}`}
              >
                {v ? d.trueLabel : d.falseLabel}
              </button>
            );
          })}
        </div>
      )}

      {kind === "numeric" && (
        <div className="mt-4 flex flex-wrap items-stretch gap-2.5">
          <input
            type="text"
            inputMode="decimal"
            value={numInput}
            onChange={(e) => setNumInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitNumeric();
            }}
            disabled={submitted}
            placeholder={d.numericPlaceholder}
            aria-label={d.numericPlaceholder}
            className="min-h-12 w-full min-w-0 flex-1 rounded-lg border border-rule bg-surface px-4 text-[1rem] text-ink outline-none focus:border-accent sm:w-auto"
          />
          {(question as NumericQuestion).unit && (
            <span className="flex items-center px-1 font-mono text-[0.95rem] text-ink-soft">
              {(question as NumericQuestion).unit}
            </span>
          )}
          {!submitted && (
            <button
              type="button"
              onClick={submitNumeric}
              disabled={numInput.trim() === ""}
              className="min-h-12 rounded-lg bg-accent px-6 text-[1rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark disabled:opacity-40"
            >
              {d.submitAnswer}
            </button>
          )}
        </div>
      )}

      {/* ---------------- feedback ---------------- */}
      {submitted && (
        <div className="mt-5">
          <div
            className={`rounded-lg px-4 py-3 text-[0.97rem] font-semibold ${
              correct ? "bg-green-light text-green" : "bg-red-light text-red"
            }`}
          >
            {correct
              ? d.correct
              : kind === "mcq"
                ? fill(d.notQuite, {
                    letter: marker((question as McqQuestion).answer),
                  })
                : fill(d.notQuiteAnswer, { answer: answerText(question) })}
          </div>
          <div className="mt-3 rounded-lg border border-rule bg-surface p-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-accent">
              {d.why}
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">
              <RichText text={question.explanation} />
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="mt-4 min-h-12 w-full rounded-lg bg-accent px-5 text-[1rem] font-semibold text-on-accent transition-colors hover:bg-accent-dark"
          >
            {nextLabel}
          </button>
        </div>
      )}

      {!submitted && kind !== "mcq" && (
        <p className="mt-4 text-[0.85rem] text-faint">
          {kind === "multi"
            ? d.pickOptions
            : kind === "numeric"
              ? d.pickNumber
              : d.pickOption}
        </p>
      )}
      {!submitted && kind === "mcq" && (
        <p className="mt-5 text-[0.85rem] text-faint">{d.pickOption}</p>
      )}
    </div>
  );
}
