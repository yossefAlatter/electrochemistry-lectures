import type { Metadata } from "next";
import SectionView from "@/components/views/SectionView";
import { plainText } from "@/components/kit";
import { allLessons } from "@/content";

type Params = { slug: string; section: string };

export function generateStaticParams(): Params[] {
  return allLessons.flatMap((l) =>
    l.sections.map((s) => ({ slug: l.slug, section: s.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, section } = await params;
  const lesson = allLessons.find((l) => l.slug === slug);
  const s = lesson?.sections.find((x) => x.id === section);
  if (!s || !lesson) return { title: "Section not found" };
  return {
    title: `${s.title} — ${lesson.label}`,
    description: plainText(s.summary),
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug, section } = await params;
  return <SectionView slug={slug} sectionId={section} />;
}
