import type { Block } from "@/content/types";

/**
 * In-page navigation for a section.
 *
 * A section is a list of blocks with only three things that behave like
 * sub-headings: a heading block, a callout's title and a worked example's
 * title. Those become real <h2>/<h3> elements with ids, and this module
 * derives the table of contents from exactly the same data the renderer sees,
 * on the same helper, so the rail can never point at an anchor that does not
 * exist.
 *
 * Everything here is pure and deterministic: it runs once on the server to
 * produce plain data, and the client never needs the block array.
 */

export type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

/** The text a block contributes to the table of contents, if any. */
function blockHeading(block: Block): string | undefined {
  const raw =
    block.kind === "heading"
      ? block.text
      : block.kind === "callout" || block.kind === "worked"
        ? block.title
        : "";
  const trimmed = (raw ?? "").trim();
  return trimmed || undefined;
}

/** The heading level a block renders at. */
function blockLevel(block: Block): 2 | 3 {
  return block.kind === "heading" && block.level === 3 ? 3 : 2;
}

/**
 * A stable id for a heading.
 *
 * Titles are prose and may contain punctuation, so this keeps letters and
 * digits, collapses everything else to a separator, and trims. Two identical
 * titles in one section get the same id, which is why `buildToc` de-dupes
 * rather than appending a counter that the renderer would have to guess.
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/`/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "section"
  );
}

/** The headings a table of contents should list, in document order. */
export function buildToc(blocks: readonly Block[]): TocItem[] {
  const seen = new Set<string>();
  const items: TocItem[] = [];

  for (const block of blocks) {
    const raw = blockHeading(block);
    if (!raw) continue;

    let id = slugify(raw);
    while (seen.has(id)) id += "-2";
    seen.add(id);

    items.push({ id, label: raw, level: blockLevel(block) });
  }

  return items;
}

/**
 * The id a rendered block should carry. Must agree with `buildToc`, so it
 * runs the same de-duplication against the same prefix of the list.
 */
export function idForBlock(
  blocks: readonly Block[],
  index: number,
): string | undefined {
  const seen = new Set<string>();
  for (let i = 0; i <= index; i += 1) {
    const raw = blockHeading(blocks[i]);
    if (!raw) continue;
    let id = slugify(raw);
    while (seen.has(id)) id += "-2";
    seen.add(id);
    if (i === index) return id;
  }
  return undefined;
}
