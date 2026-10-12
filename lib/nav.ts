// The slim navigation model.
//
// The sidebar only needs slugs, labels, titles and tones. Passing the whole
// content tree to it would ship every lesson's prose and every question to the
// browser, so the server flattens the tree to this shape once and hands it to
// the client shell as props. The type-only import of `Subject` keeps `content`
// out of the client bundle entirely.

import type { Subject, Tone } from "@/content/types";

export interface NavSection {
  id: string;
  title: string;
  tone: Tone;
}

export interface NavLesson {
  slug: string;
  label: string;
  sections: NavSection[];
}

export interface NavCourse {
  id: string;
  title: string;
  lessons: NavLesson[];
}

export interface NavSubject {
  slug: string;
  title: string;
  courses: NavCourse[];
}

/** Flatten the content tree into just what the sidebar renders. */
export function buildNav(subjects: readonly Subject[]): NavSubject[] {
  return subjects.map((subject) => ({
    slug: subject.slug,
    title: subject.title,
    courses: subject.courses.map((course) => ({
      id: course.id,
      title: course.title,
      lessons: course.lessons.map((lesson) => ({
        slug: lesson.slug,
        label: lesson.label,
        sections: lesson.sections.map((section) => ({
          id: section.id,
          title: section.title,
          tone: section.tone,
        })),
      })),
    })),
  }));
}
