import type { Metadata } from "next";
import LessonView from "@/components/views/LessonView";
import { plainText } from "@/components/kit";
import { allLessons } from "@/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = allLessons.find((l) => l.slug === slug);
  if (!lesson) return { title: "Lesson not found" };
  return {
    title: `${lesson.label}: ${lesson.title}`,
    description: plainText(lesson.summary),
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <LessonView slug={slug} />;
}
