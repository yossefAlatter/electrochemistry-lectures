import { notFound } from "next/navigation";
import { SectionTemplate } from "@/components/templates/SectionTemplate";
import { getRegistry } from "@/content/registry";
import { sectionHref } from "@/lib/links";
import { buildToc } from "@/lib/toc";

/**
 * One section: fetch the data, hand it to the fixed template.
 *
 * All presentation lives in `SectionTemplate`; this file only looks things up
 * and decides what 404s, so a section page's shape is defined in exactly one
 * place.
 */
export default function SectionView({
  slug,
  sectionId,
}: {
  slug: string;
  sectionId: string;
}) {
  const reg = getRegistry();

  const lesson = reg.getLesson(slug);
  if (!lesson) notFound();

  const nav = reg.sectionNeighbours(lesson, sectionId);
  if (!nav) notFound();
  const { section, index, total, prev, next } = nav;

  const quick = reg.quickCheckFor(lesson, section.id);
  const quizCount = reg.questionsForSection(lesson, section.id).length;

  const toc = buildToc(section.blocks);
  const lessonNav = lesson.sections.map((s) => ({
    id: s.id,
    label: s.title,
    tone: s.tone,
    href: sectionHref(lesson, s),
  }));

  return (
    <SectionTemplate
      lesson={{ slug: lesson.slug, label: lesson.label }}
      section={section}
      index={index}
      total={total}
      prev={prev}
      next={next}
      quick={quick}
      quizCount={quizCount}
      toc={toc}
      lessonNav={lessonNav}
    />
  );
}
