// The site's user-visible strings.
//
// The site is English-only, and every string that is not lesson content -
// labels, navigation, quiz chrome, aria text - lives here, so the UI wording
// is one editable place rather than something repeated across components.
// Call sites ask for the dictionary with a zero-argument `t()` and fill in
// `{placeholder}` values with `fill()`.

/**
 * Option markers for MCQs. An explanation that says "the answer is B" and the
 * marker on the button have to name the same option.
 */
export const optionLetters: readonly string[] = ["A", "B", "C", "D"];

/* ------------------------------------------------------------------ strings --*/

const en = {
  siteTitle: "Physical Chemistry",
  siteTagline: "Postgraduate",
  siteAuthorLine: "Postgraduate · Yossef Hafez Alatter",

  navOpen: "Open navigation",
  navClose: "Close navigation",
  navCourseNavigation: "Course navigation",
  navAllQuestions: "All questions",
  navSectionNavigation: "Section navigation",
  navHowBuiltTitle: "How this site is built",
  navHowBuiltBody:
    "Every lesson is a short set of section pages, each ending in its own quick check. Content is stored in the project files, so a correction lands on every copy at once.",
  navSecondAuthor: "Abla Hathout",
  navHome: "Home",

  switchLanguage: "Switch language",
  switchTo: "Switch to {name}",

  homeLedeLead: "Physical chemistry,",
  homeLedeRest: "one short section at a time.",
  homeSub:
    "Nothing here is a wall of text. Every topic is a page you can finish in a few minutes, with a clear explanation, the key points to remember, and three questions answered on the spot.",
  statLessons: "Lessons",
  statSections: "Sections",
  statQuestions: "Questions",
  startFromZero: "Start from zero",
  howToUseTitle: "How to use this site",
  howStep1:
    "Begin with Lesson 0. It is a short orientation and assumes nothing.",
  howStep2:
    "Read one section, then use the Next button. Never two screens at once.",
  howStep3:
    "Answer the three quick checks at the bottom before moving on. The explanation tells you which paragraph to reread if you got one wrong.",
  howStep4:
    "Only then try the full quiz, which mixes every section together.",

  lessonSectionsCount: "{n} short sections",
  lessonMinTotal: "{n} min total",
  lessonQuestions: "{n} questions",
  startReading: "Start reading",
  continueReading: "Continue reading",
  allQuestionsLink: "All {n} questions",
  sectionsHeading: "Sections",
  quickChecks: "{n} quick checks",
  quickCheckOne: "{n} quick check",
  inQuiz: "{n} in quiz",
  readLink: "Read →",
  constantsHeading: "Constants you will need",
  cardMeta: "{n} sections · {m} min · {k} questions",
  breadcrumbAria: "Breadcrumb",
  sectionNavAria: "Section navigation",
  quizMetaDesc: "Multiple choice questions on {title}.",

  quickTotalTitle: "{a} quick checks, {b} questions in total",
  quickTotalBody:
    "Every section ends with three questions answered on the spot. When you want the whole bank at once, including everything shuffled into one sitting, take the full quiz.",
  takeFullQuiz: "Take the full quiz",
  prev: "← Previous",
  next: "Next →",
  lessonNotFound: "Lesson not found",
  quizNotFound: "Quiz not found",
  sectionNotFound: "Section not found",

  sectionOf: "Section {i} of {n}",
  minutes: "{n} min",
  worthMemorising: "Remember this",
  bankCovers: "{n} questions in the full bank cover this topic.",
  openAll: "Open all {n}",
  contents: "← Contents",
  allSectionsOf: "All {n} sections of {label}",
  finish: "Finish →",
  backToContents: "Back to {label} contents",

  keyIdea: "Key idea",
  commonPitfall: "Common pitfall",
  terminology: "Terminology",
  calloutNote: "Note",
  calloutExample: "Example",
  workedExample: "Worked example",
  given: "Given",

  /* reading chrome: progress, in-page navigation, comfort controls */
  onThisPage: "On this page",
  inThisLesson: "In this lesson",
  backToTop: "Back to top",
  contentsButton: "Contents",
  contentsAria: "Contents of this section",
  increaseText: "Increase text size",
  decreaseText: "Decrease text size",

  quizLoading: "Loading the quiz…",
  quizTitle: "Quiz: {title}",
  quizLede:
    "{n} questions, one at a time. You get the explanation as soon as you commit to an answer, so read every one — including the ones you got right.",
  testSingleTopic: "Test a single topic",
  startWithAll: "Start with all {n} questions",
  finishedLabel: "{label} · finished",
  yourScore: "Your score",
  scoreHigh: "Solid. Reread only the explanations you disagreed with.",
  scoreMid: "Halfway there. The explanations below are where the marks are.",
  scoreLow:
    "Work through the notes again, then retake it. The explanations matter more than the score.",
  correct: "Correct.",
  notQuite: "Not quite — the answer is {letter}.",
  notQuiteAnswer: "Not quite — the correct answer is {answer}.",
  why: "Why",
  nextQuestion: "Next question",
  seeScore: "See your score",
  seeResult: "See result",
  pickOption: "Pick an option to see the explanation.",
  pickOptions: "Select every correct option, then submit.",
  pickNumber: "Type a number, then submit.",
  selectAllThatApply: "Select all that apply.",
  submitAnswer: "Submit answer",
  trueLabel: "True",
  falseLabel: "False",
  numericPlaceholder: "Type a number",
  notes: "Notes",

  qcTitle: "Quick check",
  qcOn: "on {title}",
  qcScore: "{right} of {n} correct",
  qcQuestionOf: "Question {i} of {n}",
  qcPercentAria: "{p} per cent correct",
  qcAllCorrect:
    "All correct. The explanation still matters - it is the wording you will meet in the full quiz.",
  qcReread:
    "Reread the {title} section for the ones you missed, then try again.",
  tryAgain: "Try again",
  correctShort: "✓ Correct.",
  notCorrectShort: "✗ Not correct.",

  themeToLight: "Switch to light theme",
  themeToDark: "Switch to dark theme",

  pwaOfflineTitle: "You are offline",
  pwaOfflineBody:
    "This page has not been saved for offline use yet. Anything you have already read is still available from the sidebar.",
  pwaBackHome: "Back to the home page",
  pwaOfflineNote:
    "The whole site is downloaded when it is installed, so every lesson should be readable without a connection.",
} as const;

export type Dict = { -readonly [K in keyof typeof en]: string };

/** The one dictionary: every UI string on the site. */
export function t(): Dict {
  return en;
}

/** Substitute {placeholders} in a dictionary string. */
export function fill(
  s: string,
  vars: Record<string, string | number> = {},
): string {
  return s.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
}
