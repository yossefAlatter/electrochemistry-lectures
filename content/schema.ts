// The lesson file schema.
//
// A lesson is now authored as one JSON file under `content/lessons/`. That
// file is the only thing a lesson author writes; the components in
// `components/kit` and the templates in `components/templates` turn it into
// pages. This module is the single definition of what that file may contain,
// and it validates the file before anything is rendered.
//
// JSON cannot carry types, so a malformed file would otherwise fail far away
// from its cause - mid-render, or as a question whose `topicId` names no
// section. `parseLesson` moves every such failure to the build, with the file
// name and a path to the offending field in the message.

import type {
  Block,
  CalloutVariant,
  Constant,
  Lesson,
  Question,
  Section,
  SectionCta,
  Tone,
} from "./types";
import { TONES } from "./types";

/** A question as written in JSON. */
export type QuestionJson = Question;

/** A section as written in JSON. */
export type SectionJson = Section;

/**
 * The shape of one `content/lessons/*.json` file.
 *
 * It is a `Lesson` with two deliberate differences: the question bank is
 * called `questions` (it is prose, not an acronym), and `source` is the
 * optional chapter attribution shown on the lesson page.
 */
export interface LessonJson {
  slug: string;
  label: string;
  title: string;
  summary: string;
  source?: string;
  order: number;
  minutes: number;
  intro?: Block[];
  constants?: Constant[];
  sections: SectionJson[];
  questions: QuestionJson[];
}

const BLOCK_KINDS = new Set([
  "para",
  "heading",
  "formula",
  "figure",
  "table",
  "callout",
  "list",
  "worked",
]);

const CALLOUT_VARIANTS = new Set<CalloutVariant>([
  "key",
  "warn",
  "term",
  "note",
  "example",
]);

/** A build-time authoring error, carrying the file and the field path. */
export class LessonSchemaError extends Error {
  constructor(file: string, path: string, message: string) {
    super(`${file}: ${path}: ${message}`);
    this.name = "LessonSchemaError";
  }
}

function fail(file: string, path: string, message: string): never {
  throw new LessonSchemaError(file, path, message);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function reqString(
  file: string,
  path: string,
  v: unknown,
  { allowEmpty = false }: { allowEmpty?: boolean } = {},
): string {
  if (typeof v !== "string") fail(file, path, `expected a string, got ${typeof v}`);
  if (!allowEmpty && v.trim() === "") fail(file, path, "must not be empty");
  return v;
}

function optString(file: string, path: string, v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  return reqString(file, path, v);
}

function reqNumber(file: string, path: string, v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    fail(file, path, `expected a number, got ${typeof v}`);
  }
  return v;
}

function reqArray(file: string, path: string, v: unknown): unknown[] {
  if (!Array.isArray(v)) fail(file, path, "expected an array");
  return v;
}

function reqStringArray(
  file: string,
  path: string,
  v: unknown,
): string[] {
  const arr = reqArray(file, path, v);
  return arr.map((item, i) => reqString(file, `${path}[${i}]`, item));
}

/* ----------------------------------------------------------------- blocks --*/

function parseBlock(file: string, path: string, raw: unknown): Block {
  if (!isObject(raw)) fail(file, path, "expected a block object");
  const kind = raw.kind;
  if (typeof kind !== "string" || !BLOCK_KINDS.has(kind)) {
    fail(file, `${path}.kind`, `unknown block kind ${JSON.stringify(kind)}`);
  }

  switch (kind) {
    case "para":
      return { kind: "para", text: reqString(file, `${path}.text`, raw.text) };
    case "heading": {
      const level = raw.level;
      if (level !== undefined && level !== 2 && level !== 3) {
        fail(file, `${path}.level`, "must be 2 or 3");
      }
      return {
        kind: "heading",
        text: reqString(file, `${path}.text`, raw.text),
        level: level === 3 ? 3 : 2,
      };
    }
    case "formula":
      return {
        kind: "formula",
        tex: reqString(file, `${path}.tex`, raw.tex),
        caption: optString(file, `${path}.caption`, raw.caption),
      };
    case "figure":
      return {
        kind: "figure",
        src: reqString(file, `${path}.src`, raw.src),
        alt: reqString(file, `${path}.alt`, raw.alt),
        caption: reqString(file, `${path}.caption`, raw.caption),
      };
    case "table": {
      const head = reqStringArray(file, `${path}.head`, raw.head);
      const rows = reqArray(file, `${path}.rows`, raw.rows).map((row, r) => {
        const cells = reqStringArray(file, `${path}.rows[${r}]`, row);
        if (cells.length !== head.length) {
          fail(
            file,
            `${path}.rows[${r}]`,
            `has ${cells.length} cells but the head has ${head.length} columns`,
          );
        }
        return cells;
      });
      const widths = raw.widths;
      if (widths !== undefined && !Array.isArray(widths)) {
        fail(file, `${path}.widths`, "expected an array of numbers");
      }
      return { kind: "table", head, rows, widths: widths as number[] | undefined };
    }
    case "callout": {
      const variant = raw.variant;
      if (typeof variant !== "string" || !CALLOUT_VARIANTS.has(variant as CalloutVariant)) {
        fail(file, `${path}.variant`, `unknown callout variant ${JSON.stringify(variant)}`);
      }
      return {
        kind: "callout",
        variant: variant as CalloutVariant,
        title: reqString(file, `${path}.title`, raw.title, { allowEmpty: true }),
        body: reqString(file, `${path}.body`, raw.body),
      };
    }
    case "list": {
      const ordered = raw.ordered;
      if (ordered !== undefined && typeof ordered !== "boolean") {
        fail(file, `${path}.ordered`, "must be a boolean");
      }
      return {
        kind: "list",
        items: reqStringArray(file, `${path}.items`, raw.items),
        ordered: ordered === true ? true : undefined,
      };
    }
    case "worked": {
      const steps = reqStringArray(file, `${path}.steps`, raw.steps);
      if (steps.length === 0) fail(file, `${path}.steps`, "must have at least one step");
      return {
        kind: "worked",
        title: reqString(file, `${path}.title`, raw.title),
        given: reqString(file, `${path}.given`, raw.given),
        steps,
        result: reqString(file, `${path}.result`, raw.result),
      };
    }
    default:
      fail(file, `${path}.kind`, `unhandled block kind ${kind}`);
  }
}

/* --------------------------------------------------------------- sections --*/

function parseCta(file: string, path: string, raw: unknown): SectionCta {
  if (!isObject(raw)) fail(file, path, "expected a cta object");
  return {
    title: reqString(file, `${path}.title`, raw.title),
    body: reqString(file, `${path}.body`, raw.body),
    href: reqString(file, `${path}.href`, raw.href),
    linkLabel: reqString(file, `${path}.linkLabel`, raw.linkLabel),
    secondaryHref: optString(file, `${path}.secondaryHref`, raw.secondaryHref),
    secondaryLabel: optString(file, `${path}.secondaryLabel`, raw.secondaryLabel),
  };
}

function parseSection(file: string, path: string, raw: unknown): Section {
  if (!isObject(raw)) fail(file, path, "expected a section object");

  const tone = raw.tone;
  if (typeof tone !== "string" || !TONES.includes(tone as Tone)) {
    fail(
      file,
      `${path}.tone`,
      `must be one of ${TONES.join(", ")} (got ${JSON.stringify(tone)})`,
    );
  }

  const minutes = raw.minutes === undefined ? undefined : reqNumber(file, `${path}.minutes`, raw.minutes);

  const keyPoints =
    raw.keyPoints === undefined
      ? undefined
      : reqStringArray(file, `${path}.keyPoints`, raw.keyPoints);

  return {
    id: reqString(file, `${path}.id`, raw.id),
    tone: tone as Tone,
    title: reqString(file, `${path}.title`, raw.title),
    summary: reqString(file, `${path}.summary`, raw.summary),
    minutes,
    keyPoints,
    blocks: reqArray(file, `${path}.blocks`, raw.blocks).map((b, i) =>
      parseBlock(file, `${path}.blocks[${i}]`, b),
    ),
    cta: raw.cta === undefined ? undefined : parseCta(file, `${path}.cta`, raw.cta),
  };
}

/* -------------------------------------------------------------- questions --*/

function reqBoolean(file: string, path: string, v: unknown): boolean {
  if (typeof v !== "boolean") fail(file, path, `expected a boolean, got ${typeof v}`);
  return v;
}

function parseQuestion(file: string, path: string, raw: unknown): Question {
  if (!isObject(raw)) fail(file, path, "expected a question object");

  const kind = raw.kind === undefined ? "mcq" : raw.kind;
  if (
    kind !== "mcq" &&
    kind !== "multi" &&
    kind !== "truefalse" &&
    kind !== "numeric"
  ) {
    fail(file, `${path}.kind`, `unknown question kind ${JSON.stringify(kind)}`);
  }

  const id = reqString(file, `${path}.id`, raw.id);
  const topicId = reqString(file, `${path}.topicId`, raw.topicId);
  const explanation = reqString(file, `${path}.explanation`, raw.explanation);
  const question = reqString(file, `${path}.question`, raw.question);

  const quick = raw.quick;
  if (quick !== undefined && typeof quick !== "boolean") {
    fail(file, `${path}.quick`, "must be a boolean");
  }
  const quickFlag = quick === true ? true : undefined;

  switch (kind) {
    case "mcq": {
      const options = reqStringArray(file, `${path}.options`, raw.options);
      if (options.length !== 4) {
        fail(file, `${path}.options`, `must have exactly four options, got ${options.length}`);
      }
      const answer = reqNumber(file, `${path}.answer`, raw.answer);
      if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
        fail(file, `${path}.answer`, `must be an integer 0-3, got ${answer}`);
      }
      return { id, topicId, question, options, answer, explanation, quick: quickFlag };
    }

    case "multi": {
      const options = reqStringArray(file, `${path}.options`, raw.options);
      if (options.length < 2) {
        fail(file, `${path}.options`, `must have at least two options, got ${options.length}`);
      }
      const rawAnswers = reqArray(file, `${path}.answers`, raw.answers);
      if (rawAnswers.length === 0) {
        fail(file, `${path}.answers`, "must name at least one correct option");
      }
      const answers = rawAnswers.map((a, i) => {
        const n = reqNumber(file, `${path}.answers[${i}]`, a);
        if (!Number.isInteger(n) || n < 0 || n >= options.length) {
          fail(file, `${path}.answers[${i}]`, `must be an option index 0-${options.length - 1}`);
        }
        return n;
      });
      if (new Set(answers).size !== answers.length) {
        fail(file, `${path}.answers`, "must not repeat an option index");
      }
      return { kind: "multi", id, topicId, question, options, answers, explanation, quick: quickFlag };
    }

    case "truefalse":
      return {
        kind: "truefalse",
        id,
        topicId,
        question,
        answer: reqBoolean(file, `${path}.answer`, raw.answer),
        explanation,
        quick: quickFlag,
      };

    case "numeric": {
      const tolerance =
        raw.tolerance === undefined
          ? undefined
          : reqNumber(file, `${path}.tolerance`, raw.tolerance);
      if (tolerance !== undefined && tolerance <= 0) {
        fail(file, `${path}.tolerance`, "must be greater than zero");
      }
      return {
        kind: "numeric",
        id,
        topicId,
        question,
        answer: reqNumber(file, `${path}.answer`, raw.answer),
        tolerance,
        unit: optString(file, `${path}.unit`, raw.unit),
        explanation,
        quick: quickFlag,
      };
    }
  }
}

/* ---------------------------------------------------------------- lesson --*/

function parseConstant(file: string, path: string, raw: unknown): Constant {
  if (!isObject(raw)) fail(file, path, "expected a constant object");
  return {
    symbol: reqString(file, `${path}.symbol`, raw.symbol),
    name: reqString(file, `${path}.name`, raw.name),
    value: reqString(file, `${path}.value`, raw.value),
  };
}

/**
 * Validate one parsed JSON file and return the internal `Lesson`.
 *
 * `file` is the path shown in any error, so the message points at the real
 * file on disk rather than at the index of an array in a loader.
 */
export function parseLesson(file: string, raw: unknown): Lesson {
  if (!isObject(raw)) fail(file, "$", "the lesson must be a JSON object");

  const sections = reqArray(file, "sections", raw.sections).map((s, i) =>
    parseSection(file, `sections[${i}]`, s),
  );
  if (sections.length === 0) fail(file, "sections", "a lesson needs at least one section");

  const seenSectionIds = new Set<string>();
  for (const [i, s] of sections.entries()) {
    if (seenSectionIds.has(s.id)) {
      fail(file, `sections[${i}].id`, `duplicate section id ${JSON.stringify(s.id)}`);
    }
    seenSectionIds.add(s.id);
  }

  const questions = reqArray(file, "questions", raw.questions).map((q, i) =>
    parseQuestion(file, `questions[${i}]`, q),
  );

  for (const [i, q] of questions.entries()) {
    if (!seenSectionIds.has(q.topicId)) {
      fail(
        file,
        `questions[${i}].topicId`,
        `names no section in this lesson (${JSON.stringify(q.topicId)})`,
      );
    }
  }

  return {
    slug: reqString(file, "slug", raw.slug),
    label: reqString(file, "label", raw.label),
    title: reqString(file, "title", raw.title),
    summary: reqString(file, "summary", raw.summary),
    source: optString(file, "source", raw.source),
    order: reqNumber(file, "order", raw.order),
    minutes: reqNumber(file, "minutes", raw.minutes),
    intro:
      raw.intro === undefined
        ? undefined
        : reqArray(file, "intro", raw.intro).map((b, i) =>
            parseBlock(file, `intro[${i}]`, b),
          ),
    constants:
      raw.constants === undefined
        ? undefined
        : reqArray(file, "constants", raw.constants).map((c, i) =>
            parseConstant(file, `constants[${i}]`, c),
          ),
    sections,
    mcq: questions,
  };
}
