// URL builders.
//
// These are deliberately pure and content-free: they take the few fields they
// need (`slug`, `id`) rather than a whole `Lesson`, so a client component can
// build a link without importing the content tree. The tree lives in
// `content/`, which reads the lesson JSON from disk and must therefore stay on
// the server. Everything that links to a page imports from here instead.

/** The least a thing needs to have a lesson URL. */
export interface LessonRef {
  slug: string;
}

/** The least a thing needs to have a section URL. */
export interface SectionRef {
  id: string;
}

/** The site is served from the root, so URLs carry no locale prefix. */
export function homeHref(): string {
  return "/";
}

export function lessonHref(lesson: LessonRef): string {
  return `/lessons/${lesson.slug}`;
}

export function sectionHref(lesson: LessonRef, section: SectionRef): string {
  return `/lessons/${lesson.slug}/${section.id}`;
}

export function quizHref(lesson: LessonRef): string {
  return `/lessons/${lesson.slug}/quiz`;
}
