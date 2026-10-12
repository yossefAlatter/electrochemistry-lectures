import type { Metadata } from "next";
import CourseView from "@/components/views/CourseView";
import { allCourses } from "@/content";

type Params = { course: string };

export function generateStaticParams(): Params[] {
  return allCourses.map((c) => ({ course: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { course } = await params;
  const found = allCourses.find((c) => c.id === course);
  if (!found) return { title: "Course not found" };
  return {
    title: found.title,
    description: found.description,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { course } = await params;
  return <CourseView courseId={course} />;
}
