// The lesson loader.
//
// SERVER ONLY. A lesson is a JSON file in `content/lessons/`, and this module
// reads that directory from disk and validates every file. That is what makes
// adding a lesson "just a JSON file": nothing else lists the lesson, because
// the directory is the list.
//
// Reading from disk means this cannot be imported by a client component. The
// pure URL builders live in `lib/links.ts` for that reason, and the navigation
// tree the sidebar needs is passed down from the server layout as props.

import fs from "node:fs";
import path from "node:path";
import { parseLesson } from "./schema";
import type { Lesson } from "./types";

/** Where lesson files live, relative to the project root. */
export const LESSONS_DIR = path.join(process.cwd(), "content", "lessons");

/**
 * The second course's lessons. Each course owns its own directory, so a
 * `loadAllLessons(dir)` call is all that separates one course's lessons from
 * another's; the directory is still the list.
 */
export const SPECTROSCOPY_LESSONS_DIR = path.join(
  process.cwd(),
  "content",
  "spectroscopy",
  "lessons",
);

/** Read and validate every `*.json` in the lessons directory. */
export function loadJsonLessons(dir: string = LESSONS_DIR): Lesson[] {
  let files: string[];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
  } catch {
    // No directory yet (a fresh clone before the first migration): the
    // TypeScript lessons alone are a valid, complete course.
    return [];
  }

  return files.map((file) => {
    const full = path.join(dir, file);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err);
      throw new Error(`content/lessons/${file}: invalid JSON: ${why}`);
    }
    return parseLesson(`content/lessons/${file}`, raw);
  });
}

/**
 * Every lesson in the course, sorted into course order.
 */
export function loadAllLessons(dir: string = LESSONS_DIR): Lesson[] {
  const all = loadJsonLessons(dir).sort((a, b) => a.order - b.order);

  const seen = new Set<string>();
  for (const lesson of all) {
    if (seen.has(lesson.slug)) {
      throw new Error(`duplicate lesson slug ${JSON.stringify(lesson.slug)}`);
    }
    seen.add(lesson.slug);
  }

  return all;
}
