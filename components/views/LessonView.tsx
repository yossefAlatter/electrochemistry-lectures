import { notFound } from "next/navigation";
import { LessonTemplate } from "@/components/templates/LessonTemplate";
import { getRegistry } from "@/content/registry";

/**
 * The lesson overview: fetch the data, hand it to the fixed template.
 */
export default function LessonView({ slug }: { slug: string }) {
  const reg = getRegistry();

  const lesson = reg.getLesson(slug);
  if (!lesson) notFound();

  const prev = reg.prevLesson(slug);
  const next = reg.nextLesson(slug);
  const quickTotal = reg.countQuickChecks(lesson);
  const totalMinutes = lesson.sections.reduce(
    (n, s) => n + (s.minutes ?? 0),
    0,
  );

  const questionCountBySection: Record<string, number> = {};
  for (const s of lesson.sections) {
    questionCountBySection[s.id] = reg.questionsForSection(lesson, s.id).length;
  }

  return (
    <LessonTemplate
      lesson={lesson}
      prev={prev}
      next={next}
      quickTotal={quickTotal}
      totalMinutes={totalMinutes}
      questionCountBySection={questionCountBySection}
    />
  );
}
