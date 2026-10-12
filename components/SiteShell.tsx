"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  courseHref,
  homeHref,
  lessonHref,
  quizHref,
  sectionHref,
} from "@/lib/links";
import type { NavCourse, NavSubject } from "@/lib/nav";
import ThemeToggle from "@/components/ThemeToggle";
import { t } from "@/lib/i18n";

/**
 * App shell: a permanent sidebar from `lg` up, and a slide in drawer with a
 * hamburger below it. The drawer closes on navigation and on Escape, and it
 * traps the page behind an overlay so a stray tap cannot scroll it.
 *
 * The sidebar is generated from the subject registry, so a new subject,
 * course, lesson or section appears here without edits here.
 *
 * Side placement follows the text direction: the drawer hangs off the inline
 * start edge, which is the left in this LTR layout.
 */
export function SiteShell({
  nav,
  children,
}: {
  /** The slim navigation tree, derived on the server. */
  nav: NavSubject[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const d = t();

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // stop the page behind the drawer from scrolling
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-h-full">
      {/* ---------- mobile top bar ---------- */}
      <header className="no-print sticky top-0 z-40 border-b border-rule bg-surface/90 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={d.navOpen}
            aria-expanded={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rule text-ink transition-colors active:bg-tint"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M3 5.5h14M3 10h14M3 14.5h14"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link href={homeHref()} className="min-w-0 flex-1">
            <span className="block truncate font-serif text-[1.05rem] font-semibold text-ink">
              {d.siteTitle}
            </span>
            <span className="block truncate text-[0.66rem] font-bold uppercase tracking-[0.16em] text-accent">
              {d.siteTagline}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ---------- drawer backdrop ---------- */}
      {open && (
        <button
          type="button"
          aria-label={d.navClose}
          onClick={() => setOpen(false)}
          className="no-print fixed inset-0 z-40 bg-ink/55 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ---------- sidebar ---------- */}
      <nav
        aria-label={d.navCourseNavigation}
        className={[
          "no-print fixed inset-y-0 start-0 z-50 w-[17rem] max-w-[85vw]",
          "overflow-y-auto overscroll-contain border-e border-rule bg-surface",
          "transition-transform duration-200 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarBody nav={nav} onNavigate={() => setOpen(false)} />
      </nav>

      {/* ---------- page ---------- */}
      <div className="lg:ps-[17rem]">
        <main
          id="main"
          className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarBody({
  nav,
  onNavigate,
}: {
  nav: NavSubject[];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const d = t();
  const courses = nav.flatMap((s) => s.courses);
  const activeCourse = courses.find((course) =>
    isCourseActive(course, pathname),
  );

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-rule bg-surface-2 px-5 py-4">
        <Link href={homeHref()} onClick={onNavigate} className="min-w-0">
          <span className="text-shine block font-serif text-lg leading-tight font-semibold">
            {d.siteTitle}
          </span>
          <span className="mt-0.5 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
            {d.siteTagline}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={onNavigate}
            aria-label={d.navClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink-soft lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        {activeCourse ? (
          <CourseLessons
            course={activeCourse}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : (
          <CourseIndex courses={courses} onNavigate={onNavigate} />
        )}

        <div className="rounded-lg border border-rule bg-surface-2 px-3 py-3 text-[0.8rem] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">{d.navHowBuiltTitle}</p>
          <p className="mt-1">{d.navHowBuiltBody}</p>
        </div>
      </div>

      <div className="border-t border-rule px-5 py-4 text-[0.75rem] text-faint">
        <p className="font-semibold text-ink-soft">Yossef Hafez Alatter</p>
        <p>{d.navSecondAuthor}</p>
      </div>
    </div>
  );
}

/** Does this URL belong to the course page or one of its lessons? */
function isCourseActive(course: NavCourse, pathname: string): boolean {
  const base = courseHref(course);
  if (pathname === base || pathname.startsWith(`${base}/`)) return true;
  return course.lessons.some((lesson) => {
    const lb = lessonHref(lesson);
    return pathname === lb || pathname.startsWith(`${lb}/`);
  });
}

/** Shown when no course is open: the list of courses to choose from. */
function CourseIndex({
  courses,
  onNavigate,
}: {
  courses: NavCourse[];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const d = t();
  return (
    <div className="mb-6">
      <h2 className="px-2 pb-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-faint">
        {d.coursesHeading}
      </h2>
      <ul className="space-y-0.5">
        {courses.map((course) => {
          const href = courseHref(course);
          const active = pathname === href;
          return (
            <li key={course.id}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-baseline justify-between gap-2 rounded-lg px-2.5 py-2.5",
                  "text-[0.94rem] leading-snug transition-colors",
                  active
                    ? "bg-accent-light font-semibold text-accent-dark"
                    : "text-ink-soft hover:bg-tint hover:text-ink",
                ].join(" ")}
              >
                <span className="min-w-0 font-semibold">{course.title}</span>
                <span className="shrink-0 text-[0.68rem] font-semibold text-faint tabular-nums">
                  {course.lessons.length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Shown inside a course: its lessons, with sections under the active one. */
function CourseLessons({
  course,
  pathname,
  onNavigate,
}: {
  course: NavCourse;
  pathname: string;
  onNavigate: () => void;
}) {
  const d = t();
  return (
    <div className="mb-6">
      <Link
        href={homeHref()}
        onClick={onNavigate}
        className="mb-2 inline-flex items-center gap-1.5 px-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-faint transition-colors hover:text-accent"
      >
        <span aria-hidden="true">←</span>
        {d.allCourses}
      </Link>
      <h2 className="px-2 pb-1.5">
        <Link
          href={courseHref(course)}
          onClick={onNavigate}
          className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-accent"
        >
          {course.title}
        </Link>
      </h2>
      <ul className="space-y-0.5">
        {course.lessons.map((lesson) => {
          const lessonBase = lessonHref(lesson);
          const onLesson =
            pathname === lessonBase || pathname.startsWith(`${lessonBase}/`);
          return (
            <li key={lesson.slug}>
              <Link
                href={lessonBase}
                onClick={onNavigate}
                aria-current={pathname === lessonBase ? "page" : undefined}
                className={[
                  "flex items-baseline justify-between gap-2 rounded-lg px-2.5 py-2.5",
                  "text-[0.94rem] leading-snug transition-colors",
                  onLesson
                    ? "bg-accent-light font-semibold text-accent-dark"
                    : "text-ink-soft hover:bg-tint hover:text-ink",
                ].join(" ")}
              >
                <span className="min-w-0">{lesson.label}</span>
                <span
                  className={[
                    "shrink-0 text-[0.68rem] font-semibold tabular-nums",
                    onLesson ? "text-accent" : "text-faint",
                  ].join(" ")}
                >
                  {lesson.sections.length}
                </span>
              </Link>

              {onLesson && (
                <ul className="mb-1 ms-2.5 mt-0.5 space-y-0.5 border-s border-rule ps-2">
                  {lesson.sections.map((s) => (
                    <SubLink
                      key={s.id}
                      href={sectionHref(lesson, s)}
                      label={s.title}
                      tone={s.tone}
                      active={pathname === sectionHref(lesson, s)}
                      onNavigate={onNavigate}
                    />
                  ))}
                  <SubLink
                    href={quizHref(lesson)}
                    label={d.navAllQuestions}
                    tone={undefined}
                    active={pathname === quizHref(lesson)}
                    onNavigate={onNavigate}
                  />
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SubLink({
  href,
  label,
  tone,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  tone?: string;
  active?: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        data-tone={tone}
        aria-current={active ? "page" : undefined}
        className={[
          "flex min-h-9 items-center gap-2 rounded-md px-2 text-[0.85rem] leading-snug transition-colors",
          active
            ? "bg-[color:var(--tone-soft)] font-semibold text-ink"
            : "text-ink-soft hover:bg-[color:var(--tone-soft)] hover:text-ink",
        ].join(" ")}
      >
        {tone && (
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--tone)]"
          />
        )}
        <span className="min-w-0">{label}</span>
      </Link>
    </li>
  );
}
