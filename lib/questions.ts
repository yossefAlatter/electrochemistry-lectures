// Question helpers shared by the quiz, the quick check and the review list.
//
// Pure functions only: they run on the client, so they must not reach for the
// content loader or any server-only module. Grading lives here so that a
// numeric tolerance or a multi-select rule is defined exactly once.

import type {
  MultiQuestion,
  NumericQuestion,
  Question,
} from "@/content/types";

export type QuestionKind = "mcq" | "multi" | "truefalse" | "numeric";

/** The question's kind, treating the pre-`kind` MCQ form as `"mcq"`. */
export function questionKind(q: Question): QuestionKind {
  return q.kind ?? "mcq";
}

/**
 * The tolerance for a numeric question: the explicit value if given,
 * otherwise 2% of the answer (so a value quoted to about two or three
 * significant figures is accepted) with a small absolute floor for answers
 * near zero.
 */
export function numericTolerance(q: NumericQuestion): number {
  if (q.tolerance !== undefined) return q.tolerance;
  return Math.max(1e-9, Math.abs(q.answer) * 0.02);
}

/** Whether a typed number is within tolerance of the expected answer. */
export function isNumericCorrect(q: NumericQuestion, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  return Math.abs(value - q.answer) <= numericTolerance(q);
}

/** Whether a chosen set of indices exactly equals the correct set. */
export function isMultiCorrect(q: MultiQuestion, choices: number[]): boolean {
  const want = [...q.answers].sort((a, b) => a - b);
  const got = [...new Set(choices)].sort((a, b) => a - b);
  return want.length === got.length && want.every((v, i) => v === got[i]);
}

/** A human-readable statement of the correct answer, for the review list. */
export function answerText(q: Question): string {
  switch (questionKind(q)) {
    case "mcq":
      return (q as { options: string[]; answer: number }).options[
        (q as { answer: number }).answer
      ];
    case "multi": {
      const m = q as MultiQuestion;
      return m.answers.map((i) => m.options[i]).join("; ");
    }
    case "truefalse":
      return (q as { answer: boolean }).answer ? "True" : "False";
    case "numeric": {
      const n = q as NumericQuestion;
      return `${n.answer}${n.unit ? ` ${n.unit}` : ""}`;
    }
  }
}
