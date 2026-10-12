// Content model for the site.
//
// Everything the site displays is hard-coded in `content/`. There is no
// database and no fetch at runtime. Adding material means adding a file and
// one line to content/index.ts - see ADDING_A_LESSON.md.
//
// The nesting is:
//
//   Subject   -> a subject area, e.g. "Physical Chemistry"
//     Course  -> a group of lessons, e.g. "Electrochemistry"
//       Lesson -> e.g. "Lesson 1", has its own question bank
//         Section -> one routable page, e.g. "/lessons/lesson-1/nernst"
//
// Sections are the unit you actually study: each is its own short page with
// its own Next / Previous buttons and its own quick check, so no single page
// ever gets long.

/** A run of body text. `text` may contain **bold**, *italic*, `code`. */
export interface Paragraph {
  kind: "para";
  text: string;
}

/**
 * A subheading inside a section.
 *
 * A section is normally a flat argument with no headings of its own, so its
 * only "sub-headings" used to be a callout's title and a worked example's
 * title. A heading block lets a longer section be broken into labelled parts,
 * and it is picked up by the in-page table of contents like the others, so a
 * reader can jump straight to the part they came for.
 */
export interface Heading {
  kind: "heading";
  text: string;
  /** 2 = major part (default), 3 = minor part. */
  level?: 2 | 3;
}

/** Display maths, written in LaTeX and rendered with KaTeX. */
export interface Formula {
  kind: "formula";
  tex: string;
  /** Optional plain-English reading, e.g. "Levich equation, current density". */
  caption?: string;
}

/** An illustration from public/figures. */
export interface Figure {
  kind: "figure";
  /** File name inside public/figures, e.g. "cell_anatomy.png". */
  src: string;
  caption: string;
  /** Required: describe the image for screen readers. */
  alt: string;
}

/** A data table. `widths` is optional; columns are sized automatically. */
export interface Table {
  kind: "table";
  head: string[];
  rows: string[][];
  /** Optional relative column weights, e.g. [2, 1, 1]. */
  widths?: number[];
}

/**
 * The kinds of highlighted box. `key`, `warn` and `term` are the three the
 * course already used; `note` and `example` are additive so a template can
 * mark a side note or a concrete example without pretending it is a rule.
 */
export type CalloutVariant = "key" | "warn" | "term" | "note" | "example";

/** A highlighted box. */
export interface Callout {
  kind: "callout";
  variant: CalloutVariant;
  title: string;
  body: string;
}

/** A bulleted or numbered list. */
export interface ListBlock {
  kind: "list";
  items: string[];
  ordered?: boolean;
}

/** A short worked calculation, rendered as numbered steps. */
export interface Worked {
  kind: "worked";
  title: string;
  given: string;
  steps: string[];
  result: string;
}

export type Block =
  | Paragraph
  | Heading
  | Formula
  | Figure
  | Table
  | Callout
  | ListBlock
  | Worked;

/** A closing call-to-action at the bottom of a section. */
export interface SectionCta {
  title: string;
  body: string;
  /** Where the button goes, usually the next lesson. */
  href: string;
  linkLabel: string;
  /** Optional smaller second link, e.g. back to the section index. */
  secondaryHref?: string;
  secondaryLabel?: string;
}

/**
 * One topic within a lesson. A section is a page in its own right, so it is
 * kept short on purpose.
 */
/** The nine reusable accent hues, one per topic. See app/globals.css. */
export const TONES = [
  "azure",
  "indigo",
  "violet",
  "rose",
  "coral",
  "amber",
  "emerald",
  "teal",
  "slate",
] as const;

export type Tone = (typeof TONES)[number];

export interface Section {
  /** URL segment and the anchor used by MCQs; unique inside the lesson. */
  id: string;
  title: string;
  /**
   * Accent hue for this topic. It follows the section through the sidebar,
   * the cards, its heading and its callouts, so a topic keeps one colour
   * everywhere. Adjacent sections are given different tones.
   */
  tone: Tone;
  /** One-line summary shown on section cards and in the sidebar. */
  summary: string;
  /** Rough reading time for this section alone, in minutes. */
  minutes?: number;
  /** Bullet points worth memorising. */
  keyPoints?: string[];
  blocks: Block[];
  /** Rendered as a highlighted panel at the very bottom of the section. */
  cta?: SectionCta;
}

/**
 * Fields every question carries, whatever its kind. A question always belongs
 * to a section (`topicId`) and always explains itself, so the review list and
 * the per-topic filter work uniformly across every type.
 */
export interface QuestionBase {
  id: string;
  /** Section id this question belongs to; powers per-topic filtering. */
  topicId: string;
  explanation: string;
  /**
   * Set on a small number of questions per section. These are the ones shown
   * in the inline "Quick check" at the bottom of the section page, so keep
   * them short and unambiguous - a learner meets them with no timer.
   */
  quick?: boolean;
}

/** The classic four-option single-answer question. */
export interface McqQuestion extends QuestionBase {
  kind?: "mcq";
  question: string;
  /** Exactly four options for the standard quiz. */
  options: string[];
  /** Index of the correct option. */
  answer: number;
}

/** Choose every option that applies. Two or more options, at least one answer. */
export interface MultiQuestion extends QuestionBase {
  kind: "multi";
  question: string;
  options: string[];
  /** Indices of the correct options; must be non-empty and within range. */
  answers: number[];
}

/** Judge a single statement true or false. */
export interface TrueFalseQuestion extends QuestionBase {
  kind: "truefalse";
  question: string;
  answer: boolean;
}

/** Enter a number; graded within a tolerance. */
export interface NumericQuestion extends QuestionBase {
  kind: "numeric";
  question: string;
  answer: number;
  /**
   * Allowed absolute error. Defaults to a value derived from the answer, so a
   * number written to three significant figures is accepted.
   */
  tolerance?: number;
  /** Unit to show after the input, e.g. "V" or "mol dm⁻³". */
  unit?: string;
}

/**
 * Every question on the site is one of these. The `kind` discriminates the
 * union and is absent only on the original `mcq` form, which predates the
 * other kinds; treat a missing `kind` as `"mcq"`.
 */
export type Question =
  | McqQuestion
  | MultiQuestion
  | TrueFalseQuestion
  | NumericQuestion;

/** Back-compat alias for the original name of the single-answer question. */
export type Mcq = McqQuestion;

/** Constants and other numbers the site shows in a "reference" panel. */
export interface Constant {
  symbol: string;
  name: string;
  value: string;
}

export interface Lesson {
  /** URL segment, unique across the whole site. */
  slug: string;
  /** Sidebar label, e.g. "Lesson 1". */
  label: string;
  title: string;
  summary: string;
  /**
   * Optional chapter attribution, e.g. "Bagotsky ch.6, Bard & Faulkner ch.3".
   * Purely informational: it tells a reader which book chapters the lesson
   * follows, and never quotes either book.
   */
  source?: string;
  /** Sidebar / card ordering. Lowest first. */
  order: number;
  /** Approximate reading time for the whole lesson, in minutes. */
  minutes: number;
  /** Shown on the lesson overview page, above the section list. */
  intro?: Block[];
  sections: Section[];
  mcq: Question[];
  constants?: Constant[];
}

/** A group of lessons in the sidebar, e.g. "Electrochemistry". */
export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

/**
 * A subject area. The site is named after the first one, but others are
 * expected: add a Subject and the home page, sidebar and routes pick it up.
 */
export interface Subject {
  /** URL segment, e.g. "physical-chemistry". */
  slug: string;
  /** Short name for cards and the sidebar, e.g. "Physical Chemistry". */
  title: string;
  /** One line under the title. */
  tagline: string;
  /** Longer text for the subject's own page. */
  description: string;
  courses: Course[];
}